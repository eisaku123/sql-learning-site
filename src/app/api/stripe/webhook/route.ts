import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { sendPremiumWelcomeEmail } from "@/lib/email";
import type Stripe from "stripe";

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

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      if (!userId || !session.subscription || !session.customer) break;

      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );

      const periodEnd = getPeriodEnd(subscription);

      await prisma.subscription.upsert({
        where: { userId },
        create: {
          userId,
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: subscription.id,
          status: subscription.status,
          currentPeriodEnd: periodEnd,
        },
        update: {
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: subscription.id,
          status: subscription.status,
          currentPeriodEnd: periodEnd,
        },
      });

      // 購入完了メールを送信
      if (session.customer_email) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        await sendPremiumWelcomeEmail({
          to: session.customer_email,
          name: user?.name,
          currentPeriodEnd: periodEnd,
        }).catch(() => {
          // メール送信失敗はログのみ（決済処理は成功させる）
          console.error("Failed to send welcome email");
        });
      }
      break;
    }

    case "customer.subscription.updated": {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const subscription = event.data.object as any;

      // cancel_at_period_end が true の場合は専用ステータスで記録
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
