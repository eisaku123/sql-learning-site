import { NextResponse } from "next/server";
import { getLessonBySlug } from "@/lib/curriculum";

// 解答の正誤を判定（サーバーサイドで期待カラムを照合）
export async function POST(req: Request) {
  const { lessonSlug, exerciseId, resultColumns } = await req.json();

  const lesson = getLessonBySlug(lessonSlug);
  if (!lesson) {
    return NextResponse.json({ correct: false, message: "レッスンが見つかりません" });
  }

  const exercise = lesson.exercises.find((e) => e.id === exerciseId);
  if (!exercise) {
    return NextResponse.json({ correct: false, message: "問題が見つかりません" });
  }

  // 結果のカラム名が期待値と一致するか確認
  const expected = exercise.expectedColumns.map((c) => c.toLowerCase()).sort();
  const actual = (resultColumns as string[]).map((c) => c.toLowerCase()).sort();

  const correct =
    expected.length === actual.length && expected.every((col, i) => col === actual[i]);

  return NextResponse.json({
    correct,
    message: correct ? "正解です！" : `不正解です。期待するカラム: ${exercise.expectedColumns.join(", ")}`,
  });
}
