"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import LoadingButton from "@/components/LoadingButton";

const HIDE_DELAY = 1000; // 非操作後に隠れるまでの時間（ms）

export default function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoveredRef = useRef(false);
  const mouseYRef = useRef<number | null>(null); // 現在のマウスY座標（null=マウス未移動）

  useEffect(() => {
    const HEADER_HEIGHT = 60;

    const startTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        // ホバー中、またはマウスが移動済みでヘッダー領域内にある場合は隠さない
        if (hoveredRef.current || (mouseYRef.current !== null && mouseYRef.current <= HEADER_HEIGHT)) return;
        setVisible(false);
        window.dispatchEvent(new CustomEvent("header-visibility", { detail: { visible: false } }));
      }, HIDE_DELAY);
    };

    const show = () => {
      setVisible(true);
      window.dispatchEvent(new CustomEvent("header-visibility", { detail: { visible: true } }));
      startTimer();
    };

    // マウスY座標を常時追跡。画面上部20px以内に来た時だけ再表示
    const onMouseMove = (e: MouseEvent) => {
      mouseYRef.current = e.clientY;
      if (e.clientY <= 20) show();
    };

    // 初回タイマー開始
    show();

    const otherEvents = ["touchstart"] as const;
    otherEvents.forEach((e) => window.addEventListener(e, show, { passive: true }));
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => {
      otherEvents.forEach((e) => window.removeEventListener(e, show));
      window.removeEventListener("mousemove", onMouseMove);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <header
      onMouseEnter={() => {
        hoveredRef.current = true;
        if (timerRef.current) clearTimeout(timerRef.current);
      }}
      onMouseLeave={() => {
        hoveredRef.current = false;
        // マウスが離れたら3秒後に隠す
        timerRef.current = setTimeout(() => {
          setVisible(false);
          window.dispatchEvent(new CustomEvent("header-visibility", { detail: { visible: false } }));
        }, HIDE_DELAY);
      }}
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
        transform: visible ? "translateY(0)" : "translateY(-60px)",
        transition: "transform 0.3s ease",
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
        {session && <NavLink href="/premium/lessons">プレミアム</NavLink>}
        {session && <NavLink href="/dashboard">ダッシュボード</NavLink>}
        <NavLink href="/pricing">料金</NavLink>

        {session ? (
          <LoadingButton
            loading={signingOut}
            onClick={async () => {
              setSigningOut(true);
              await signOut({ callbackUrl: "/" });
            }}
            style={{
              background: "rgba(102,126,234,0.15)",
              border: "1px solid rgba(102,126,234,0.3)",
              borderRadius: "8px",
              color: "#e0e0f0",
              padding: "0.4rem 1rem",
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
          </LoadingButton>
        ) : (
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
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
