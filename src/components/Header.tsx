"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: "rgba(10, 10, 26, 0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "0 2rem",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Link
        href="/"
        style={{
          color: "#e0e0f0",
          textDecoration: "none",
          fontWeight: 700,
          fontSize: "1.1rem",
          letterSpacing: "0.02em",
        }}
      >
        <span style={{ color: "#667eea" }}>SQL</span>
        <span style={{ color: "#764ba2" }}>Learn</span>
      </Link>

      {/* デスクトップナビ */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
        }}
      >
        <NavLink href="/lessons">レッスン</NavLink>
        {session && <NavLink href="/dashboard">ダッシュボード</NavLink>}
        {session && <NavLink href="/progress">進捗</NavLink>}

        {session ? (
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            style={{
              background: "rgba(102,126,234,0.15)",
              border: "1px solid rgba(102,126,234,0.3)",
              borderRadius: "8px",
              color: "#e0e0f0",
              padding: "0.4rem 1rem",
              cursor: "pointer",
              fontSize: "0.9rem",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.background = "rgba(102,126,234,0.3)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.background = "rgba(102,126,234,0.15)";
            }}
          >
            ログアウト
          </button>
        ) : (
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <NavLink href="/login">ログイン</NavLink>
            <Link
              href="/register"
              style={{
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                color: "#fff",
                textDecoration: "none",
                padding: "0.4rem 1rem",
                borderRadius: "8px",
                fontSize: "0.9rem",
                fontWeight: 600,
              }}
            >
              新規登録
            </Link>
          </div>
        )}

        {/* ハンバーガー（モバイル） */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            color: "#e0e0f0",
            cursor: "pointer",
            fontSize: "1.5rem",
          }}
          aria-label="メニュー"
        >
          ☰
        </button>
      </nav>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        color: "#8888aa",
        textDecoration: "none",
        fontSize: "0.9rem",
        transition: "color 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.target as HTMLElement).style.color = "#e0e0f0";
      }}
      onMouseLeave={(e) => {
        (e.target as HTMLElement).style.color = "#8888aa";
      }}
    >
      {children}
    </Link>
  );
}
