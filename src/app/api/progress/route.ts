import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET: ユーザーの進捗を取得
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未認証" }, { status: 401 });
  }

  const progress = await prisma.userProgress.findMany({
    where: { userId: session.user.id },
  });
  const exercises = await prisma.userExercise.findMany({
    where: { userId: session.user.id },
  });

  return NextResponse.json({ progress, exercises });
}

// POST: レッスン完了を記録
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未認証" }, { status: 401 });
  }

  const { lessonSlug, exerciseId, solved } = await req.json();

  if (exerciseId !== undefined) {
    // 問題の解答を記録
    const existing = await prisma.userExercise.findUnique({
      where: { userId_exerciseId: { userId: session.user.id, exerciseId } },
    });
    if (existing) {
      await prisma.userExercise.update({
        where: { userId_exerciseId: { userId: session.user.id, exerciseId } },
        data: {
          attempts: { increment: 1 },
          solved: solved || existing.solved,
          solvedAt: solved && !existing.solved ? new Date() : existing.solvedAt,
        },
      });
    } else {
      await prisma.userExercise.create({
        data: {
          userId: session.user.id,
          exerciseId,
          solved: !!solved,
          attempts: 1,
          solvedAt: solved ? new Date() : null,
        },
      });
    }
    return NextResponse.json({ ok: true });
  }

  if (lessonSlug) {
    // レッスン完了を記録
    await prisma.userProgress.upsert({
      where: { userId_lessonSlug: { userId: session.user.id, lessonSlug } },
      update: { completed: true, completedAt: new Date() },
      create: {
        userId: session.user.id,
        lessonSlug,
        completed: true,
        completedAt: new Date(),
      },
    });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "パラメータが不正です" }, { status: 400 });
}
