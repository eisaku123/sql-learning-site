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

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  if (!subscription) {
    return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
  }

  // すでに解約済みなら何もしない
  if (subscription.status === "cancel_at_period_end") {
    return NextResponse.json({ ok: true });
  }

  const stripe = await getStripeClient();

  // 期間終了時にキャンセル（即時停止ではなく期間末まで使える）
  await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
    cancel_at_period_end: true,
  });

  // DBを即時更新（webhookの到着を待たない）
  await prisma.subscription.update({
    where: { userId: session.user.id },
    data: { status: "cancel_at_period_end" },
  });

  return NextResponse.json({ ok: true });
}
