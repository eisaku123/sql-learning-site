"use client";

import Link from "next/link";

interface LessonCompletionModalProps {
  nextLesson: { slug: string; title: string } | null;
  nextLessonHref?: string;
  lessonListHref: string;
  onClose: () => void;
}

export default function LessonCompletionModal({
  nextLesson,
  nextLessonHref,
  lessonListHref,
  onClose,
}: LessonCompletionModalProps) {
  return (
    <>
      {/* オーバーレイ */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          zIndex: 10001,
          animation: "modal-fade-in 0.3s ease forwards",
        }}
      />

      {/* モーダル本体 */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10002,
          background: "linear-gradient(135deg, #0f0f2a, #1a1a3a)",
          border: "1px solid rgba(102,126,234,0.4)",
          borderRadius: "20px",
          padding: "2.5rem 2rem",
          maxWidth: "420px",
          width: "90%",
          textAlign: "center",
          boxShadow: "0 0 60px rgba(102,126,234,0.2), 0 20px 60px rgba(0,0,0,0.5)",
          animation: "modal-pop-in 0.4s cubic-bezier(0.17,0.89,0.32,1.28) forwards",
        }}
      >
        {/* アイコン */}
        <div style={{ fontSize: "3.5rem", marginBottom: "0.75rem" }}>🏆</div>

        {/* タイトル */}
        <h2
          style={{
            fontSize: "1.6rem",
            fontWeight: 800,
            background: "linear-gradient(135deg, #667eea, #34d399)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "0.5rem",
          }}
        >
          レッスン完了！
        </h2>

        <p style={{ color: "#8888aa", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "2rem" }}>
          {nextLesson
            ? `全問正解しました！次のレッスン「${nextLesson.title}」に進みましょう。`
            : "全問正解しました！全レッスン完了です。お疲れ様でした！"}
        </p>

        {/* ボタン */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {nextLesson && (
            <Link
              href={nextLessonHref ?? `/lessons/${nextLesson.slug}`}
              onClick={onClose}
              style={{
                display: "block",
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                color: "#fff",
                textDecoration: "none",
                padding: "0.85rem 1.5rem",
                borderRadius: "50px",
                fontWeight: 700,
                fontSize: "1rem",
              }}
            >
              次のレッスンへ →
            </Link>
          )}
          <Link
            href={lessonListHref}
            onClick={onClose}
            style={{
              display: "block",
              background: "transparent",
              color: "#e0e0f0",
              textDecoration: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "50px",
              border: "1px solid rgba(255,255,255,0.15)",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            レッスン一覧へ
          </Link>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#546e7a",
              fontSize: "0.82rem",
              cursor: "pointer",
              padding: "0.25rem",
            }}
          >
            閉じる
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modal-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modal-pop-in {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </>
  );
}
