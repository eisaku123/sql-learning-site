"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function NavigationSpinner() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  // ページ遷移完了時にスピナーを消す
  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  // リンククリック時にスピナーを表示
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;
      // 外部リンク・アンカー・ダウンロードは除外
      if (href.startsWith("http") || href.startsWith("#") || anchor.download) return;
      // 現在のページと同じなら除外
      if (href === pathname) return;
      setLoading(true);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname]);

  if (!loading) return null;

  return (
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
      <div
        style={{
          width: "78px",
          height: "78px",
          borderRadius: "50%",
          border: "8px solid rgba(102,126,234,0.2)",
          borderTopColor: "#667eea",
          borderRightColor: "#667eea",
          animation: "nav-spin 0.9s linear infinite",
        }}
      />
      <span style={{ color: "#8888aa", fontSize: "1.3rem", fontWeight: 500, letterSpacing: "0.05em" }}>
        読み込み中
        <span style={{ display: "inline-block", width: "1.5em", textAlign: "left" }}>
          <span className="nav-dot1">.</span>
          <span className="nav-dot2">.</span>
          <span className="nav-dot3">.</span>
        </span>
      </span>
      <style>{`
        @keyframes nav-spin { to { transform: rotate(360deg); } }
        @keyframes nav-dot-blink {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        .nav-dot1 { animation: nav-dot-blink 1.2s ease-in-out infinite; animation-delay: 0s; }
        .nav-dot2 { animation: nav-dot-blink 1.2s ease-in-out infinite; animation-delay: 0.4s; }
        .nav-dot3 { animation: nav-dot-blink 1.2s ease-in-out infinite; animation-delay: 0.8s; }
      `}</style>
    </div>
  );
}
