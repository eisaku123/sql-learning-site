import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { category, message } = body;

  if (!category || !message?.trim()) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);

  await prisma.feedback.create({
    data: {
      category,
      message: message.trim(),
      userId: session?.user?.id ?? null,
      userEmail: session?.user?.email ?? null,
    },
  });

  return NextResponse.json({ ok: true });
}
