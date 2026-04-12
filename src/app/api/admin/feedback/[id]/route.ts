import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

// 管理者がスレッドを取得
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const isAdmin = await requireAdmin();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const feedback = await prisma.feedback.findUnique({
    where: { id },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  if (!feedback) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // 既読にする
  await prisma.feedback.update({ where: { id }, data: { isRead: true } });

  return NextResponse.json(feedback);
}

// 管理者が返信を送信
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const isAdmin = await requireAdmin();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { body } = await req.json();
  if (!body?.trim()) return NextResponse.json({ error: "Empty message" }, { status: 400 });

  const [message] = await prisma.$transaction([
    prisma.feedbackMessage.create({
      data: { feedbackId: id, body: body.trim(), isAdmin: true },
    }),
    prisma.feedback.update({
      where: { id },
      data: { hasReply: true, isRead: true },
    }),
  ]);

  return NextResponse.json(message);
}
