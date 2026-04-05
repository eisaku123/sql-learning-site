import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { LESSONS } from "@/lib/curriculum";
import { PREMIUM_LESSONS } from "@/lib/premium-curriculum";
import Header from "@/components/Header";
import ProgressCircle from "@/components/ProgressCircle";
import LevelSection from "@/components/LevelSection";

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

  const completedSlugs = progress.map((p) => p.lessonSlug);
  const solvedExIds = exercises.map((e) => e.exerciseId);
  const completedSlugsSet = new Set(completedSlugs);

  // 無料レッスン統計
  const completedCount = LESSONS.filter(l => completedSlugsSet.has(l.slug)).length;
  const totalLessons = LESSONS.length;
  const totalExercises = LESSONS.reduce((sum, l) => sum + l.exercises.length, 0);
  const solvedFreeExercises = exercises.filter(e =>
    LESSONS.some(l => l.exercises.some(ex => ex.id === e.exerciseId))
  ).length;
  const progressPercent = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

  // プレミアムレッスン統計
  const premiumCompletedCount = PREMIUM_LESSONS.filter(l => completedSlugsSet.has(l.slug)).length;
  const premiumTotalLessons = PREMIUM_LESSONS.length;
  const premiumTotalExercises = PREMIUM_LESSONS.reduce((sum, l) => sum + l.exercises.length, 0);
  const solvedPremiumExercises = exercises.filter(e =>
    PREMIUM_LESSONS.some(l => l.exercises.some(ex => ex.id === e.exerciseId))
  ).length;
  const premiumProgressPercent = premiumTotalLessons > 0 ? (premiumCompletedCount / premiumTotalLessons) * 100 : 0;

  const nextLesson = LESSONS.find((l) => !completedSlugsSet.has(l.slug));

  const beginnerLessons = LESSONS.filter(l => l.level === "beginner").sort((a, b) => a.order - b.order);
  const intermediateLessons = LESSONS.filter(l => l.level === "intermediate").sort((a, b) => a.order - b.order);
  const premiumBeginnerLessons = PREMIUM_LESSONS.filter(l => l.level === "beginner").sort((a, b) => a.order - b.order);
  const premiumIntermediateLessons = PREMIUM_LESSONS.filter(l => l.level === "intermediate").sort((a, b) => a.order - b.order);

  return (
    <>
      <Header />
      <main style={{ paddingTop: "80px", padding: "80px 2rem 4rem", maxWidth: "900px", margin: "0 auto" }}>
        <h1 style={{ color: "#e0e0f0", fontSize: "1.8rem", fontWeight: 700, marginBottom: "0.25rem" }}>
          ようこそ、{session.user.name ?? session.user.email} さん
        </h1>
        <p style={{ color: "#8888aa", marginBottom: "2.5rem" }}>
          今日も学習を続けましょう！
        </p>

        {/* 無料進捗サマリー */}
        <div style={{ marginBottom: isPremium ? "1rem" : "2.5rem" }}>
          <div style={{ color: "#8888aa", fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.6rem", letterSpacing: "0.05em" }}>
            無料コース
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem" }}>
            <StatCard label="レッスン進捗" value={`${completedCount} / ${totalLessons}`} sub="レッスン完了" color="#667eea" />
            <StatCard label="問題解答数" value={`${solvedFreeExercises} / ${totalExercises}`} sub="問題解決" color="#34d399" />
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "1.5rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
              <ProgressCircle percent={progressPercent} size={90} label="全体進捗" />
            </div>
          </div>
        </div>

        {/* プレミアム進捗サマリー（加入中のみ） */}
        {isPremium && (
          <div style={{ marginBottom: "2.5rem" }}>
            <div style={{ color: "#667eea", fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.6rem", letterSpacing: "0.05em" }}>
              ⭐ プレミアムコース
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem" }}>
              <StatCard label="レッスン進捗" value={`${premiumCompletedCount} / ${premiumTotalLessons}`} sub="レッスン完了" color="#764ba2" />
              <StatCard label="問題解答数" value={`${solvedPremiumExercises} / ${premiumTotalExercises}`} sub="問題解決" color="#a78bfa" />
              <div style={{ background: "rgba(102,126,234,0.06)", border: "1px solid rgba(102,126,234,0.2)", borderRadius: "16px", padding: "1.5rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                <ProgressCircle percent={premiumProgressPercent} size={90} label="全体進捗" />
              </div>
            </div>
          </div>
        )}

        {/* プレミアム状態 */}
        {isPremium ? (
          <section style={{ marginBottom: "2.5rem" }}>
            <Link href="/premium/lessons" style={{ textDecoration: "none" }}>
              <div style={{
                background: "linear-gradient(135deg, rgba(102,126,234,0.12), rgba(118,75,162,0.12))",
                border: "1px solid rgba(102,126,234,0.35)",
                borderRadius: "14px",
                padding: "1.25rem 1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "0.75rem",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ fontSize: "1.5rem" }}>⭐</span>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ color: "#e0e0f0", fontWeight: 700, fontSize: "0.95rem" }}>プレミアム会員</span>
                      <span style={{
                        background: subscription?.status === "cancel_at_period_end" ? "rgba(255,150,50,0.15)" : "rgba(52,211,153,0.15)",
                        border: `1px solid ${subscription?.status === "cancel_at_period_end" ? "rgba(255,150,50,0.4)" : "rgba(52,211,153,0.4)"}`,
                        borderRadius: "20px",
                        padding: "0.1rem 0.6rem",
                        color: subscription?.status === "cancel_at_period_end" ? "#ffaa44" : "#34d399",
                        fontSize: "0.72rem",
                        fontWeight: 600,
                      }}>
                        {subscription?.status === "cancel_at_period_end" ? "解約済み" : "有効"}
                      </span>
                    </div>
                    <div style={{ color: "#8888aa", fontSize: "0.8rem", marginTop: "0.2rem" }}>
                      {subscription?.status === "cancel_at_period_end" ? "有効期限" : "次回更新日"}：
                      {subscription?.currentPeriodEnd.toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" })}
                    </div>
                  </div>
                </div>
                <span style={{ color: "#667eea", fontSize: "0.85rem", fontWeight: 600 }}>プレミアムレッスンへ →</span>
              </div>
            </Link>
          </section>
        ) : (
          <section style={{ marginBottom: "2.5rem" }}>
            <Link href="/pricing" style={{ textDecoration: "none" }}>
              <div style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "14px",
                padding: "1.25rem 1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "0.75rem",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ fontSize: "1.5rem" }}>⭐</span>
                  <div>
                    <div style={{ color: "#e0e0f0", fontWeight: 600, fontSize: "0.95rem" }}>プレミアムコース</div>
                    <div style={{ color: "#8888aa", fontSize: "0.8rem", marginTop: "0.2rem" }}>初級50問・中級50問 — 月額100円</div>
                  </div>
                </div>
                <span style={{ color: "#667eea", fontSize: "0.85rem", fontWeight: 600 }}>プランを見る →</span>
              </div>
            </Link>
          </section>
        )}

        {/* 次のレッスン */}
        {nextLesson && (
          <section style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ color: "#e0e0f0", fontSize: "1.1rem", fontWeight: 600, marginBottom: "1rem" }}>次のレッスン</h2>
            <Link href={`/lessons/${nextLesson.slug}`} style={{ textDecoration: "none" }}>
              <div style={{
                background: "rgba(102,126,234,0.08)",
                border: "1px solid rgba(102,126,234,0.25)",
                borderRadius: "14px",
                padding: "1.25rem 1.5rem",
                cursor: "pointer",
              }}>
                <div style={{ color: "#8888aa", fontSize: "0.8rem", marginBottom: "0.25rem" }}>
                  {nextLesson.level === "beginner" ? "初級" : "中級"} — レッスン {nextLesson.order}
                </div>
                <div style={{ color: "#e0e0f0", fontWeight: 600, fontSize: "1rem" }}>{nextLesson.title}</div>
                <div style={{ color: "#667eea", fontSize: "0.85rem", marginTop: "0.25rem" }}>学習を始める →</div>
              </div>
            </Link>
          </section>
        )}

        {/* 無料レッスン進捗 */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ color: "#e0e0f0", fontSize: "1.1rem", fontWeight: 600, marginBottom: "1.5rem" }}>無料レッスン進捗</h2>
          <LevelSection
            title="初級コース"
            color="#34d399"
            lessons={beginnerLessons}
            completedSlugs={completedSlugs}
            solvedExIds={solvedExIds}
          />
          <LevelSection
            title="中級コース"
            color="#667eea"
            lessons={intermediateLessons}
            completedSlugs={completedSlugs}
            solvedExIds={solvedExIds}
          />
        </section>

        {/* プレミアムレッスン進捗（加入中のみ） */}
        {isPremium && (
          <section>
            <h2 style={{ color: "#e0e0f0", fontSize: "1.1rem", fontWeight: 600, marginBottom: "1.5rem" }}>プレミアムレッスン進捗</h2>
            <LevelSection
              title="プレミアム初級コース"
              color="#34d399"
              lessons={premiumBeginnerLessons}
              completedSlugs={completedSlugs}
              solvedExIds={solvedExIds}
              hrefPrefix="/premium/lessons"
            />
            <LevelSection
              title="プレミアム中級コース"
              color="#a78bfa"
              lessons={premiumIntermediateLessons}
              completedSlugs={completedSlugs}
              solvedExIds={solvedExIds}
              hrefPrefix="/premium/lessons"
            />
          </section>
        )}
      </main>
    </>
  );
}

function StatCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "1.5rem" }}>
      <div style={{ color: "#8888aa", fontSize: "0.8rem", marginBottom: "0.5rem" }}>{label}</div>
      <div style={{ color, fontSize: "1.8rem", fontWeight: 700, lineHeight: 1 }}>{value}</div>
      <div style={{ color: "#8888aa", fontSize: "0.8rem", marginTop: "0.4rem" }}>{sub}</div>
    </div>
  );
}
