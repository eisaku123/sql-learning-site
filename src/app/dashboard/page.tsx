import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { LESSONS } from "@/lib/curriculum";
import { PREMIUM_LESSONS } from "@/lib/premium-curriculum";
import Header from "@/components/Header";
import ProgressCircle from "@/components/ProgressCircle";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const [progress, exercises, subscription] = await Promise.all([
    prisma.userProgress.findMany({ where: { userId: session.user.id, completed: true } }),
    prisma.userExercise.findMany({ where: { userId: session.user.id, solved: true } }),
    prisma.subscription.findUnique({ where: { userId: session.user.id } }),
  ]);

  const isPremium =
    (subscription?.status === "active" || subscription?.status === "cancel_at_period_end") &&
    subscription.currentPeriodEnd > new Date();

  const completedSlugs = new Set(progress.map((p) => p.lessonSlug));
  const completedCount = completedSlugs.size;
  const totalLessons = LESSONS.length;
  const totalExercises = LESSONS.reduce((sum, l) => sum + l.exercises.length, 0);
  const progressPercent = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;
  const exercisePercent = totalExercises > 0 ? (exercises.length / totalExercises) * 100 : 0;

  // 次のレッスンを推定
  const nextLesson = LESSONS.find((l) => !completedSlugs.has(l.slug));

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

        {/* プレミアム状態 */}
        {isPremium ? (
          <section style={{ marginBottom: "2.5rem" }}>
            <Link href="/premium/lessons" style={{ textDecoration: "none" }}>
              <div
                style={{
                  background: "linear-gradient(135deg, rgba(102,126,234,0.12), rgba(118,75,162,0.12))",
                  border: "1px solid rgba(102,126,234,0.35)",
                  borderRadius: "14px",
                  padding: "1.25rem 1.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ fontSize: "1.5rem" }}>⭐</span>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ color: "#e0e0f0", fontWeight: 700, fontSize: "0.95rem" }}>
                        プレミアム会員
                      </span>
                      <span
                        style={{
                          background: subscription?.status === "cancel_at_period_end"
                            ? "rgba(255,150,50,0.15)"
                            : "rgba(52,211,153,0.15)",
                          border: `1px solid ${subscription?.status === "cancel_at_period_end" ? "rgba(255,150,50,0.4)" : "rgba(52,211,153,0.4)"}`,
                          borderRadius: "20px",
                          padding: "0.1rem 0.6rem",
                          color: subscription?.status === "cancel_at_period_end" ? "#ffaa44" : "#34d399",
                          fontSize: "0.72rem",
                          fontWeight: 600,
                        }}
                      >
                        {subscription?.status === "cancel_at_period_end" ? "解約済み" : "有効"}
                      </span>
                    </div>
                    <div style={{ color: "#8888aa", fontSize: "0.8rem", marginTop: "0.2rem" }}>
                      {subscription?.status === "cancel_at_period_end" ? "有効期限" : "次回更新日"}：
                      {subscription?.currentPeriodEnd.toLocaleDateString("ja-JP", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>
                <span style={{ color: "#667eea", fontSize: "0.85rem", fontWeight: 600 }}>
                  プレミアムレッスンへ →
                </span>
              </div>
            </Link>
          </section>
        ) : (
          <section style={{ marginBottom: "2.5rem" }}>
            <Link href="/pricing" style={{ textDecoration: "none" }}>
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "14px",
                  padding: "1.25rem 1.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ fontSize: "1.5rem" }}>⭐</span>
                  <div>
                    <div style={{ color: "#e0e0f0", fontWeight: 600, fontSize: "0.95rem" }}>
                      プレミアムコース
                    </div>
                    <div style={{ color: "#8888aa", fontSize: "0.8rem", marginTop: "0.2rem" }}>
                      初級50問・中級50問 — 月額100円
                    </div>
                  </div>
                </div>
                <span style={{ color: "#667eea", fontSize: "0.85rem", fontWeight: 600 }}>
                  プランを見る →
                </span>
              </div>
            </Link>
          </section>
        )}

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

        {/* レッスン一覧 */}
        <section>
          <h2 style={{ color: "#e0e0f0", fontSize: "1.1rem", fontWeight: 600, marginBottom: "1rem" }}>
            無料レッスン進捗
          </h2>

          {/* 初級 */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <span style={{ color: "#34d399", fontSize: "0.82rem", fontWeight: 600 }}>初級</span>
              <div style={{ height: "1px", flex: 1, background: "rgba(52,211,153,0.2)" }} />
              <span style={{ color: "#546e7a", fontSize: "0.78rem" }}>
                {LESSONS.filter(l => l.level === "beginner" && completedSlugs.has(l.slug)).length}
                {" / "}
                {LESSONS.filter(l => l.level === "beginner").length} 完了
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {LESSONS.filter(l => l.level === "beginner").sort((a, b) => a.order - b.order).map((lesson) => {
                const done = completedSlugs.has(lesson.slug);
                return (
                  <Link key={lesson.slug} href={`/lessons/${lesson.slug}`} style={{ textDecoration: "none" }}>
                    <div style={{
                      background: done ? "rgba(52,211,153,0.05)" : "rgba(255,255,255,0.03)",
                      border: done ? "1px solid rgba(52,211,153,0.2)" : "1px solid rgba(255,255,255,0.07)",
                      borderRadius: "10px",
                      padding: "0.75rem 1.25rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "0.75rem",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <span style={{
                          width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0,
                          background: done ? "rgba(52,211,153,0.2)" : "rgba(255,255,255,0.06)",
                          border: done ? "1px solid rgba(52,211,153,0.4)" : "1px solid rgba(255,255,255,0.1)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "0.7rem", color: done ? "#34d399" : "#546e7a", fontWeight: 700,
                        }}>
                          {done ? "✓" : lesson.order}
                        </span>
                        <span style={{ color: done ? "#c0c0d8" : "#8888aa", fontSize: "0.88rem" }}>
                          {lesson.title}
                        </span>
                      </div>
                      <span style={{ color: done ? "#34d399" : "#667eea", fontSize: "0.78rem", whiteSpace: "nowrap" }}>
                        {done ? "完了" : `${lesson.exercises.length}問 →`}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 中級 */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <span style={{ color: "#667eea", fontSize: "0.82rem", fontWeight: 600 }}>中級</span>
              <div style={{ height: "1px", flex: 1, background: "rgba(102,126,234,0.2)" }} />
              <span style={{ color: "#546e7a", fontSize: "0.78rem" }}>
                {LESSONS.filter(l => l.level === "intermediate" && completedSlugs.has(l.slug)).length}
                {" / "}
                {LESSONS.filter(l => l.level === "intermediate").length} 完了
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {LESSONS.filter(l => l.level === "intermediate").sort((a, b) => a.order - b.order).map((lesson) => {
                const done = completedSlugs.has(lesson.slug);
                return (
                  <Link key={lesson.slug} href={`/lessons/${lesson.slug}`} style={{ textDecoration: "none" }}>
                    <div style={{
                      background: done ? "rgba(102,126,234,0.06)" : "rgba(255,255,255,0.03)",
                      border: done ? "1px solid rgba(102,126,234,0.2)" : "1px solid rgba(255,255,255,0.07)",
                      borderRadius: "10px",
                      padding: "0.75rem 1.25rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "0.75rem",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <span style={{
                          width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0,
                          background: done ? "rgba(102,126,234,0.2)" : "rgba(255,255,255,0.06)",
                          border: done ? "1px solid rgba(102,126,234,0.4)" : "1px solid rgba(255,255,255,0.1)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "0.7rem", color: done ? "#667eea" : "#546e7a", fontWeight: 700,
                        }}>
                          {done ? "✓" : lesson.order}
                        </span>
                        <span style={{ color: done ? "#c0c0d8" : "#8888aa", fontSize: "0.88rem" }}>
                          {lesson.title}
                        </span>
                      </div>
                      <span style={{ color: done ? "#667eea" : "#667eea", fontSize: "0.78rem", whiteSpace: "nowrap" }}>
                        {done ? "完了" : `${lesson.exercises.length}問 →`}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* プレミアムレッスン進捗（加入中のみ） */}
        {isPremium && (
          <section style={{ marginTop: "2.5rem" }}>
            <h2 style={{ color: "#e0e0f0", fontSize: "1.1rem", fontWeight: 600, marginBottom: "1rem" }}>
              プレミアムレッスン進捗
            </h2>

            {/* プレミアム初級 */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <span style={{ color: "#34d399", fontSize: "0.82rem", fontWeight: 600 }}>プレミアム初級</span>
                <div style={{ height: "1px", flex: 1, background: "rgba(52,211,153,0.2)" }} />
                <span style={{ color: "#546e7a", fontSize: "0.78rem" }}>
                  {PREMIUM_LESSONS.filter(l => l.level === "beginner" && completedSlugs.has(l.slug)).length}
                  {" / "}
                  {PREMIUM_LESSONS.filter(l => l.level === "beginner").length} 完了
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {PREMIUM_LESSONS.filter(l => l.level === "beginner").sort((a, b) => a.order - b.order).map((lesson) => {
                  const done = completedSlugs.has(lesson.slug);
                  return (
                    <Link key={lesson.slug} href={`/premium/lessons/${lesson.slug}`} style={{ textDecoration: "none" }}>
                      <div style={{
                        background: done ? "rgba(52,211,153,0.05)" : "rgba(255,255,255,0.03)",
                        border: done ? "1px solid rgba(52,211,153,0.2)" : "1px solid rgba(255,255,255,0.07)",
                        borderRadius: "10px", padding: "0.75rem 1.25rem",
                        display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <span style={{
                            width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0,
                            background: done ? "rgba(52,211,153,0.2)" : "rgba(255,255,255,0.06)",
                            border: done ? "1px solid rgba(52,211,153,0.4)" : "1px solid rgba(255,255,255,0.1)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "0.7rem", color: done ? "#34d399" : "#546e7a", fontWeight: 700,
                          }}>
                            {done ? "✓" : lesson.order}
                          </span>
                          <span style={{ color: done ? "#c0c0d8" : "#8888aa", fontSize: "0.88rem" }}>{lesson.title}</span>
                        </div>
                        <span style={{ color: done ? "#34d399" : "#667eea", fontSize: "0.78rem", whiteSpace: "nowrap" }}>
                          {done ? "完了" : `${lesson.exercises.length}問 →`}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* プレミアム中級 */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <span style={{ color: "#667eea", fontSize: "0.82rem", fontWeight: 600 }}>プレミアム中級</span>
                <div style={{ height: "1px", flex: 1, background: "rgba(102,126,234,0.2)" }} />
                <span style={{ color: "#546e7a", fontSize: "0.78rem" }}>
                  {PREMIUM_LESSONS.filter(l => l.level === "intermediate" && completedSlugs.has(l.slug)).length}
                  {" / "}
                  {PREMIUM_LESSONS.filter(l => l.level === "intermediate").length} 完了
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {PREMIUM_LESSONS.filter(l => l.level === "intermediate").sort((a, b) => a.order - b.order).map((lesson) => {
                  const done = completedSlugs.has(lesson.slug);
                  return (
                    <Link key={lesson.slug} href={`/premium/lessons/${lesson.slug}`} style={{ textDecoration: "none" }}>
                      <div style={{
                        background: done ? "rgba(102,126,234,0.06)" : "rgba(255,255,255,0.03)",
                        border: done ? "1px solid rgba(102,126,234,0.2)" : "1px solid rgba(255,255,255,0.07)",
                        borderRadius: "10px", padding: "0.75rem 1.25rem",
                        display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <span style={{
                            width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0,
                            background: done ? "rgba(102,126,234,0.2)" : "rgba(255,255,255,0.06)",
                            border: done ? "1px solid rgba(102,126,234,0.4)" : "1px solid rgba(255,255,255,0.1)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "0.7rem", color: done ? "#667eea" : "#546e7a", fontWeight: 700,
                          }}>
                            {done ? "✓" : lesson.order}
                          </span>
                          <span style={{ color: done ? "#c0c0d8" : "#8888aa", fontSize: "0.88rem" }}>{lesson.title}</span>
                        </div>
                        <span style={{ color: "#667eea", fontSize: "0.78rem", whiteSpace: "nowrap" }}>
                          {done ? "完了" : `${lesson.exercises.length}問 →`}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
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
