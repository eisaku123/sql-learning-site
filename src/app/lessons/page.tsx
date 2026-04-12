import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { LESSONS } from "@/lib/curriculum";
import { PREMIUM_LESSONS } from "@/lib/premium-curriculum";
import Header from "@/components/Header";
import PremiumLessonCard from "@/components/PremiumLessonCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SQLレッスン・練習問題一覧【初級〜中級】",
  description: "無料SQLレッスン全9コース一覧。SELECT・WHERE・JOIN・GROUP BY・サブクエリ・中間テーブルなど初心者から中級者まで体系的に学べるSQL練習問題サイト。ブラウザ上で実際にSQLを書いて実行できます。",
  keywords: ["SQL練習問題", "SQLレッスン", "SQL一覧", "SQL学習", "SELECT文", "JOIN", "GROUP BY", "サブクエリ"],
  alternates: { canonical: "/lessons" },
  openGraph: {
    title: "SQLレッスン・練習問題一覧【初級〜中級】| SQLLearn",
    description: "無料SQLレッスン全9コース一覧。SELECT・WHERE・JOIN・GROUP BY・サブクエリまで体系的に学べるSQL練習問題サイト。",
    url: "https://www.sql-learning.net/lessons",
  },
};
import LessonCard from "@/components/LessonCard";

export default async function LessonsPage() {
  const session = await getServerSession(authOptions);
  let completedSlugs: Set<string> = new Set();

  let isPremium = false;
  if (session?.user?.id) {
    const [progress, subscription] = await Promise.all([
      prisma.userProgress.findMany({ where: { userId: session.user.id, completed: true } }),
      prisma.subscription.findUnique({ where: { userId: session.user.id } }),
    ]);
    completedSlugs = new Set(progress.map((p) => p.lessonSlug));
    isPremium =
      (subscription?.status === "active" || subscription?.status === "cancel_at_period_end") &&
      (subscription?.currentPeriodEnd ?? new Date(0)) > new Date();
  }

  const beginnerLessons = LESSONS.filter((l) => l.level === "beginner").sort((a, b) => a.order - b.order);
  const intermediateLessons = LESSONS.filter((l) => l.level === "intermediate").sort((a, b) => a.order - b.order);
  const premiumBeginnerLessons = PREMIUM_LESSONS.filter((l) => l.level === "beginner").sort((a, b) => a.order - b.order);
  const premiumIntermediateLessons = PREMIUM_LESSONS.filter((l) => l.level === "intermediate").sort((a, b) => a.order - b.order);

  return (
    <>
      <Header />
      <main style={{ paddingTop: "80px", padding: "80px 2rem 4rem", maxWidth: "960px", margin: "0 auto" }}>
        <h1 style={{ color: "#e0e0f0", fontSize: "1.8rem", fontWeight: 700, marginBottom: "0.25rem" }}>
          レッスン一覧
        </h1>
        <p style={{ color: "#8888aa", marginBottom: "3rem" }}>
          無料{LESSONS.length}レッスン + プレミアム{PREMIUM_LESSONS.length}レッスン
        </p>

        {/* 初級 */}
        <section style={{ marginBottom: "3rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <h2 style={{ color: "#34d399", fontWeight: 700, fontSize: "1.1rem" }}>初級コース</h2>
            <div
              style={{
                height: "1px",
                flex: 1,
                background: "rgba(52,211,153,0.2)",
              }}
            />
            <span style={{ color: "#546e7a", fontSize: "0.8rem" }}>
              {beginnerLessons.filter((l) => completedSlugs.has(l.slug)).length} / {beginnerLessons.length} 完了
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1rem",
            }}
          >
            {beginnerLessons.map((lesson, i) => (
              <LessonCard
                key={lesson.slug}
                lesson={lesson}
                completed={completedSlugs.has(lesson.slug)}
                index={i}
              />
            ))}
          </div>
        </section>

        {/* 中級 */}
        <section>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <h2 style={{ color: "#667eea", fontWeight: 700, fontSize: "1.1rem" }}>中級コース</h2>
            <div
              style={{
                height: "1px",
                flex: 1,
                background: "rgba(102,126,234,0.2)",
              }}
            />
            <span style={{ color: "#546e7a", fontSize: "0.8rem" }}>
              {intermediateLessons.filter((l) => completedSlugs.has(l.slug)).length} / {intermediateLessons.length} 完了
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1rem",
            }}
          >
            {intermediateLessons.map((lesson, i) => (
              <LessonCard
                key={lesson.slug}
                lesson={lesson}
                completed={completedSlugs.has(lesson.slug)}
                index={i}
                isLoggedIn={!!session?.user}
              />
            ))}
          </div>
        </section>
        {/* プレミアム初級 */}
        <section style={{ marginBottom: "3rem", marginTop: "3rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <h2 style={{ color: "#34d399", fontWeight: 700, fontSize: "1.1rem" }}>
              プレミアム初級コース
            </h2>
            <span style={{
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              borderRadius: "20px", padding: "0.15rem 0.6rem",
              color: "#fff", fontSize: "0.7rem", fontWeight: 700,
            }}>PREMIUM</span>
            <div style={{ height: "1px", flex: 1, background: "rgba(52,211,153,0.2)" }} />
            {isPremium && (
              <span style={{ color: "#546e7a", fontSize: "0.8rem" }}>
                {premiumBeginnerLessons.filter((l) => completedSlugs.has(l.slug)).length} / {premiumBeginnerLessons.length} 完了
              </span>
            )}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
            {premiumBeginnerLessons.map((lesson, i) => (
              <PremiumLessonCard
                key={lesson.slug}
                lesson={lesson}
                completed={completedSlugs.has(lesson.slug)}
                index={i}
                isPremium={isPremium}
                isLoggedIn={!!session?.user}
              />
            ))}
          </div>
        </section>

        {/* プレミアム中級 */}
        <section>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <h2 style={{ color: "#667eea", fontWeight: 700, fontSize: "1.1rem" }}>
              プレミアム中級コース
            </h2>
            <span style={{
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              borderRadius: "20px", padding: "0.15rem 0.6rem",
              color: "#fff", fontSize: "0.7rem", fontWeight: 700,
            }}>PREMIUM</span>
            <div style={{ height: "1px", flex: 1, background: "rgba(102,126,234,0.2)" }} />
            {isPremium && (
              <span style={{ color: "#546e7a", fontSize: "0.8rem" }}>
                {premiumIntermediateLessons.filter((l) => completedSlugs.has(l.slug)).length} / {premiumIntermediateLessons.length} 完了
              </span>
            )}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
            {premiumIntermediateLessons.map((lesson, i) => (
              <PremiumLessonCard
                key={lesson.slug}
                lesson={lesson}
                completed={completedSlugs.has(lesson.slug)}
                index={i}
                isPremium={isPremium}
                isLoggedIn={!!session?.user}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
