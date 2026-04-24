import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST() {
  try {
    const date = new Date().toLocaleDateString("sv-SE"); // "YYYY-MM-DD"
    await prisma.pageView.upsert({
      where: { date },
      update: { count: { increment: 1 } },
      create: { date, count: 1 },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
