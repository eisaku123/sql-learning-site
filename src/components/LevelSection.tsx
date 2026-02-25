"use client";

import Link from "next/link";
import type { Lesson } from "@/types";

interface LevelSectionProps {
  title: string;
  color: string;
  lessons: Lesson[];
  completedSlugs: string[];
  solvedExIds: string[];
}

export default function LevelSection({
  title,
  color,
  lessons,
  completedSlugs,
  solvedExIds,
}: LevelSectionProps) {
  const completedSet = new Set(completedSlugs);
  const solvedSet = new Set(solvedExIds);

  return (
    <section style={{ marginBottom: "2.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
        <h2 style={{ color, fontWeight: 700, fontSize: "1.1rem" }}>{title}</h2>
        <div style={{ height: "1px", flex: 1, background: `${color}20` }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {lessons.map((lesson) => {
          const done = completedSet.has(lesson.slug);
          const solved = lesson.exercises.filter((ex) => solvedSet.has(ex.id)).length;
          const total = lesson.exercises.length;
          const exPercent = total > 0 ? (solved / total) * 100 : 0;

          return (
            <Link key={lesson.slug} href={`/lessons/${lesson.slug}`} style={{ textDecoration: "none" }}>
              <div
                style={{
                  background: done ? "rgba(52,211,153,0.05)" : "rgba(255,255,255,0.03)",
                  border: done ? "1px solid rgba(52,211,153,0.2)" : "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "12px",
                  padding: "1rem 1.25rem",
                  transition: "all 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${color}40`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = done
                    ? "rgba(52,211,153,0.2)"
                    : "rgba(255,255,255,0.07)";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ color: done ? "#34d399" : "#546e7a", fontSize: "1rem" }}>
                      {done ? "✅" : "○"}
                    </span>
                    <div>
                      <div style={{ color: "#e0e0f0", fontSize: "0.9rem", fontWeight: 500 }}>
                        {lesson.title}
                      </div>
                      <div style={{ color: "#546e7a", fontSize: "0.78rem", marginTop: "0.1rem" }}>
                        問題 {solved}/{total} 解決
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        width: "80px",
                        height: "4px",
                        background: "rgba(255,255,255,0.08)",
                        borderRadius: "2px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${exPercent}%`,
                          height: "100%",
                          background: `linear-gradient(90deg, ${color}, ${color}aa)`,
                          borderRadius: "2px",
                          transition: "width 0.6s ease",
                        }}
                      />
                    </div>
                    <div style={{ color: "#546e7a", fontSize: "0.72rem", marginTop: "0.25rem" }}>
                      {Math.round(exPercent)}%
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
