"use client";

import { use, useState, useCallback, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getPremiumLessonBySlug, PREMIUM_LESSONS } from "@/lib/premium-curriculum";
import Header from "@/components/Header";
import dynamic from "next/dynamic";
import ExercisePanel from "@/components/ExercisePanel";
import Fireworks from "@/components/Fireworks";
import TableReferenceModal from "@/components/TableReferenceModal";
import LessonCompletionModal from "@/components/LessonCompletionModal";
import type { SqlEditorHandle } from "@/components/SqlEditor";

const SqlEditor = dynamic(() => import("@/components/SqlEditor"), { ssr: false });

export default function PremiumLessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const lesson = getPremiumLessonBySlug(slug);
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isActive, setIsActive] = useState<boolean | null>(null);
  const [solvedIds, setSolvedIds] = useState<string[]>([]);
  const [lastResult, setLastResult] = useState<{ columns: string[]; rows: (string | number | null)[][] } | null>(null);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showExplanation, setShowExplanation] = useState(true);
  const [activeExerciseIdx, setActiveExerciseIdx] = useState(0);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const sqlEditorRef = useRef<SqlEditorHandle>(null);
  const runAnswerSql = useCallback((sql: string) => sqlEditorRef.current?.runSql(sql) ?? null, []);

  // 問題切り替え時にDBをリセットして前の問題のCREATE TABLEなどを消す
  useEffect(() => {
    sqlEditorRef.current?.resetDb();
    setLastResult(null);
  }, [activeExerciseIdx]);

  // 認証チェック
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // サブスクリプション確認
  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/subscription")
      .then((r) => r.json())
      .then((data) => setIsActive(data.active));
  }, [session]);

  // 進捗取得
  useEffect(() => {
    if (!session?.user || !isActive) return;
    fetch("/api/progress")
      .then((r) => r.json())
      .then((data) => {
        const solved = (data.exercises ?? [])
          .filter((e: { solved: boolean }) => e.solved)
          .map((e: { exerciseId: string }) => e.exerciseId);
        setSolvedIds(solved);
        const done = (data.progress ?? []).some(
          (p: { lessonSlug: string; completed: boolean }) =>
            p.lessonSlug === slug && p.completed
        );
        setLessonCompleted(done);
        setProgressLoaded(true);
      })
      .catch(() => {});
  }, [session, isActive, slug]);

  // 全問正解時に自動でレッスン完了・花火
  useEffect(() => {
    if (!progressLoaded || !lesson || !session?.user || lessonCompleted) return;
    if (solvedIds.length === 0) return;
    if (lesson.exercises.every((ex) => solvedIds.includes(ex.id))) {
      setTimeout(() => setShowFireworks(true), 200);
      setLessonCompleted(true);
      fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonSlug: slug }),
      }).catch(() => {});
    }
  }, [solvedIds, progressLoaded, lesson, session, slug, lessonCompleted]);

  const handleSolve = useCallback((exerciseId: string) => {
    setSolvedIds((prev) => {
      if (prev.includes(exerciseId)) return prev;
      return [...prev, exerciseId];
    });
  }, []);

  // ロード中
  if (status === "loading" || isActive === null) {
    return (
      <>
        <Header />
        <main style={{ paddingTop: "80px", textAlign: "center", padding: "80px 2rem" }}>
          <p style={{ color: "#8888aa" }}>読み込み中...</p>
        </main>
      </>
    );
  }

  // サブスク未加入
  if (!isActive) {
    return (
      <>
        <Header />
        <main
          style={{
            paddingTop: "60px",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 2rem",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: "480px" }}>
            <div
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                background: "rgba(102,126,234,0.1)",
                border: "2px solid rgba(102,126,234,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.8rem",
                margin: "0 auto 1.5rem",
              }}
            >
              ⭐
            </div>
            <h1 style={{ color: "#e0e0f0", fontWeight: 800, fontSize: "1.6rem", marginBottom: "1rem" }}>
              プレミアム限定コンテンツ
            </h1>
            <p style={{ color: "#8888aa", lineHeight: 1.8, marginBottom: "2rem" }}>
              月額100円でプレミアムコース全100問にアクセスできます。
            </p>
            <Link
              href="/pricing"
              style={{
                display: "inline-block",
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                color: "#fff",
                textDecoration: "none",
                padding: "0.85rem 2.5rem",
                borderRadius: "50px",
                fontWeight: 700,
                fontSize: "1rem",
              }}
            >
              料金プランを見る →
            </Link>
          </div>
        </main>
      </>
    );
  }

  if (!lesson) {
    return (
      <>
        <Header />
        <main style={{ paddingTop: "80px", padding: "80px 2rem", textAlign: "center" }}>
          <p style={{ color: "#8888aa" }}>レッスンが見つかりません</p>
          <Link href="/premium/lessons" style={{ color: "#667eea" }}>
            プレミアムレッスン一覧へ
          </Link>
        </main>
      </>
    );
  }

  const lessonIdx = PREMIUM_LESSONS.findIndex((l) => l.slug === slug);
  const prevLesson = lessonIdx > 0 ? PREMIUM_LESSONS[lessonIdx - 1] : null;
  const nextLesson = lessonIdx < PREMIUM_LESSONS.length - 1 ? PREMIUM_LESSONS[lessonIdx + 1] : null;
  const levelLabel = lesson.level === "beginner" ? "初級" : "中級";
  const levelColor = lesson.level === "beginner" ? "#34d399" : "#667eea";

  return (
    <>
      {showFireworks && <Fireworks onDone={() => {
        setShowFireworks(false);
        setShowCompletionModal(true);
      }} />}
      {showCompletionModal && (
        <LessonCompletionModal
          nextLesson={nextLesson}
          nextLessonHref={nextLesson ? `/premium/lessons/${nextLesson.slug}` : undefined}
          lessonListHref="/premium/lessons"
          onClose={() => setShowCompletionModal(false)}
        />
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
            <Link href="/premium/lessons" style={{ color: "#8888aa", textDecoration: "none", fontSize: "0.85rem" }}>
              ← プレミアムレッスン一覧
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
            <span
              style={{
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                borderRadius: "20px",
                padding: "0.1rem 0.6rem",
                color: "#fff",
                fontSize: "0.7rem",
                fontWeight: 700,
              }}
            >
              PREMIUM
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
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h1 style={{ color: "#e0e0f0", fontSize: "1.5rem", fontWeight: 700 }}>{lesson.title}</h1>
            <button
              onClick={() => setShowExplanation((v) => !v)}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "#8888aa",
                padding: "0.35rem 0.85rem",
                cursor: "pointer",
                fontSize: "0.8rem",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {showExplanation ? "解説を隠す ←" : "→ 解説を表示"}
            </button>
          </div>
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
          {/* 左: 解説 or 練習問題 */}
          {showExplanation ? (
            <div
              style={{
                padding: "2rem",
                borderRight: "1px solid rgba(255,255,255,0.06)",
                overflowY: "auto",
              }}
            >
              <div
                style={{ color: "#c0c0d8", lineHeight: 1.8, fontSize: "0.92rem" }}
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
                    href={`/premium/lessons/${prevLesson.slug}`}
                    style={{ color: "#667eea", textDecoration: "none", fontSize: "0.85rem" }}
                  >
                    ← {prevLesson.title}
                  </Link>
                ) : (
                  <span />
                )}
                {nextLesson && (
                  <Link
                    href={`/premium/lessons/${nextLesson.slug}`}
                    style={{ color: "#667eea", textDecoration: "none", fontSize: "0.85rem" }}
                  >
                    {nextLesson.title} →
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div style={{ padding: "2rem", borderRight: "1px solid rgba(255,255,255,0.06)", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <section>
                <h3 style={{ color: "#8888aa", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                  練習問題（{lesson.exercises.length}問）
                </h3>
                <ExercisePanel
                  exercises={lesson.exercises}
                  lessonSlug={slug}
                  solvedIds={solvedIds}
                  onSolve={handleSolve}
                  lastResult={lastResult}
                  runAnswerSql={runAnswerSql}
                  activeIdx={activeExerciseIdx}
                  onChangeIdx={setActiveExerciseIdx}
                />
              </section>
              {session?.user && lessonCompleted && (
                <div
                  style={{
                    background: "rgba(52,211,153,0.1)",
                    border: "1px solid rgba(52,211,153,0.4)",
                    borderRadius: "10px",
                    color: "#34d399",
                    padding: "0.75rem",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    textAlign: "center",
                  }}
                >
                  ✅ レッスン完了済み
                </div>
              )}
            </div>
          )}

          {/* 右: 練習問題+エディタ or エディタのみ */}
          <div
            style={{
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
              overflowY: "auto",
            }}
          >
            {showExplanation && (
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
                  練習問題（{lesson.exercises.length}問）
                </h3>
                <ExercisePanel
                  exercises={lesson.exercises}
                  lessonSlug={slug}
                  solvedIds={solvedIds}
                  onSolve={handleSolve}
                  lastResult={lastResult}
                  runAnswerSql={runAnswerSql}
                  activeIdx={activeExerciseIdx}
                  onChangeIdx={setActiveExerciseIdx}
                />
              </section>
            )}

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
                ref={sqlEditorRef as any}
                initialQuery=""
                onResult={(columns, rows) => setLastResult({ columns, rows })}
              />
            </section>

            {showExplanation && session?.user && lessonCompleted && (
              <div
                style={{
                  background: "rgba(52,211,153,0.1)",
                  border: "1px solid rgba(52,211,153,0.4)",
                  borderRadius: "10px",
                  color: "#34d399",
                  padding: "0.75rem",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  textAlign: "center",
                }}
              >
                ✅ レッスン完了済み
              </div>
            )}
          </div>
        </div>
      </main>
      <TableReferenceModal />
      <style>{lessonContentStyle}</style>
    </>
  );
}

const lessonContentStyle = `
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
