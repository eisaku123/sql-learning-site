import Link from "next/link";
import Header from "@/components/Header";

export default function PremiumSuccessPage() {
  return (
    <>
      <Header />
      <main
        style={{
          paddingTop: "60px",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 2rem",
        }}
      >
        <div
          style={{
            textAlign: "center",
            maxWidth: "500px",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "rgba(102,126,234,0.15)",
              border: "2px solid rgba(102,126,234,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              margin: "0 auto 2rem",
            }}
          >
            ✓
          </div>
          <h1
            style={{
              color: "#e0e0f0",
              fontSize: "1.8rem",
              fontWeight: 800,
              marginBottom: "1rem",
            }}
          >
            プレミアム登録完了！
          </h1>
          <p style={{ color: "#8888aa", lineHeight: 1.8, marginBottom: "2rem" }}>
            プレミアムプランへの登録が完了しました。
            <br />
            初級・中級合計100問の練習問題をご利用いただけます。
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/premium/lessons"
              style={{
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                color: "#fff",
                textDecoration: "none",
                padding: "0.85rem 2rem",
                borderRadius: "50px",
                fontWeight: 700,
                fontSize: "1rem",
              }}
            >
              プレミアムレッスンへ →
            </Link>
            <Link
              href="/dashboard"
              style={{
                background: "transparent",
                color: "#e0e0f0",
                textDecoration: "none",
                padding: "0.85rem 2rem",
                borderRadius: "50px",
                border: "1px solid rgba(255,255,255,0.15)",
                fontWeight: 600,
                fontSize: "1rem",
              }}
            >
              ダッシュボード
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
