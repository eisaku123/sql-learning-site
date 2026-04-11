"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/admin", label: "ダッシュボード", icon: "📊" },
  { href: "/admin/users", label: "ユーザー一覧", icon: "👥" },
  { href: "/admin/maintenance", label: "メンテナンス", icon: "🔧" },
  { href: "/admin/announcements", label: "お知らせ", icon: "📢" },
  { href: "/admin/feedback", label: "ご意見箱", icon: "💬" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // ページ遷移完了時にスピナーを消す
  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  if (pathname === "/admin/login") return <>{children}</>;

  async function handleLogout() {
    setLoading(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0a1a" }}>
      {/* ローディングオーバーレイ */}
      {loading && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(10,10,26,0.75)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.25rem",
            backdropFilter: "blur(3px)",
          }}
        >
          {/* シンプルなリング */}
          <div style={{
            width: "78px",
            height: "78px",
            borderRadius: "50%",
            border: "8px solid rgba(102,126,234,0.2)",
            borderTopColor: "#667eea",
            borderRightColor: "#667eea",
            animation: "admin-spin 0.9s linear infinite",
          }} />
          {/* ドットが1つずつ増えるテキスト */}
          <span style={{ color: "#8888aa", fontSize: "1.3rem", fontWeight: 500, letterSpacing: "0.05em" }}>
            読み込み中
            <span style={{ display: "inline-block", width: "1.5em", textAlign: "left" }}>
              <span className="admin-dot1">.</span>
              <span className="admin-dot2">.</span>
              <span className="admin-dot3">.</span>
            </span>
          </span>
          <style>{`
            @keyframes admin-spin { to { transform: rotate(360deg); } }
            @keyframes admin-dot-blink {
              0%, 100% { opacity: 0; }
              50% { opacity: 1; }
            }
            .admin-dot1 { animation: admin-dot-blink 1.2s ease-in-out infinite; animation-delay: 0s; }
            .admin-dot2 { animation: admin-dot-blink 1.2s ease-in-out infinite; animation-delay: 0.4s; }
            .admin-dot3 { animation: admin-dot-blink 1.2s ease-in-out infinite; animation-delay: 0.8s; }
          `}</style>
        </div>
      )}
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
                onClick={() => { if (!active) setLoading(true); }}
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
      <main
        style={{ flex: 1, padding: "2rem", overflowY: "auto" }}
        onClick={(e) => {
          const anchor = (e.target as HTMLElement).closest("a");
          if (anchor && anchor.href.includes("/admin/") && anchor.href !== window.location.href) {
            setLoading(true);
          }
        }}
      >
        {children}
      </main>
    </div>
  );
}
