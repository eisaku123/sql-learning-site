import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      subscription: { select: { status: true, currentPeriodEnd: true } },
      progress: { select: { completed: true } },
      exercises: { select: { solved: true } },
    },
  });

  return (
    <div>
      <h1 style={{ color: "#e0e0f0", fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.25rem" }}>
        ユーザー一覧
      </h1>
      <p style={{ color: "#8888aa", fontSize: "0.85rem", marginBottom: "2rem" }}>
        登録ユーザー {users.length}人
      </p>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              {["名前", "メール", "登録日", "プレミアム", "レッスン完了", "正解問題数", ""].map((h) => (
                <th
                  key={h}
                  style={{
                    color: "#8888aa",
                    fontWeight: 600,
                    padding: "0.6rem 1rem",
                    textAlign: "left",
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isPremium =
                u.subscription?.status === "active" ||
                u.subscription?.status === "cancel_at_period_end";
              const completedLessons = u.progress.filter((p) => p.completed).length;
              const solvedExercises = u.exercises.filter((e) => e.solved).length;

              return (
                <tr
                  key={u.id}
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <td style={{ padding: "0.75rem 1rem", color: "#e0e0f0" }}>
                    {u.name ?? "—"}
                  </td>
                  <td style={{ padding: "0.75rem 1rem", color: "#c0c0d8" }}>{u.email}</td>
                  <td style={{ padding: "0.75rem 1rem", color: "#8888aa", whiteSpace: "nowrap" }}>
                    {new Date(u.createdAt).toLocaleDateString("ja-JP")}
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <span
                      style={{
                        background: isPremium ? "rgba(52,211,153,0.1)" : "rgba(255,255,255,0.05)",
                        border: `1px solid ${isPremium ? "rgba(52,211,153,0.3)" : "rgba(255,255,255,0.1)"}`,
                        borderRadius: "20px",
                        padding: "0.15rem 0.6rem",
                        color: isPremium ? "#34d399" : "#8888aa",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                      }}
                    >
                      {isPremium ? "有効" : "無料"}
                    </span>
                  </td>
                  <td style={{ padding: "0.75rem 1rem", color: "#c0c0d8", textAlign: "center" }}>
                    {completedLessons}
                  </td>
                  <td style={{ padding: "0.75rem 1rem", color: "#c0c0d8", textAlign: "center" }}>
                    {solvedExercises}
                  </td>
                  <td style={{ padding: "0.75rem 1rem", textAlign: "center" }}>
                    <Link
                      href={`/admin/users/${u.id}/progress`}
                      style={{
                        background: "rgba(102,126,234,0.15)",
                        border: "1px solid rgba(102,126,234,0.3)",
                        borderRadius: "6px",
                        color: "#667eea",
                        padding: "0.3rem 0.75rem",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        textDecoration: "none",
                        whiteSpace: "nowrap",
                      }}
                    >
                      詳細 →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
