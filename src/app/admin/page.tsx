import { prisma } from "@/lib/db";

export default async function AdminDashboard() {
  const [userCount, premiumCount, setting] = await Promise.all([
    prisma.user.count(),
    prisma.subscription.count({ where: { status: { in: ["active", "cancel_at_period_end"] } } }),
    prisma.siteSetting.findUnique({ where: { key: "maintenance_mode" } }),
  ]);

  const maintenanceOn = setting?.value === "true";

  const cards = [
    { label: "総ユーザー数", value: userCount, unit: "人", color: "#667eea" },
    { label: "プレミアム会員", value: premiumCount, unit: "人", color: "#34d399" },
    { label: "メンテナンス", value: maintenanceOn ? "ON" : "OFF", unit: "", color: maintenanceOn ? "#f87171" : "#8888aa" },
  ];

  return (
    <div>
      <h1 style={{ color: "#e0e0f0", fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.25rem" }}>
        ダッシュボード
      </h1>
      <p style={{ color: "#8888aa", fontSize: "0.85rem", marginBottom: "2rem" }}>SQLLearn 管理画面</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
        {cards.map((c) => (
          <div
            key={c.label}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              padding: "1.5rem",
            }}
          >
            <div style={{ color: "#8888aa", fontSize: "0.8rem", marginBottom: "0.5rem" }}>{c.label}</div>
            <div style={{ color: c.color, fontSize: "2rem", fontWeight: 800 }}>
              {c.value}
              {c.unit && <span style={{ fontSize: "0.9rem", marginLeft: "0.25rem" }}>{c.unit}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
