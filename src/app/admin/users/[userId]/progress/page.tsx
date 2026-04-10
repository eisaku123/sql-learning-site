import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { LESSONS } from "@/lib/curriculum";
import { PREMIUM_LESSONS } from "@/lib/premium-curriculum";

export default async function UserProgressPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      subscription: { select: { status: true, currentPeriodEnd: true } },
      progress: { select: { lessonSlug: true, completed: true, completedAt: true } },
      exercises: { select: { exerciseId: true, solved: true, solvedAt: true, attempts: true } },
    },
  });

  if (!user) notFound();

  const isPremium =
    user.subscription?.status === "active" ||
    user.subscription?.status === "cancel_at_period_end";

  const completedSlugs = new Set(
    user.progress.filter((p) => p.completed).map((p) => p.lessonSlug)
  );
  const solvedIds = new Set(
    user.exercises.filter((e) => e.solved).map((e) => e.exerciseId)
  );
  const exerciseMap = new Map(user.exercises.map((e) => [e.exerciseId, e]));

  const allLessons = [
    ...LESSONS.map((l) => ({ ...l, type: "free" as const })),
    ...PREMIUM_LESSONS.map((l) => ({ ...l, type: "premium" as const })),
  ];

  const totalSolved = user.exercises.filter((e) => e.solved).length;
  const totalCompleted = user.progress.filter((p) => p.completed).length;

  return (
    <div>
      {/* ヘッダー */}
      <div style={{ marginBottom: "2rem" }}>
        <Link
          href="/admin/users"
          style={{ color: "#667eea", fontSize: "0.85rem", textDecoration: "none" }}
        >
          ← ユーザー一覧
        </Link>
        <h1 style={{ color: "#e0e0f0", fontSize: "1.4rem", fontWeight: 700, margin: "0.75rem 0 0.25rem" }}>
          {user.name ?? "—"} の進捗詳細
        </h1>
        <p style={{ color: "#8888aa", fontSize: "0.85rem" }}>{user.email}</p>
      </div>

      {/* サマリーカード */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        {[
          { label: "登録日", value: new Date(user.createdAt).toLocaleDateString("ja-JP") },
          { label: "プラン", value: isPremium ? "プレミアム" : "無料", color: isPremium ? "#34d399" : "#8888aa" },
          { label: "レッスン完了", value: `${totalCompleted} レッスン` },
          { label: "正解問題数", value: `${totalSolved} 問` },
        ].map((card) => (
          <div
            key={card.label}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "10px",
              padding: "1rem 1.5rem",
              minWidth: "140px",
            }}
          >
            <div style={{ color: "#8888aa", fontSize: "0.75rem", marginBottom: "0.35rem" }}>{card.label}</div>
            <div style={{ color: card.color ?? "#e0e0f0", fontSize: "1.1rem", fontWeight: 700 }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* レッスン別進捗 */}
      {(["free", "premium"] as const).map((type) => {
        const lessons = allLessons.filter((l) => l.type === type);
        if (type === "premium" && !isPremium) return null;
        return (
          <div key={type} style={{ marginBottom: "2.5rem" }}>
            <h2 style={{
              color: type === "premium" ? "#667eea" : "#34d399",
              fontSize: "0.85rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}>
              {type === "free" ? "無料レッスン" : "プレミアムレッスン"}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {lessons.map((lesson) => {
                const isCompleted = completedSlugs.has(lesson.slug);
                const solvedCount = lesson.exercises.filter((ex) => solvedIds.has(ex.id)).length;
                const total = lesson.exercises.length;

                return (
                  <div
                    key={lesson.slug}
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: `1px solid ${isCompleted ? "rgba(52,211,153,0.2)" : "rgba(255,255,255,0.06)"}`,
                      borderRadius: "10px",
                      padding: "1rem 1.25rem",
                    }}
                  >
                    {/* レッスンヘッダー */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                      <span style={{ fontSize: "1rem" }}>{isCompleted ? "✅" : "⬜"}</span>
                      <span style={{ color: "#e0e0f0", fontWeight: 600, fontSize: "0.9rem" }}>
                        {lesson.title}
                      </span>
                      <span style={{ color: "#8888aa", fontSize: "0.8rem", marginLeft: "auto" }}>
                        {solvedCount} / {total} 問正解
                      </span>
                      {isCompleted && (() => {
                        const p = user.progress.find((p) => p.lessonSlug === lesson.slug);
                        return p?.completedAt ? (
                          <span style={{ color: "#546e7a", fontSize: "0.75rem" }}>
                            {new Date(p.completedAt).toLocaleDateString("ja-JP")} 完了
                          </span>
                        ) : null;
                      })()}
                    </div>

                    {/* プログレスバー */}
                    <div style={{
                      height: "4px",
                      background: "rgba(255,255,255,0.06)",
                      borderRadius: "2px",
                      marginBottom: "0.75rem",
                      overflow: "hidden",
                    }}>
                      <div style={{
                        height: "100%",
                        width: `${total > 0 ? (solvedCount / total) * 100 : 0}%`,
                        background: isCompleted ? "#34d399" : "#667eea",
                        borderRadius: "2px",
                        transition: "width 0.3s",
                      }} />
                    </div>

                    {/* 問題ごとの状況 */}
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      {lesson.exercises.map((ex, i) => {
                        const record = exerciseMap.get(ex.id);
                        const isSolved = record?.solved ?? false;
                        return (
                          <div
                            key={ex.id}
                            title={isSolved && record?.solvedAt
                              ? `問題${i + 1}: ${new Date(record.solvedAt).toLocaleDateString("ja-JP")} 正解`
                              : `問題${i + 1}: 未正解`}
                            style={{
                              width: "28px",
                              height: "28px",
                              borderRadius: "6px",
                              background: isSolved ? "rgba(52,211,153,0.15)" : "rgba(255,255,255,0.04)",
                              border: `1px solid ${isSolved ? "rgba(52,211,153,0.4)" : "rgba(255,255,255,0.08)"}`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.72rem",
                              color: isSolved ? "#34d399" : "#546e7a",
                              fontWeight: 600,
                              cursor: "default",
                            }}
                          >
                            {isSolved ? "✓" : i + 1}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
