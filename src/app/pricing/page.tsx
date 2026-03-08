"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import LoadingButton from "@/components/LoadingButton";

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [premiumSignupEnabled, setPremiumSignupEnabled] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/subscription")
        .then((r) => r.json())
        .then((data) => setIsPremium(data.active));
    }
    fetch("/api/announcements/settings")
      .then((r) => r.json())
      .then((data) => setPremiumSignupEnabled(data.premiumSignupEnabled));
  }, [session]);

  const handleCheckout = async () => {
    if (!session?.user) {
      router.push("/login");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } finally {
      setLoading(false);
    }
  };

  const freePlan = [
    "初級コース 5レッスン（15問）",
    "中級コース 4レッスン（12問）",
    "ブラウザSQLエディタ",
    "進捗管理",
  ];

  const premiumPlan = [
    "無料コースの全コンテンツ",
    "プレミアム初級コース 10レッスン（50問）",
    "プレミアム中級コース 10レッスン（50問）",
    "NULL値・文字列・数値・日付関数",
    "ウィンドウ関数（ROW_NUMBER・RANK・LAG・LEAD）",
    "CTE（WITH句）・再帰クエリ",
    "EXISTS・集合演算・SELF JOIN・ビュー",
    "高度なサブクエリと総合演習",
    "進捗管理（プレミアム問題含む）",
  ];

  return (
    <>
      <Header />
      <main style={{ paddingTop: "60px", minHeight: "100vh" }}>
        {/* ヒーロー */}
        <section
          style={{
            padding: "5rem 2rem 3rem",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(102,126,234,0.1) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              display: "inline-block",
              background: "rgba(102,126,234,0.1)",
              border: "1px solid rgba(102,126,234,0.3)",
              borderRadius: "20px",
              padding: "0.3rem 1rem",
              color: "#667eea",
              fontSize: "0.8rem",
              fontWeight: 600,
              marginBottom: "1.5rem",
            }}
          >
            料金プラン
          </div>
          <h1
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 800,
              color: "#e0e0f0",
              marginBottom: "1rem",
              lineHeight: 1.2,
            }}
          >
            シンプルな料金体系
          </h1>
          <p style={{ color: "#8888aa", fontSize: "1rem", maxWidth: "500px", margin: "0 auto" }}>
            無料で基礎を学び、プレミアムで実践力を身につけましょう
          </p>
        </section>

        {/* プランカード */}
        <section
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: "2rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
            alignItems: "start",
          }}
        >
          {/* 無料プラン */}
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "20px",
              padding: "2rem",
            }}
          >
            <div style={{ marginBottom: "1.5rem" }}>
              <div
                style={{
                  display: "inline-block",
                  background: "rgba(52,211,153,0.1)",
                  border: "1px solid rgba(52,211,153,0.3)",
                  borderRadius: "8px",
                  padding: "0.25rem 0.75rem",
                  color: "#34d399",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  marginBottom: "1rem",
                }}
              >
                無料
              </div>
              <h2 style={{ color: "#e0e0f0", fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                フリープラン
              </h2>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
                <span style={{ fontSize: "2.5rem", fontWeight: 800, color: "#e0e0f0" }}>¥0</span>
                <span style={{ color: "#8888aa", fontSize: "0.9rem" }}>/月</span>
              </div>
            </div>

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {freePlan.map((item) => (
                <li key={item} style={{ display: "flex", gap: "0.75rem", color: "#c0c0d8", fontSize: "0.9rem" }}>
                  <span style={{ color: "#34d399", flexShrink: 0 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>

            <Link
              href="/register"
              style={{
                display: "block",
                textAlign: "center",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "12px",
                color: "#e0e0f0",
                textDecoration: "none",
                padding: "0.85rem",
                fontWeight: 600,
                fontSize: "0.95rem",
              }}
            >
              無料で始める
            </Link>
          </div>

          {/* プレミアムプラン */}
          <div
            style={{
              background: "rgba(102,126,234,0.06)",
              border: "2px solid rgba(102,126,234,0.4)",
              borderRadius: "20px",
              padding: "2rem",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* おすすめバッジ */}
            <div
              style={{
                position: "absolute",
                top: "1.25rem",
                right: "1.25rem",
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                borderRadius: "20px",
                padding: "0.25rem 0.75rem",
                color: "#fff",
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.05em",
              }}
            >
              おすすめ
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <div
                style={{
                  display: "inline-block",
                  background: "rgba(102,126,234,0.15)",
                  border: "1px solid rgba(102,126,234,0.4)",
                  borderRadius: "8px",
                  padding: "0.25rem 0.75rem",
                  color: "#667eea",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  marginBottom: "1rem",
                }}
              >
                月額
              </div>
              <h2 style={{ color: "#e0e0f0", fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                プレミアムプラン
              </h2>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
                <span style={{ fontSize: "2.5rem", fontWeight: 800, color: "#e0e0f0" }}>¥100</span>
                <span style={{ color: "#8888aa", fontSize: "0.9rem" }}>/月</span>
              </div>
              <p style={{ color: "#8888aa", fontSize: "0.8rem", marginTop: "0.25rem" }}>
                いつでもキャンセル可能
              </p>
            </div>

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {premiumPlan.map((item) => (
                <li key={item} style={{ display: "flex", gap: "0.75rem", color: "#c0c0d8", fontSize: "0.9rem" }}>
                  <span style={{ color: "#667eea", flexShrink: 0 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>

            {isPremium ? (
              <Link
                href="/premium/lessons"
                style={{
                  display: "block",
                  textAlign: "center",
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  border: "none",
                  borderRadius: "12px",
                  color: "#fff",
                  textDecoration: "none",
                  padding: "0.9rem",
                  fontWeight: 700,
                  fontSize: "1rem",
                }}
              >
                プレミアムレッスンへ →
              </Link>
            ) : !premiumSignupEnabled ? (
              <div
                style={{
                  textAlign: "center",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "#8888aa",
                  padding: "0.9rem",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                }}
              >
                現在、新規申し込みを停止しています
              </div>
            ) : (
              <LoadingButton
                onClick={handleCheckout}
                loading={loading}
                loadingText="処理中..."
                style={{
                  width: "100%",
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  border: "none",
                  borderRadius: "12px",
                  color: "#fff",
                  padding: "0.9rem",
                  fontWeight: 700,
                  fontSize: "1rem",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.85"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
              >
                {session?.user ? "プレミアムに申し込む" : "ログインして申し込む"}
              </LoadingButton>
            )}
          </div>
        </section>

        {/* FAQ */}
        <section
          style={{
            maxWidth: "700px",
            margin: "3rem auto",
            padding: "0 2rem 5rem",
          }}
        >
          <h2
            style={{
              color: "#e0e0f0",
              fontWeight: 700,
              fontSize: "1.3rem",
              marginBottom: "2rem",
              textAlign: "center",
            }}
          >
            よくある質問
          </h2>
          {[
            {
              q: "いつでも解約できますか？",
              a: "はい。サブスクリプションはいつでもキャンセルできます。キャンセル後も契約期間終了まで引き続き利用できます。",
            },
            {
              q: "支払い方法は？",
              a: "クレジットカード・デビットカードに対応しています（Stripe経由で安全に処理されます）。",
            },
            {
              q: "無料プランのコンテンツは引き続き使えますか？",
              a: "はい。プレミアムに加入しても、無料コンテンツは引き続きご利用いただけます。",
            },
          ].map((faq) => (
            <div
              key={faq.q}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "12px",
                padding: "1.25rem 1.5rem",
                marginBottom: "1rem",
              }}
            >
              <h3 style={{ color: "#e0e0f0", fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.5rem" }}>
                {faq.q}
              </h3>
              <p style={{ color: "#8888aa", fontSize: "0.88rem", lineHeight: 1.7, margin: 0 }}>
                {faq.a}
              </p>
            </div>
          ))}
        </section>
      </main>
    </>
  );
}
