"use client";

import { use, useState, useCallback, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { getLessonBySlug, LESSONS } from "@/lib/curriculum";
import Header from "@/components/Header";
import dynamic from "next/dynamic";
import ExercisePanel from "@/components/ExercisePanel";
import Fireworks from "@/components/Fireworks";
import TableReferenceModal from "@/components/TableReferenceModal";
import LessonCompletionModal from "@/components/LessonCompletionModal";
import LessonTour from "@/components/LessonTour";
import GuestCompletionModal from "@/components/GuestCompletionModal";
import type { SqlEditorHandle } from "@/components/SqlEditor";

const SqlEditor = dynamic(() => import("@/components/SqlEditor"), { ssr: false });

export default function LessonPageClient({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const lesson = getLessonBySlug(slug);
  const { data: session, status } = useSession();

  const [solvedIds, setSolvedIds] = useState<string[]>([]);
  const [lastResult, setLastResult] = useState<{ columns: string[]; rows: (string | number | null)[][] } | null>(null);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [activeExerciseIdx, setActiveExerciseIdx] = useState(0);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const sqlEditorRef = useRef<SqlEditorHandle>(null);
  const runAnswerSql = useCallback((sql: string) => sqlEditorRef.current?.runSql(sql) ?? null, []);
  const runCurrentUserSql = useCallback(() => sqlEditorRef.current?.runCurrentSql() ?? { result: null, error: null }, []);

  // 問題切り替え時にDBをリセットして前の問題のCREATE TABLEなどを消す
  useEffect(() => {
    sqlEditorRef.current?.resetDb();
    sqlEditorRef.current?.clearQuery();
    setLastResult(null);
  }, [activeExerciseIdx]);

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
        setProgressLoaded(true);
      })
      .catch(() => {});
  }, [session, slug]);

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

  // 未ログイン時：全問正解で登録促進モーダルを表示
  useEffect(() => {
    if (status === "loading" || session?.user || !lesson) return;
    if (solvedIds.length === 0) return;
    if (lesson.exercises.every((ex) => solvedIds.includes(ex.id))) {
      setShowGuestModal(true);
    }
  }, [solvedIds, lesson, session, status]);

  const handleSolve = useCallback((exerciseId: string) => {
    setSolvedIds((prev) => {
      if (prev.includes(exerciseId)) return prev;
      return [...prev, exerciseId];
    });
  }, []);

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

  // 中級レッスンはログイン必須
  if (lesson.level === "intermediate" && status === "unauthenticated") {
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
              🔒
            </div>
            <h1 style={{ color: "#e0e0f0", fontWeight: 800, fontSize: "1.6rem", marginBottom: "1rem" }}>
              ログインが必要です
            </h1>
            <p style={{ color: "#8888aa", lineHeight: 1.8, marginBottom: "2rem" }}>
              中級レッスンはアカウント登録（無料）が必要です。<br />
              初級レッスンはログインなしでお試しいただけます。
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href={`/login?callbackUrl=/lessons/${slug}`}
                style={{
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  color: "#fff",
                  textDecoration: "none",
                  padding: "0.85rem 2rem",
                  borderRadius: "50px",
                  fontWeight: 700,
                  fontSize: "1rem",
                }}
              >
                ログイン
              </Link>
              <Link
                href="/register"
                style={{
                  background: "transparent",
                  color: "#e0e0f0",
                  textDecoration: "none",
                  padding: "0.85rem 2rem",
                  borderRadius: "50px",
                  border: "1px solid rgba(255,255,255,0.15)",
                  fontWeight: 600,
                  fontSize: "1rem",
                }}
              >
                無料登録
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  const lessonIdx = LESSONS.findIndex((l) => l.slug === slug);
  const prevLesson = lessonIdx > 0 ? LESSONS[lessonIdx - 1] : null;
  const nextLesson = lessonIdx < LESSONS.length - 1 ? LESSONS[lessonIdx + 1] : null;
  const levelLabel = lesson.level === "beginner" ? "初級" : "中級";
  const levelColor = lesson.level === "beginner" ? "#34d399" : "#667eea";

  const [showExplanation, setShowExplanation] = useState(true);

  return (
    <>
      {showFireworks && (
        <Fireworks onDone={() => {
          setShowFireworks(false);
          setShowCompletionModal(true);
        }} />
      )}
      {showCompletionModal && (
        <LessonCompletionModal
          nextLesson={nextLesson}
          lessonListHref="/lessons"
          onClose={() => setShowCompletionModal(false)}
        />
      )}
      {showGuestModal && (
        <GuestCompletionModal
          lessonSlug={slug}
          nextLesson={nextLesson}
          onClose={() => setShowGuestModal(false)}
        />
      )}
      <Header />
      <main style={{ paddingTop: "60px" }}>
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
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h1 style={{ color: "#e0e0f0", fontSize: "1.5rem", fontWeight: 700 }}>{lesson.title}</h1>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            maxWidth: "1400px",
            margin: "0 auto",
            minHeight: "calc(100vh - 130px)",
          }}
        >
          {showExplanation ? (
            <div
              id="tour-lesson-content"
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
                  <Link href={`/lessons/${prevLesson.slug}`} style={{ color: "#667eea", textDecoration: "none", fontSize: "0.85rem" }}>
                    ← {prevLesson.title}
                  </Link>
                ) : <span />}
                {nextLesson && (
                  <Link href={`/lessons/${nextLesson.slug}`} style={{ color: "#667eea", textDecoration: "none", fontSize: "0.85rem" }}>
                    {nextLesson.title} →
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div style={{ padding: "2rem", borderRight: "1px solid rgba(255,255,255,0.06)", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <section>
                <h3 style={{ color: "#8888aa", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                  練習問題
                </h3>
                <ExercisePanel
                  exercises={lesson.exercises}
                  lessonSlug={slug}
                  solvedIds={solvedIds}
                  onSolve={handleSolve}
                  lastResult={lastResult}
                  runAnswerSql={runAnswerSql}
                  runCurrentUserSql={runCurrentUserSql}
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
              <section id="tour-exercise-panel">
                <h3 style={{ color: "#8888aa", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                  練習問題
                </h3>
                <ExercisePanel
                  exercises={lesson.exercises}
                  lessonSlug={slug}
                  solvedIds={solvedIds}
                  onSolve={handleSolve}
                  lastResult={lastResult}
                  runAnswerSql={runAnswerSql}
                  runCurrentUserSql={runCurrentUserSql}
                  activeIdx={activeExerciseIdx}
                  onChangeIdx={setActiveExerciseIdx}
                />
              </section>
            )}

            <section>
              <h3 style={{ color: "#8888aa", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                SQL エディタ
              </h3>
              <SqlEditor
                ref={sqlEditorRef as any}
                initialQuery=""
                onResult={(columns, rows) => setLastResult({ columns, rows })}
                onResultError={() => setLastResult(null)}
                showExplanation={showExplanation}
                onToggleExplanation={() => setShowExplanation((v) => !v)}
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
      <LessonTour />
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
