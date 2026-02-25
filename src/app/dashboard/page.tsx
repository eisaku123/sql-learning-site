import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { LESSONS } from "@/lib/curriculum";
import Header from "@/components/Header";
import ProgressCircle from "@/components/ProgressCircle";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const progress = await prisma.userProgress.findMany({
    where: { userId: session.user.id, completed: true },
  });
  const exercises = await prisma.userExercise.findMany({
    where: { userId: session.user.id, solved: true },
  });

  const completedSlugs = new Set(progress.map((p) => p.lessonSlug));
  const completedCount = completedSlugs.size;
  const totalLessons = LESSONS.length;
  const totalExercises = LESSONS.reduce((sum, l) => sum + l.exercises.length, 0);
  const progressPercent = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;
  const exercisePercent = totalExercises > 0 ? (exercises.length / totalExercises) * 100 : 0;

  // 次のレッスンを推定
  const nextLesson = LESSONS.find((l) => !completedSlugs.has(l.slug));
  // 最近完了したレッスン
  const recentSlugs = progress
    .sort((a, b) => (b.completedAt?.getTime() ?? 0) - (a.completedAt?.getTime() ?? 0))
    .slice(0, 3)
    .map((p) => p.lessonSlug);
  const recentLessons = recentSlugs
    .map((slug) => LESSONS.find((l) => l.slug === slug))
    .filter(Boolean);

  return (
    <>
      <Header />
      <main style={{ paddingTop: "80px", padding: "80px 2rem 4rem", maxWidth: "900px", margin: "0 auto" }}>
        <h1
          style={{
            color: "#e0e0f0",
            fontSize: "1.8rem",
            fontWeight: 700,
            marginBottom: "0.25rem",
          }}
        >
          ようこそ、{session.user.name ?? session.user.email} さん
        </h1>
        <p style={{ color: "#8888aa", marginBottom: "2.5rem" }}>
          今日も学習を続けましょう！
        </p>

        {/* 進捗サマリー */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1.25rem",
            marginBottom: "2.5rem",
          }}
        >
          <StatCard
            label="レッスン進捗"
            value={`${completedCount} / ${totalLessons}`}
            sub="レッスン完了"
            color="#667eea"
          />
          <StatCard
            label="問題解答数"
            value={`${exercises.length} / ${totalExercises}`}
            sub="問題解決"
            color="#34d399"
          />
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <ProgressCircle percent={progressPercent} size={90} label="全体進捗" />
          </div>
        </div>

        {/* 次のレッスン */}
        {nextLesson && (
          <section style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ color: "#e0e0f0", fontSize: "1.1rem", fontWeight: 600, marginBottom: "1rem" }}>
              次のレッスン
            </h2>
            <Link href={`/lessons/${nextLesson.slug}`} style={{ textDecoration: "none" }}>
              <div
                style={{
                  background: "rgba(102,126,234,0.08)",
                  border: "1px solid rgba(102,126,234,0.25)",
                  borderRadius: "14px",
                  padding: "1.25rem 1.5rem",
                  transition: "all 0.2s",
                  cursor: "pointer",
                }}
              >
                <div style={{ color: "#8888aa", fontSize: "0.8rem", marginBottom: "0.25rem" }}>
                  {nextLesson.level === "beginner" ? "初級" : "中級"} — レッスン {nextLesson.order}
                </div>
                <div style={{ color: "#e0e0f0", fontWeight: 600, fontSize: "1rem" }}>
                  {nextLesson.title}
                </div>
                <div style={{ color: "#667eea", fontSize: "0.85rem", marginTop: "0.25rem" }}>
                  学習を始める →
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* 最近完了したレッスン */}
        {recentLessons.length > 0 && (
          <section>
            <h2 style={{ color: "#e0e0f0", fontSize: "1.1rem", fontWeight: 600, marginBottom: "1rem" }}>
              最近完了したレッスン
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {recentLessons.map((lesson) => lesson && (
                <Link key={lesson.slug} href={`/lessons/${lesson.slug}`} style={{ textDecoration: "none" }}>
                  <div
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(52,211,153,0.15)",
                      borderRadius: "10px",
                      padding: "0.85rem 1.25rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <span style={{ color: "#34d399", fontSize: "1rem" }}>✓</span>
                    <span style={{ color: "#c0c0d8", fontSize: "0.9rem" }}>{lesson.title}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {completedCount === 0 && (
          <div style={{ textAlign: "center", padding: "3rem", color: "#8888aa" }}>
            <p style={{ marginBottom: "1rem" }}>まだレッスンを完了していません</p>
            <Link
              href="/lessons"
              style={{
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                color: "#fff",
                textDecoration: "none",
                padding: "0.7rem 1.5rem",
                borderRadius: "8px",
                fontWeight: 600,
              }}
            >
              レッスンを始める
            </Link>
          </div>
        )}
      </main>
    </>
  );
}

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "16px",
        padding: "1.5rem",
      }}
    >
      <div style={{ color: "#8888aa", fontSize: "0.8rem", marginBottom: "0.5rem" }}>{label}</div>
      <div style={{ color, fontSize: "1.8rem", fontWeight: 700, lineHeight: 1 }}>{value}</div>
      <div style={{ color: "#8888aa", fontSize: "0.8rem", marginTop: "0.4rem" }}>{sub}</div>
    </div>
  );
}
