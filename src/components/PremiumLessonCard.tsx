"use client";

import Link from "next/link";
import { useState } from "react";
import type { Lesson } from "@/types";

interface PremiumLessonCardProps {
  lesson: Lesson;
  completed: boolean;
  index: number;
  isPremium: boolean;
  isLoggedIn: boolean;
}

export default function PremiumLessonCard({
  lesson,
  completed,
  index,
  isPremium,
  isLoggedIn,
}: PremiumLessonCardProps) {
  const [showModal, setShowModal] = useState(false);
  const levelColor = lesson.level === "beginner" ? "#34d399" : "#667eea";
  const levelLabel = lesson.level === "beginner" ? "初級" : "中級";

  const card = (
    <div
      style={{
        background: isPremium ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
        border: completed
          ? "1px solid rgba(52,211,153,0.3)"
          : isPremium
          ? "1px solid rgba(255,255,255,0.08)"
          : "1px solid rgba(255,255,255,0.05)",
        borderRadius: "12px",
        padding: "1.25rem",
        cursor: isPremium ? "pointer" : "pointer",
        transition: "all 0.25s",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.transform = "translateY(-4px)";
        el.style.background = isPremium
          ? "rgba(255,255,255,0.07)"
          : "rgba(255,255,255,0.04)";
        el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.transform = "";
        el.style.background = isPremium
          ? "rgba(255,255,255,0.04)"
          : "rgba(255,255,255,0.02)";
        el.style.boxShadow = "";
      }}
    >
      {/* 鍵アイコン（未加入時） */}
      {!isPremium && (
        <div
          style={{
            position: "absolute",
            top: "0.75rem",
            right: "0.75rem",
            color: "#546e7a",
            fontSize: "0.85rem",
          }}
        >
          🔒
        </div>
      )}

      {/* 完了バッジ（加入済みのみ） */}
      {isPremium && completed && (
        <div
          style={{
            position: "absolute",
            top: "0.75rem",
            right: "0.75rem",
            background: "rgba(52,211,153,0.15)",
            border: "1px solid rgba(52,211,153,0.4)",
            borderRadius: "20px",
            padding: "0.15rem 0.6rem",
            color: "#34d399",
            fontSize: "0.75rem",
            fontWeight: 600,
          }}
        >
          完了
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: isPremium
              ? `rgba(${lesson.level === "beginner" ? "52,211,153" : "102,126,234"},0.15)`
              : "rgba(255,255,255,0.05)",
            border: `1px solid ${isPremium ? levelColor + "40" : "rgba(255,255,255,0.1)"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: isPremium ? levelColor : "#546e7a",
            fontWeight: 700,
            fontSize: "0.85rem",
            flexShrink: 0,
          }}
        >
          {index + 1}
        </div>
        <span
          style={{
            background: isPremium ? `${levelColor}1a` : "rgba(255,255,255,0.05)",
            border: `1px solid ${isPremium ? levelColor + "40" : "rgba(255,255,255,0.08)"}`,
            borderRadius: "20px",
            padding: "0.15rem 0.6rem",
            color: isPremium ? levelColor : "#546e7a",
            fontSize: "0.75rem",
            fontWeight: 600,
          }}
        >
          {levelLabel}
        </span>
      </div>

      <h3
        style={{
          color: isPremium ? "#e0e0f0" : "#8888aa",
          fontSize: "0.95rem",
          fontWeight: 600,
          marginBottom: "0.4rem",
        }}
      >
        {lesson.title}
      </h3>
      <p style={{ color: isPremium ? "#8888aa" : "#546e7a", fontSize: "0.82rem", lineHeight: 1.5 }}>
        {lesson.description}
      </p>

      <div
        style={{
          marginTop: "0.75rem",
          color: isPremium ? "#667eea" : "#546e7a",
          fontSize: "0.82rem",
          fontWeight: 500,
        }}
      >
        {isPremium ? `練習問題 ${lesson.exercises.length}問 →` : `練習問題 ${lesson.exercises.length}問`}
      </div>
    </div>
  );

  if (isPremium) {
    return (
      <Link href={`/premium/lessons/${lesson.slug}`} style={{ textDecoration: "none" }}>
        {card}
      </Link>
    );
  }

  return (
    <>
      <div onClick={() => setShowModal(true)} style={{ cursor: "pointer" }}>
        {card}
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: "#0f0f24",
              border: "1px solid rgba(102,126,234,0.3)",
              borderRadius: "20px",
              padding: "2.5rem",
              maxWidth: "420px",
              width: "100%",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "rgba(102,126,234,0.1)",
                border: "2px solid rgba(102,126,234,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.6rem",
                margin: "0 auto 1.25rem",
              }}
            >
              🔒
            </div>
            <h2 style={{ color: "#e0e0f0", fontWeight: 700, fontSize: "1.2rem", marginBottom: "0.75rem" }}>
              プレミアム会員限定
            </h2>
            <p style={{ color: "#8888aa", fontSize: "0.9rem", lineHeight: 1.8, marginBottom: "1.75rem" }}>
              このレッスンはプレミアム会員限定のコンテンツです。
              <br />
              月額100円で初級50問・中級50問に
              <br />
              アクセスできます。
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {isLoggedIn ? (
                <Link
                  href="/pricing"
                  style={{
                    display: "block",
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    color: "#fff",
                    textDecoration: "none",
                    padding: "0.85rem",
                    borderRadius: "50px",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                  }}
                >
                  プレミアムに申し込む →
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    style={{
                      display: "block",
                      background: "linear-gradient(135deg, #667eea, #764ba2)",
                      color: "#fff",
                      textDecoration: "none",
                      padding: "0.85rem",
                      borderRadius: "50px",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                    }}
                  >
                    無料登録してプレミアムへ →
                  </Link>
                  <Link
                    href="/login"
                    style={{
                      display: "block",
                      color: "#8888aa",
                      textDecoration: "none",
                      fontSize: "0.85rem",
                    }}
                  >
                    すでにアカウントをお持ちの方はログイン
                  </Link>
                </>
              )}
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: "none",
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
        </div>
      )}
    </>
  );
}
