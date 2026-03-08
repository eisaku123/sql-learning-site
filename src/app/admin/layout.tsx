"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { href: "/admin", label: "ダッシュボード", icon: "📊" },
  { href: "/admin/users", label: "ユーザー一覧", icon: "👥" },
  { href: "/admin/maintenance", label: "メンテナンス", icon: "🔧" },
  { href: "/admin/announcements", label: "お知らせ", icon: "📢" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") return <>{children}</>;

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0a1a" }}>
      {/* サイドバー */}
      <aside
        style={{
          width: "220px",
          flexShrink: 0,
          background: "rgba(255,255,255,0.02)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          flexDirection: "column",
          padding: "1.5rem 0",
        }}
      >
        <div style={{ padding: "0 1.25rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ color: "#667eea", fontWeight: 800, fontSize: "1rem" }}>SQLLearn</div>
          <div style={{ color: "#546e7a", fontSize: "0.75rem", marginTop: "0.2rem" }}>管理画面</div>
        </div>

        <nav style={{ flex: 1, padding: "1rem 0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  padding: "0.6rem 0.75rem",
                  borderRadius: "8px",
                  color: active ? "#e0e0f0" : "#8888aa",
                  background: active ? "rgba(102,126,234,0.15)" : "transparent",
                  textDecoration: "none",
                  fontSize: "0.88rem",
                  fontWeight: active ? 600 : 400,
                }}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: "0 0.75rem" }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              background: "none",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "8px",
              color: "#8888aa",
              padding: "0.6rem",
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            ログアウト
          </button>
        </div>
      </aside>

      {/* メインコンテンツ */}
      <main style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}
