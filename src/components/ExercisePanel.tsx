"use client";

import { useState } from "react";
import type { Exercise } from "@/types";

interface ExercisePanelProps {
  exercises: Exercise[];
  lessonSlug: string;
  solvedIds: string[];
  onSolve: (exerciseId: string) => void;
  lastResultColumns: string[];
}

export default function ExercisePanel({
  exercises,
  lessonSlug,
  solvedIds,
  onSolve,
  lastResultColumns,
}: ExercisePanelProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [checking, setChecking] = useState(false);

  const exercise = exercises[activeIdx];
  const isSolved = solvedIds.includes(exercise.id);

  const handleCheck = async () => {
    if (lastResultColumns.length === 0) {
      setFeedback({ correct: false, message: "まずSQLを実行してください" });
      return;
    }
    setChecking(true);
    try {
      const res = await fetch("/api/exercises/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonSlug,
          exerciseId: exercise.id,
          resultColumns: lastResultColumns,
        }),
      });
      const data = await res.json();
      setFeedback(data);
      if (data.correct) {
        onSolve(exercise.id);
        // 進捗を記録
        await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ exerciseId: exercise.id, solved: true }),
        });
      } else {
        await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ exerciseId: exercise.id, solved: false }),
        });
      }
    } finally {
      setChecking(false);
    }
  };

  const handleNext = () => {
    setActiveIdx((i) => Math.min(i + 1, exercises.length - 1));
    setShowHint(false);
    setShowAnswer(false);
    setFeedback(null);
  };

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "12px",
        padding: "1.25rem",
      }}
    >
      <div style={{ marginBottom: "1rem" }}>
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          {exercises.map((ex, i) => (
            <button
              key={ex.id}
              onClick={() => {
                setActiveIdx(i);
                setShowHint(false);
                setShowAnswer(false);
                setFeedback(null);
              }}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                border: i === activeIdx
                  ? "2px solid #667eea"
                  : "1px solid rgba(255,255,255,0.1)",
                background: solvedIds.includes(ex.id)
                  ? "rgba(52,211,153,0.2)"
                  : i === activeIdx
                    ? "rgba(102,126,234,0.15)"
                    : "transparent",
                color: solvedIds.includes(ex.id) ? "#34d399" : "#e0e0f0",
                cursor: "pointer",
                fontSize: "0.8rem",
                fontWeight: 600,
              }}
            >
              {solvedIds.includes(ex.id) ? "✓" : i + 1}
            </button>
          ))}
        </div>

        <h4
          style={{
            color: "#e0e0f0",
            fontSize: "0.95rem",
            fontWeight: 600,
            marginBottom: "0.5rem",
          }}
        >
          問題 {activeIdx + 1}
          {isSolved && (
            <span
              style={{
                marginLeft: "0.5rem",
                color: "#34d399",
                fontSize: "0.8rem",
                background: "rgba(52,211,153,0.1)",
                padding: "0.1rem 0.5rem",
                borderRadius: "20px",
                border: "1px solid rgba(52,211,153,0.3)",
              }}
            >
              解決済み
            </span>
          )}
        </h4>
        <p style={{ color: "#c0c0d8", fontSize: "0.9rem", lineHeight: 1.6 }}>
          {exercise.question}
        </p>
      </div>

      {/* アクション */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
        <button
          onClick={handleCheck}
          disabled={checking}
          style={{
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "0.5rem 1rem",
            cursor: "pointer",
            fontSize: "0.85rem",
            fontWeight: 600,
          }}
        >
          {checking ? "確認中..." : "答え合わせ"}
        </button>
        <button
          onClick={() => setShowHint(!showHint)}
          style={{
            background: "rgba(251,191,36,0.1)",
            border: "1px solid rgba(251,191,36,0.3)",
            borderRadius: "8px",
            color: "#fbbf24",
            padding: "0.5rem 1rem",
            cursor: "pointer",
            fontSize: "0.85rem",
          }}
        >
          {showHint ? "ヒントを隠す" : "ヒント"}
        </button>
        <button
          onClick={() => setShowAnswer(!showAnswer)}
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
            color: "#8888aa",
            padding: "0.5rem 1rem",
            cursor: "pointer",
            fontSize: "0.85rem",
          }}
        >
          {showAnswer ? "解答を隠す" : "解答を見る"}
        </button>
        {activeIdx < exercises.length - 1 && (
          <button
            onClick={handleNext}
            style={{
              marginLeft: "auto",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              color: "#e0e0f0",
              padding: "0.5rem 1rem",
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            次の問題 →
          </button>
        )}
      </div>

      {/* ヒント */}
      {showHint && (
        <div
          style={{
            background: "rgba(251,191,36,0.07)",
            border: "1px solid rgba(251,191,36,0.2)",
            borderRadius: "8px",
            padding: "0.75rem",
            marginBottom: "0.75rem",
            color: "#fbbf24",
            fontSize: "0.85rem",
          }}
        >
          💡 {exercise.hint}
        </div>
      )}

      {/* 解答 */}
      {showAnswer && (
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "8px",
            padding: "0.75rem",
            marginBottom: "0.75rem",
          }}
        >
          <div style={{ color: "#8888aa", fontSize: "0.75rem", marginBottom: "0.25rem" }}>
            解答例：
          </div>
          <code
            style={{
              color: "#82aaff",
              fontFamily: "monospace",
              fontSize: "0.85rem",
              whiteSpace: "pre-wrap",
            }}
          >
            {exercise.answer}
          </code>
        </div>
      )}

      {/* フィードバック */}
      {feedback && (
        <div
          style={{
            background: feedback.correct
              ? "rgba(52,211,153,0.1)"
              : "rgba(248,113,113,0.1)",
            border: `1px solid ${feedback.correct ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)"}`,
            borderRadius: "8px",
            padding: "0.75rem",
            color: feedback.correct ? "#34d399" : "#f87171",
            fontSize: "0.9rem",
            fontWeight: 600,
          }}
        >
          {feedback.correct ? "✅ " : "❌ "}{feedback.message}
        </div>
      )}
    </div>
  );
}
