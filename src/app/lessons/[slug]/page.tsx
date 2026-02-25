"use client";

import { use, useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { getLessonBySlug, LESSONS } from "@/lib/curriculum";
import Header from "@/components/Header";
import dynamic from "next/dynamic";
import ExercisePanel from "@/components/ExercisePanel";
import Fireworks from "@/components/Fireworks";

const SqlEditor = dynamic(() => import("@/components/SqlEditor"), { ssr: false });

export default function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const lesson = getLessonBySlug(slug);
  const { data: session } = useSession();

  const [solvedIds, setSolvedIds] = useState<string[]>([]);
  const [lastResultColumns, setLastResultColumns] = useState<string[]>([]);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);

  // 既存の進捗を取得
  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/progress")
      .then((r) => r.json())
      .then((data) => {
        const solved = (data.exercises ?? [])
          .filter((e: { solved: boolean; exerciseId: string }) => e.solved)
          .map((e: { exerciseId: string }) => e.exerciseId);
        setSolvedIds(solved);
        const done = (data.progress ?? []).some(
          (p: { lessonSlug: string; completed: boolean }) =>
            p.lessonSlug === slug && p.completed
        );
        setLessonCompleted(done);
      })
      .catch(() => {});
  }, [session, slug]);

  const handleSolve = useCallback((exerciseId: string) => {
    setSolvedIds((prev) => {
      if (prev.includes(exerciseId)) return prev;
      const next = [...prev, exerciseId];
      // 全問正解になったら花火を打ち上げる（初回ロード時は除く）
      if (lesson?.exercises.every((ex) => next.includes(ex.id))) {
        setTimeout(() => setShowFireworks(true), 200);
      }
      return next;
    });
  }, [lesson]);

  const handleComplete = async () => {
    if (!session?.user || lessonCompleted) return;
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonSlug: slug }),
    });
    setLessonCompleted(true);
  };

  if (!lesson) {
    return (
      <>
        <Header />
        <main style={{ paddingTop: "80px", padding: "80px 2rem", textAlign: "center" }}>
          <p style={{ color: "#8888aa" }}>レッスンが見つかりません</p>
          <Link href="/lessons" style={{ color: "#667eea" }}>
            レッスン一覧へ
          </Link>
        </main>
      </>
    );
  }

  const lessonIdx = LESSONS.findIndex((l) => l.slug === slug);
  const prevLesson = lessonIdx > 0 ? LESSONS[lessonIdx - 1] : null;
  const nextLesson = lessonIdx < LESSONS.length - 1 ? LESSONS[lessonIdx + 1] : null;
  const levelLabel = lesson.level === "beginner" ? "初級" : "中級";
  const levelColor = lesson.level === "beginner" ? "#34d399" : "#667eea";

  const allSolved = lesson.exercises.every((ex) => solvedIds.includes(ex.id));

  return (
    <>
      {showFireworks && (
        <Fireworks onDone={() => setShowFireworks(false)} />
      )}
      <Header />
      <main style={{ paddingTop: "60px" }}>
        {/* ヘッダー帯 */}
        <div
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            padding: "1.5rem 2rem",
            maxWidth: "1400px",
            margin: "0 auto",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <Link href="/lessons" style={{ color: "#8888aa", textDecoration: "none", fontSize: "0.85rem" }}>
              ← レッスン一覧
            </Link>
            <span style={{ color: "#546e7a" }}>/</span>
            <span
              style={{
                background: `${levelColor}1a`,
                border: `1px solid ${levelColor}40`,
                borderRadius: "20px",
                padding: "0.1rem 0.6rem",
                color: levelColor,
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            >
              {levelLabel}
            </span>
            {lessonCompleted && (
              <span
                style={{
                  background: "rgba(52,211,153,0.1)",
                  border: "1px solid rgba(52,211,153,0.3)",
                  borderRadius: "20px",
                  padding: "0.1rem 0.6rem",
                  color: "#34d399",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                }}
              >
                完了済み
              </span>
            )}
          </div>
          <h1 style={{ color: "#e0e0f0", fontSize: "1.5rem", fontWeight: 700 }}>{lesson.title}</h1>
        </div>

        {/* 2カラムレイアウト */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            maxWidth: "1400px",
            margin: "0 auto",
            minHeight: "calc(100vh - 130px)",
          }}
        >
          {/* 左: 解説 */}
          <div
            style={{
              padding: "2rem",
              borderRight: "1px solid rgba(255,255,255,0.06)",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                color: "#c0c0d8",
                lineHeight: 1.8,
                fontSize: "0.92rem",
              }}
              dangerouslySetInnerHTML={{ __html: lesson.content }}
            />

            {/* ナビゲーション */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "3rem",
                paddingTop: "1.5rem",
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {prevLesson ? (
                <Link
                  href={`/lessons/${prevLesson.slug}`}
                  style={{ color: "#667eea", textDecoration: "none", fontSize: "0.85rem" }}
                >
                  ← {prevLesson.title}
                </Link>
              ) : (
                <span />
              )}
              {nextLesson && (
                <Link
                  href={`/lessons/${nextLesson.slug}`}
                  style={{ color: "#667eea", textDecoration: "none", fontSize: "0.85rem" }}
                >
                  {nextLesson.title} →
                </Link>
              )}
            </div>
          </div>

          {/* 右: エディタ + 練習問題 */}
          <div
            style={{
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
              overflowY: "auto",
            }}
          >
            <section>
              <h3
                style={{
                  color: "#8888aa",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: "0.75rem",
                }}
              >
                SQL エディタ
              </h3>
              <SqlEditor
                initialQuery="SELECT * FROM employees LIMIT 5;"
                onResult={setLastResultColumns}
              />
            </section>

            <section>
              <h3
                style={{
                  color: "#8888aa",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: "0.75rem",
                }}
              >
                練習問題
              </h3>
              <ExercisePanel
                exercises={lesson.exercises}
                lessonSlug={slug}
                solvedIds={solvedIds}
                onSolve={handleSolve}
                lastResultColumns={lastResultColumns}
              />
            </section>

            {/* レッスン完了ボタン */}
            {session?.user && (
              <button
                onClick={handleComplete}
                disabled={lessonCompleted}
                style={{
                  background: lessonCompleted
                    ? "rgba(52,211,153,0.15)"
                    : allSolved
                      ? "linear-gradient(135deg, #34d399, #059669)"
                      : "rgba(255,255,255,0.05)",
                  border: lessonCompleted
                    ? "1px solid rgba(52,211,153,0.4)"
                    : "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  color: lessonCompleted ? "#34d399" : allSolved ? "#fff" : "#8888aa",
                  padding: "0.75rem",
                  cursor: lessonCompleted ? "not-allowed" : "pointer",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  transition: "all 0.2s",
                }}
              >
                {lessonCompleted ? "✅ レッスン完了済み" : "このレッスンを完了にする"}
              </button>
            )}
          </div>
        </div>
      </main>
      <style>{lessonContentStyle}</style>
    </>
  );
}

const lessonContentStyle = `
  .fade-in-up h2 { color: #e0e0f0; font-size: 1.1rem; font-weight: 700; margin: 1.5rem 0 0.75rem; }
  h2 { color: #e0e0f0; font-size: 1.1rem; font-weight: 700; margin: 1.5rem 0 0.75rem; }
  h3 { color: #e0e0f0; font-size: 0.95rem; font-weight: 600; margin: 1.25rem 0 0.5rem; }
  pre { background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1rem; overflow-x: auto; margin: 1rem 0; }
  code { font-family: 'Fira Code', 'Consolas', monospace; font-size: 0.85rem; color: #c0c0d8; }
  pre code { color: inherit; }
  p { margin: 0.75rem 0; }
  ul, ol { padding-left: 1.5rem; margin: 0.75rem 0; }
  li { margin: 0.35rem 0; color: #c0c0d8; }
  table { border-collapse: collapse; width: 100%; margin: 1rem 0; font-size: 0.85rem; }
  th { background: rgba(102,126,234,0.15); color: #667eea; padding: 0.5rem 0.75rem; text-align: left; border: 1px solid rgba(255,255,255,0.08); }
  td { padding: 0.4rem 0.75rem; border: 1px solid rgba(255,255,255,0.05); color: #c0c0d8; }
  strong { color: #e0e0f0; font-weight: 600; }
`;
