import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getStripeClient, getStripePriceId } from "@/lib/stripe";
import { prisma } from "@/lib/db";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const setting = await prisma.siteSetting.findUnique({
    where: { key: "premium_signup_enabled" },
  });
  if (setting?.value === "false") {
    return NextResponse.json({ error: "現在、新規申し込みを停止しています" }, { status: 403 });
  }

  try {
    const [stripe, priceId] = await Promise.all([getStripeClient(), getStripePriceId()]);

    // 既存のStripe顧客IDを取得、なければ新規作成
    let customerId: string;
    const existingSub = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    if (existingSub?.stripeCustomerId) {
      customerId = existingSub.stripeCustomerId;
    } else {
      const customer = await stripe.customers.create({
        email: session.user.email!,
        name: session.user.name ?? undefined,
        metadata: { userId: session.user.id },
      });
      customerId = customer.id;
    }

    // サブスクリプションを未完了状態で作成
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subscription = await (stripe.subscriptions.create as any)({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
      metadata: { userId: session.user.id },
    });

    console.log("[create-subscription] subscription.status:", subscription.status);
    console.log("[create-subscription] latest_invoice type:", typeof subscription.latest_invoice);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const invoice = subscription.latest_invoice as any;
    const paymentIntent = invoice?.payment_intent;

    console.log("[create-subscription] paymentIntent:", paymentIntent?.id, "status:", paymentIntent?.status);

    if (!paymentIntent?.client_secret) {
      console.error("[create-subscription] No client_secret. invoice:", JSON.stringify(invoice, null, 2));
      return NextResponse.json(
        { error: `Payment intent が取得できませんでした (sub: ${subscription.id})` },
        { status: 500 }
      );
    }

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("[create-subscription] error:", err);
    const message = err instanceof Error ? err.message : "不明なエラー";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
