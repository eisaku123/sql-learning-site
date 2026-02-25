"use client";

import Link from "next/link";
import type { Lesson } from "@/types";

interface LessonCardProps {
  lesson: Lesson;
  completed: boolean;
  index: number;
}

export default function LessonCard({ lesson, completed, index }: LessonCardProps) {
  const levelColor = lesson.level === "beginner" ? "#34d399" : "#667eea";
  const levelLabel = lesson.level === "beginner" ? "初級" : "中級";

  return (
    <Link
      href={`/lessons/${lesson.slug}`}
      style={{ textDecoration: "none" }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          border: completed
            ? "1px solid rgba(52,211,153,0.3)"
            : "1px solid rgba(255,255,255,0.08)",
          borderRadius: "12px",
          padding: "1.25rem",
          cursor: "pointer",
          transition: "all 0.25s",
          position: "relative",
          overflow: "hidden",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget;
          el.style.transform = "translateY(-4px)";
          el.style.background = "rgba(255,255,255,0.07)";
          el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget;
          el.style.transform = "";
          el.style.background = "rgba(255,255,255,0.04)";
          el.style.boxShadow = "";
        }}
      >
        {/* 完了バッジ */}
        {completed && (
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
              background: `rgba(${lesson.level === "beginner" ? "52,211,153" : "102,126,234"},0.15)`,
              border: `1px solid ${levelColor}40`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: levelColor,
              fontWeight: 700,
              fontSize: "0.85rem",
              flexShrink: 0,
            }}
          >
            {index + 1}
          </div>
          <span
            style={{
              background: `${levelColor}1a`,
              border: `1px solid ${levelColor}40`,
              borderRadius: "20px",
              padding: "0.15rem 0.6rem",
              color: levelColor,
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            {levelLabel}
          </span>
        </div>

        <h3
          style={{
            color: "#e0e0f0",
            fontSize: "0.95rem",
            fontWeight: 600,
            marginBottom: "0.4rem",
          }}
        >
          {lesson.title}
        </h3>
        <p style={{ color: "#8888aa", fontSize: "0.82rem", lineHeight: 1.5 }}>
          {lesson.description}
        </p>

        <div
          style={{
            marginTop: "0.75rem",
            color: "#667eea",
            fontSize: "0.82rem",
            fontWeight: 500,
          }}
        >
          練習問題 {lesson.exercises.length}問 →
        </div>
      </div>
    </Link>
  );
}
