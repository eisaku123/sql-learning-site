import { NextRequest, NextResponse } from "next/server";
import { getStripeClient, getStripeWebhookSecret } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { sendPremiumWelcomeEmail } from "@/lib/email";
import type Stripe from "stripe";

async function handleSubscriptionActivated(
  stripe: Stripe,
  customerId: string,
  subscriptionId: string
) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const userId = subscription.metadata?.userId;
  if (!userId) return;

  const periodEnd = getPeriodEnd(subscription);

  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      currentPeriodEnd: periodEnd,
    },
    update: {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      currentPeriodEnd: periodEnd,
    },
  });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.email) {
    await sendPremiumWelcomeEmail({
      to: user.email,
      name: user.name,
      currentPeriodEnd: periodEnd,
    }).catch(() => {});
  }
}

export const dynamic = "force-dynamic";

// Stripe 2025 API では current_period_end が型定義から除外されているため any でアクセス
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getPeriodEnd(sub: any): Date {
  const ts = sub?.current_period_end ?? sub?.items?.data?.[0]?.current_period_end;
  return ts ? new Date(ts * 1000) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  const [stripe, webhookSecret] = await Promise.all([
    getStripeClient(),
    getStripeWebhookSecret(),
  ]);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    // Stripe Checkout経由（旧フロー）
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      if (!userId || !session.subscription || !session.customer) break;
      await handleSubscriptionActivated(stripe, session.customer as string, session.subscription as string);
      break;
    }

    // Payment Element経由（新フロー）- 初回決済成功時
    case "invoice.payment_succeeded": {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const invoice = event.data.object as any;
      // 初回サブスクリプション作成時のみ処理（更新時は customer.subscription.updated で処理）
      if (invoice.billing_reason !== "subscription_create") break;
      const subscriptionId = invoice.subscription as string;
      const customerId = invoice.customer as string;
      if (!subscriptionId || !customerId) break;
      await handleSubscriptionActivated(stripe, customerId, subscriptionId);
      break;
    }

    case "customer.subscription.updated": {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const subscription = event.data.object as any;

      const status =
        subscription.cancel_at_period_end ? "cancel_at_period_end" : subscription.status;

      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          status,
          currentPeriodEnd: getPeriodEnd(subscription),
        },
      });
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;

      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: { status: "canceled" },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
