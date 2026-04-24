import { prisma } from "@/lib/db";

export default async function AdminDashboard() {
  // 今日の日付（JST）
  const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });

  // 過去30日の日付リスト生成
  const past30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
  });
  const past7Days = past30Days.slice(-7);

  // 先週・先月の範囲
  const lastWeekStart = past30Days[30 - 14]; // 14日前
  const lastWeekEnd = past30Days[30 - 8];    // 8日前
  const thisMonthStart = today.slice(0, 7) + "-01";
  const lastMonthDate = new Date(today);
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
  const lastMonthStart = lastMonthDate.toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" }).slice(0, 7) + "-01";
  const lastMonthEnd = today.slice(0, 7) + "-01"; // 今月1日の前日まで

  const [userCount, premiumCount, setting, pvRecords] = await Promise.all([
    prisma.user.count(),
    prisma.subscription.count({ where: { status: { in: ["active", "cancel_at_period_end"] } } }),
    prisma.siteSetting.findUnique({ where: { key: "maintenance_mode" } }),
    prisma.pageView.findMany({
      where: { date: { gte: past30Days[0] } },
      orderBy: { date: "asc" },
    }),
  ]);

  const pvMap = Object.fromEntries(pvRecords.map((r) => [r.date, r.count]));

  const todayPv = pvMap[today] ?? 0;
  const yesterdayPv = pvMap[past30Days[28]] ?? 0; // 1日前

  const thisWeekPv = past7Days.slice(0, 6).reduce((s, d) => s + (pvMap[d] ?? 0), 0); // 今日除く直近6日
  const thisWeekTotal = past7Days.reduce((s, d) => s + (pvMap[d] ?? 0), 0);
  const lastWeekPv = past30Days
    .filter((d) => d >= lastWeekStart && d <= lastWeekEnd)
    .reduce((s, d) => s + (pvMap[d] ?? 0), 0);

  const thisMonthPv = pvRecords
    .filter((r) => r.date >= thisMonthStart)
    .reduce((s, r) => s + r.count, 0);
  const lastMonthPv = pvRecords
    .filter((r) => r.date >= lastMonthStart && r.date < lastMonthEnd)
    .reduce((s, r) => s + r.count, 0);

  const totalPv = await prisma.pageView.aggregate({ _sum: { count: true } });
  const totalPvCount = totalPv._sum.count ?? 0;

  const maintenanceOn = setting?.value === "true";
  const cards = [
    { label: "総ユーザー数", value: userCount, unit: "人", color: "#667eea" },
    { label: "プレミアム会員", value: premiumCount, unit: "人", color: "#34d399" },
    { label: "メンテナンス", value: maintenanceOn ? "ON" : "OFF", unit: "", color: maintenanceOn ? "#f87171" : "#8888aa" },
  ];

  // 7日分のバーチャートデータ（最大値を100%として高さ計算）
  const barData = past7Days.map((d) => ({ date: d, count: pvMap[d] ?? 0 }));
  const maxCount = Math.max(...barData.map((b) => b.count), 1);

  const diffStyle = (diff: number): React.CSSProperties => ({
    fontSize: "0.7rem",
    color: diff >= 0 ? "#34d399" : "#f87171",
    marginTop: "0.3rem",
  });

  const pvSummary = [
    {
      label: "今日",
      value: todayPv,
      diff: todayPv - yesterdayPv,
      diffLabel: "昨日比",
    },
    {
      label: "今週",
      value: thisWeekTotal,
      diff: thisWeekTotal - lastWeekPv,
      diffLabel: "先週比",
    },
    {
      label: "今月",
      value: thisMonthPv,
      diff: thisMonthPv - lastMonthPv,
      diffLabel: "先月比",
    },
    {
      label: "累計",
      value: totalPvCount,
      diff: null,
      diffLabel: "サービス開始から",
    },
  ];

  return (
    <div>
      <h1 style={{ color: "#e0e0f0", fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.25rem" }}>
        ダッシュボード
      </h1>
      <p style={{ color: "#8888aa", fontSize: "0.85rem", marginBottom: "2rem" }}>SQLLearn 管理画面</p>

      {/* 既存カード */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
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

      {/* PVセクション */}
      <div style={{ color: "#667eea", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.07em", marginBottom: "0.85rem" }}>
        トップページ アクセス数（PV）
      </div>

      {/* PVサマリーカード */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem", marginBottom: "1.25rem" }}>
        {pvSummary.map((s) => (
          <div
            key={s.label}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "14px",
              padding: "1.1rem 1.2rem",
            }}
          >
            <div style={{ fontSize: "0.72rem", color: "#8888aa", marginBottom: "0.35rem" }}>{s.label}</div>
            <div style={{ fontSize: "1.7rem", fontWeight: 800, color: "#d090ff", lineHeight: 1 }}>
              {s.value.toLocaleString()}
              <span style={{ fontSize: "0.8rem", fontWeight: 400, marginLeft: "0.15rem" }}>PV</span>
            </div>
            {s.diff !== null ? (
              <div style={diffStyle(s.diff)}>
                {s.diff >= 0 ? "↑" : "↓"} {s.diffLabel} {s.diff >= 0 ? "+" : ""}{s.diff}
              </div>
            ) : (
              <div style={{ fontSize: "0.68rem", color: "#4a4a6a", marginTop: "0.3rem" }}>{s.diffLabel}</div>
            )}
          </div>
        ))}
      </div>

      {/* バーチャート */}
      <div
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "14px",
          padding: "1.25rem 1.5rem",
        }}
      >
        <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#c0c0d8", marginBottom: "1.25rem" }}>
          日別アクセス数（過去7日）
        </div>

        {/* バー */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "0.5rem",
            height: "120px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            paddingBottom: "0",
          }}
        >
          {barData.map((b) => {
            const isToday = b.date === today;
            const heightPct = Math.max((b.count / maxCount) * 100, b.count > 0 ? 4 : 0);
            return (
              <div
                key={b.date}
                style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%", gap: "0.25rem" }}
              >
                {b.count > 0 && (
                  <span style={{ fontSize: "0.62rem", color: "#8888aa" }}>{b.count}</span>
                )}
                <div
                  style={{
                    width: "100%",
                    height: `${heightPct}%`,
                    minHeight: b.count > 0 ? "4px" : "0",
                    borderRadius: "4px 4px 0 0",
                    background: isToday
                      ? "linear-gradient(180deg, #a050ff, #667eea)"
                      : "linear-gradient(180deg, rgba(160,80,255,0.55), rgba(102,126,234,0.35))",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* X軸ラベル */}
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
          {barData.map((b) => {
            const isToday = b.date === today;
            const label = isToday ? "今日" : b.date.slice(5).replace("-", "/");
            return (
              <div
                key={b.date}
                style={{ flex: 1, textAlign: "center", fontSize: "0.62rem", color: isToday ? "#a070ff" : "#4a4a6a" }}
              >
                {label}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
