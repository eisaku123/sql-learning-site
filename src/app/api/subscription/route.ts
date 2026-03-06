import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ active: false });
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  const active =
    subscription?.status === "active" &&
    subscription.currentPeriodEnd > new Date();

  return NextResponse.json({ active, subscription });
}
