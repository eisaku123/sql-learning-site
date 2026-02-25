import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { LESSONS } from "@/lib/curriculum";
import Header from "@/components/Header";
import LessonCard from "@/components/LessonCard";

export default async function LessonsPage() {
  const session = await getServerSession(authOptions);
  let completedSlugs: Set<string> = new Set();

  if (session?.user?.id) {
    const progress = await prisma.userProgress.findMany({
      where: { userId: session.user.id, completed: true },
    });
    completedSlugs = new Set(progress.map((p) => p.lessonSlug));
  }

  const beginnerLessons = LESSONS.filter((l) => l.level === "beginner").sort((a, b) => a.order - b.order);
  const intermediateLessons = LESSONS.filter((l) => l.level === "intermediate").sort((a, b) => a.order - b.order);

  return (
    <>
      <Header />
      <main style={{ paddingTop: "80px", padding: "80px 2rem 4rem", maxWidth: "960px", margin: "0 auto" }}>
        <h1 style={{ color: "#e0e0f0", fontSize: "1.8rem", fontWeight: 700, marginBottom: "0.25rem" }}>
          レッスン一覧
        </h1>
        <p style={{ color: "#8888aa", marginBottom: "3rem" }}>
          {LESSONS.length}レッスン · 初級5 + 中級4
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
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
