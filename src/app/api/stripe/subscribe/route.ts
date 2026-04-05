import { NextRequest, NextResponse } from "next/server";
import { getStripeClient, getStripePriceId } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { sendPremiumWelcomeEmail } from "@/lib/email";

// SetupIntent確認後にサブスクリプションを作成するAPI
export async function POST(req: NextRequest) {
  try {
    const { setupIntentId } = await req.json();
    if (!setupIntentId) {
      return NextResponse.json({ error: "setupIntentId が必要です" }, { status: 400 });
    }

    const [stripe, priceId] = await Promise.all([getStripeClient(), getStripePriceId()]);

    // SetupIntentからカード情報とユーザーIDを取得
    const setupIntent = await stripe.setupIntents.retrieve(setupIntentId);
    const userId = setupIntent.metadata?.userId;
    const customerId = setupIntent.customer as string;
    const paymentMethodId = setupIntent.payment_method as string;

    if (!userId || !customerId || !paymentMethodId) {
      return NextResponse.json({ error: "SetupIntent の情報が不足しています" }, { status: 400 });
    }

    // カードをデフォルト支払い方法として設定
    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    // サブスクリプションを作成（デフォルト支払い方法で即時決済）
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subscription = await (stripe.subscriptions.create as any)({
      customer: customerId,
      items: [{ price: priceId }],
      default_payment_method: paymentMethodId,
      metadata: { userId },
    });

    console.log("[subscribe] subscription.status:", subscription.status, "id:", subscription.id);

    // サブスクリプションがすぐにアクティブになった場合はDBを即時更新しメール送信
    // （Webhookでも処理されるが、新フローではここで確実に処理する）
    if (subscription.status === "active") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const periodEnd = (subscription as any).current_period_end
        ? new Date((subscription as any).current_period_end * 1000)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      await prisma.subscription.upsert({
        where: { userId },
        create: {
          userId,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscription.id,
          status: "active",
          currentPeriodEnd: periodEnd,
        },
        update: {
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscription.id,
          status: "active",
          currentPeriodEnd: periodEnd,
        },
      });

      // ウェルカムメール送信
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user?.email) {
        await sendPremiumWelcomeEmail({
          to: user.email,
          name: user.name,
          currentPeriodEnd: periodEnd,
        }).catch((e) => console.error("[subscribe] welcome email failed:", e));
      }
    }

    return NextResponse.json({ status: subscription.status });
  } catch (err) {
    console.error("[subscribe] error:", err);
    const message = err instanceof Error ? err.message : "不明なエラー";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
