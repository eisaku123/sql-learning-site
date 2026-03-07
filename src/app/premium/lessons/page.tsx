import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PREMIUM_LESSONS } from "@/lib/premium-curriculum";
import Header from "@/components/Header";
import LessonCard from "@/components/LessonCard";
import Link from "next/link";
import type { Metadata } from "next";
import CancelSubscriptionButton from "@/components/CancelSubscriptionButton";

export const metadata: Metadata = {
  title: "プレミアムレッスン一覧",
  description: "SQL有料コース。ウィンドウ関数・CTE・EXISTS・集合演算など初級50問・中級50問。",
};

export default async function PremiumLessonsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  // サブスクリプション確認
  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });
  const isActive =
    (subscription?.status === "active" || subscription?.status === "cancel_at_period_end") &&
    subscription.currentPeriodEnd > new Date();

  if (!isActive) {
    return (
      <>
        <Header />
        <main
          style={{
            paddingTop: "60px",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 2rem",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: "480px" }}>
            <div
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                background: "rgba(102,126,234,0.1)",
                border: "2px solid rgba(102,126,234,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.8rem",
                margin: "0 auto 1.5rem",
              }}
            >
              ⭐
            </div>
            <h1 style={{ color: "#e0e0f0", fontWeight: 800, fontSize: "1.6rem", marginBottom: "1rem" }}>
              プレミアムコンテンツ
            </h1>
            <p style={{ color: "#8888aa", lineHeight: 1.8, marginBottom: "2rem" }}>
              このコンテンツはプレミアム会員限定です。
              <br />
              月額100円で初級50問・中級50問にアクセスできます。
            </p>
            <Link
              href="/pricing"
              style={{
                display: "inline-block",
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                color: "#fff",
                textDecoration: "none",
                padding: "0.85rem 2.5rem",
                borderRadius: "50px",
                fontWeight: 700,
                fontSize: "1rem",
              }}
            >
              料金プランを見る →
            </Link>
          </div>
        </main>
      </>
    );
  }

  let completedSlugs: Set<string> = new Set();
  const progress = await prisma.userProgress.findMany({
    where: { userId: session.user.id, completed: true },
  });
  completedSlugs = new Set(progress.map((p) => p.lessonSlug));

  const beginnerLessons = PREMIUM_LESSONS.filter((l) => l.level === "beginner").sort(
    (a, b) => a.order - b.order
  );
  const intermediateLessons = PREMIUM_LESSONS.filter(
    (l) => l.level === "intermediate"
  ).sort((a, b) => a.order - b.order);

  return (
    <>
      <Header />
      <main style={{ paddingTop: "80px", padding: "80px 2rem 4rem", maxWidth: "960px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
          <h1 style={{ color: "#e0e0f0", fontSize: "1.8rem", fontWeight: 700 }}>
            プレミアムレッスン
          </h1>
          <div
            style={{
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              borderRadius: "20px",
              padding: "0.2rem 0.75rem",
              color: "#fff",
              fontSize: "0.7rem",
              fontWeight: 700,
            }}
          >
            PREMIUM
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "3rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <p style={{ color: "#8888aa", margin: 0 }}>
            {PREMIUM_LESSONS.length}レッスン · 初級10 + 中級10 · 合計100問
          </p>
          <CancelSubscriptionButton
            periodEnd={subscription!.currentPeriodEnd}
            alreadyCanceling={subscription!.status === "cancel_at_period_end"}
          />
        </div>

        {/* 初級 */}
        <section style={{ marginBottom: "3rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <h2 style={{ color: "#34d399", fontWeight: 700, fontSize: "1.1rem" }}>
              プレミアム初級コース
            </h2>
            <div style={{ height: "1px", flex: 1, background: "rgba(52,211,153,0.2)" }} />
            <span style={{ color: "#546e7a", fontSize: "0.8rem" }}>
              {beginnerLessons.filter((l) => completedSlugs.has(l.slug)).length} /{" "}
              {beginnerLessons.length} 完了
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
                lesson={{ ...lesson, slug: `premium-${lesson.slug}` }}
                completed={completedSlugs.has(lesson.slug)}
                index={i}
                href={`/premium/lessons/${lesson.slug}`}
              />
            ))}
          </div>
        </section>

        {/* 中級 */}
        <section>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <h2 style={{ color: "#667eea", fontWeight: 700, fontSize: "1.1rem" }}>
              プレミアム中級コース
            </h2>
            <div style={{ height: "1px", flex: 1, background: "rgba(102,126,234,0.2)" }} />
            <span style={{ color: "#546e7a", fontSize: "0.8rem" }}>
              {intermediateLessons.filter((l) => completedSlugs.has(l.slug)).length} /{" "}
              {intermediateLessons.length} 完了
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
                lesson={{ ...lesson, slug: `premium-${lesson.slug}` }}
                completed={completedSlugs.has(lesson.slug)}
                index={i}
                href={`/premium/lessons/${lesson.slug}`}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
