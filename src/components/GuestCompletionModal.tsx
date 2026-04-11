"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

const AUTO_CLOSE_SEC = 8;

interface GuestCompletionModalProps {
  lessonSlug: string;
  nextLesson: { slug: string; title: string } | null;
  onClose: () => void;
}

export default function GuestCompletionModal({ lessonSlug, nextLesson, onClose }: GuestCompletionModalProps) {
  const router = useRouter();
  const [remaining, setRemaining] = useState(AUTO_CLOSE_SEC);

  const destination = nextLesson ? `/lessons/${nextLesson.slug}` : "/lessons";

  const handleProceed = useCallback(() => {
    onClose();
    router.push(destination);
  }, [onClose, router, destination]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleProceed();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [handleProceed]);

  const countdownLabel = nextLesson
    ? `⏱ ${remaining}秒後に次のレッスンへ進みます`
    : `⏱ ${remaining}秒後にレッスン一覧へ戻ります`;

  return (
    <>
      {/* オーバーレイ */}
      <div
        onClick={handleProceed}
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
          maxWidth: "440px",
          width: "90%",
          textAlign: "center",
          boxShadow: "0 0 60px rgba(102,126,234,0.2), 0 20px 60px rgba(0,0,0,0.5)",
          animation: "modal-pop-in 0.4s cubic-bezier(0.17,0.89,0.32,1.28) forwards",
        }}
      >
        {/* アイコン */}
        <div style={{ fontSize: "3.5rem", marginBottom: "0.75rem" }}>🎉</div>

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
          全問正解！
        </h2>

        <p style={{ color: "#8888aa", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>
          素晴らしい！全問正解しました。
        </p>

        {/* 登録メリット */}
        <div
          style={{
            background: "rgba(102,126,234,0.08)",
            border: "1px solid rgba(102,126,234,0.2)",
            borderRadius: "12px",
            padding: "1.1rem 1.25rem",
            marginBottom: "1.75rem",
            textAlign: "left",
          }}
        >
          <p style={{ color: "#a78bfa", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.75rem", letterSpacing: "0.04em" }}>
            📝 無料登録するとできること
          </p>
          {[
            { icon: "💾", text: "進捗が保存され、次回から続きを再開できる" },
            { icon: "🎆", text: "全問正解時に花火が打ち上がる" },
            { icon: "📚", text: "中級レッスン（4レッスン）が解放される" },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "1rem", flexShrink: 0 }}>{icon}</span>
              <span style={{ color: "#c0c0d8", fontSize: "0.85rem", lineHeight: 1.5 }}>{text}</span>
            </div>
          ))}
        </div>

        {/* ボタン */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <Link
            href={`/register?callbackUrl=/lessons/${lessonSlug}`}
            style={{
              display: "block",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "#fff",
              textDecoration: "none",
              padding: "0.9rem 1.5rem",
              borderRadius: "50px",
              fontWeight: 700,
              fontSize: "1rem",
            }}
          >
            無料で登録する →
          </Link>
          <Link
            href="/login"
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
            ログインする
          </Link>
          <button
            onClick={handleProceed}
            style={{
              background: "transparent",
              border: "none",
              color: "#546e7a",
              fontSize: "0.82rem",
              cursor: "pointer",
              padding: "0.25rem",
            }}
          >
            {nextLesson ? `次のレッスンへ（${nextLesson.title}）` : "レッスン一覧へ"}
          </button>
        </div>

        {/* カウントダウン */}
        <div style={{ marginTop: "1.25rem" }}>
          <p style={{ color: "#546e7a", fontSize: "0.78rem", marginBottom: "0.5rem" }}>
            {countdownLabel}
          </p>
          <div style={{
            height: "4px",
            background: "rgba(255,255,255,0.06)",
            borderRadius: "2px",
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              width: `${(remaining / AUTO_CLOSE_SEC) * 100}%`,
              background: "linear-gradient(90deg, #667eea, #a78bfa)",
              borderRadius: "2px",
              transition: "width 1s linear",
            }} />
          </div>
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
