import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// ユーザーが自分のフィードバックスレッドを取得
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const feedback = await prisma.feedback.findUnique({
    where: { id },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  if (!feedback || feedback.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(feedback);
}

// ユーザーが追加メッセージを送信
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const feedback = await prisma.feedback.findUnique({ where: { id } });
  if (!feedback || feedback.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { body } = await req.json();
  if (!body?.trim()) return NextResponse.json({ error: "Empty message" }, { status: 400 });

  const message = await prisma.feedbackMessage.create({
    data: { feedbackId: id, body: body.trim(), isAdmin: false },
  });

  // 管理者が読んでいない状態にリセット
  await prisma.feedback.update({ where: { id }, data: { isRead: false } });

  return NextResponse.json(message);
}
