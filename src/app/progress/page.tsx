import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { LESSONS } from "@/lib/curriculum";
import Header from "@/components/Header";
import ProgressCircle from "@/components/ProgressCircle";
import LevelSection from "@/components/LevelSection";

export default async function ProgressPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const [progressData, exerciseData] = await Promise.all([
    prisma.userProgress.findMany({ where: { userId: session.user.id } }),
    prisma.userExercise.findMany({ where: { userId: session.user.id } }),
  ]);

  const completedSlugs = progressData.filter((p) => p.completed).map((p) => p.lessonSlug);
  const solvedExIds = exerciseData.filter((e) => e.solved).map((e) => e.exerciseId);

  const totalLessons = LESSONS.length;
  const totalExercises = LESSONS.reduce((sum, l) => sum + l.exercises.length, 0);
  const completedLessons = completedSlugs.length;
  const solvedExercises = solvedExIds.length;

  const progressPercent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  const exercisePercent = totalExercises > 0 ? (solvedExercises / totalExercises) * 100 : 0;

  const beginnerLessons = LESSONS.filter((l) => l.level === "beginner");
  const intermediateLessons = LESSONS.filter((l) => l.level === "intermediate");

  return (
    <>
      <Header />
      <main style={{ paddingTop: "80px", padding: "80px 2rem 4rem", maxWidth: "860px", margin: "0 auto" }}>
        <h1 style={{ color: "#e0e0f0", fontSize: "1.8rem", fontWeight: 700, marginBottom: "2.5rem" }}>
          学習進捗
        </h1>

        {/* 円グラフサマリー */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "3rem",
            flexWrap: "wrap",
            marginBottom: "3rem",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "20px",
            padding: "2.5rem",
          }}
        >
          <ProgressCircle percent={progressPercent} size={120} label="レッスン完了率" />
          <ProgressCircle percent={exercisePercent} size={120} label="問題解決率" />
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "1rem" }}>
            <StatRow label="完了レッスン" value={`${completedLessons} / ${totalLessons}`} color="#667eea" />
            <StatRow label="解いた問題" value={`${solvedExercises} / ${totalExercises}`} color="#34d399" />
          </div>
        </div>

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
      </main>
    </>
  );
}

function StatRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div>
      <div style={{ color: "#8888aa", fontSize: "0.8rem" }}>{label}</div>
      <div style={{ color, fontWeight: 700, fontSize: "1.3rem" }}>{value}</div>
    </div>
  );
}
