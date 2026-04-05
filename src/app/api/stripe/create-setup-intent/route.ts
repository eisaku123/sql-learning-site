import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getStripeClient } from "@/lib/stripe";
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
    const stripe = await getStripeClient();

    // 既存のStripe顧客IDを取得、なければ新規作成
    let customerId: string;
    const existingSub = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    // すでにアクティブなサブスクリプションがある場合はブロック
    if (existingSub?.stripeSubscriptionId && (existingSub.status === "active" || existingSub.status === "cancel_at_period_end")) {
      if (existingSub.currentPeriodEnd > new Date()) {
        return NextResponse.json({ error: "ALREADY_SUBSCRIBED" }, { status: 409 });
      }
    }

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

    // SetupIntentを作成してカード情報を安全に収集
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ["card"],
      usage: "off_session",
      metadata: { userId: session.user.id },
    });

    return NextResponse.json({
      clientSecret: setupIntent.client_secret,
      customerId,
    });
  } catch (err) {
    console.error("[create-setup-intent] error:", err);
    const message = err instanceof Error ? err.message : "不明なエラー";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
