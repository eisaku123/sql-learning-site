"use client";

import Link from "next/link";
import Header from "@/components/Header";

export default function TopPage() {
  const features = [
    {
      icon: "⌨️",
      title: "ブラウザSQLエディタ",
      desc: "インストール不要。ブラウザ上でSQLを入力・実行して即座に結果を確認できます。",
    },
    {
      icon: "📚",
      title: "体系的なカリキュラム",
      desc: "初級5レッスン＋中級4レッスン。基礎から集計・JOINまで段階的に学べます。",
    },
    {
      icon: "📊",
      title: "進捗管理",
      desc: "完了したレッスンや解いた問題が記録され、学習の進み具合をいつでも確認できます。",
    },
  ];

  return (
    <>
      <Header />
      <main style={{ paddingTop: "60px" }}>
        {/* ヒーロー */}
        <section
          style={{
            minHeight: "calc(100vh - 60px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "4rem 2rem",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* 背景グラデーション */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(102,126,234,0.12) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", maxWidth: "800px" }}>
            <div
              style={{
                display: "inline-block",
                background: "rgba(102,126,234,0.1)",
                border: "1px solid rgba(102,126,234,0.3)",
                borderRadius: "20px",
                padding: "0.35rem 1rem",
                color: "#667eea",
                fontSize: "0.82rem",
                fontWeight: 600,
                letterSpacing: "0.05em",
                marginBottom: "1.5rem",
              }}
            >
              SQL学習プラットフォーム
            </div>

            <h1
              style={{
                fontSize: "clamp(2.2rem, 7vw, 4rem)",
                fontWeight: 800,
                color: "#e0e0f0",
                lineHeight: 1.15,
                marginBottom: "1.25rem",
              }}
            >
              ブラウザで学ぶ
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                SQL入門
              </span>
            </h1>

            <p
              style={{
                fontSize: "1.1rem",
                color: "#8888aa",
                lineHeight: 1.8,
                marginBottom: "2.5rem",
                maxWidth: "560px",
                margin: "0 auto 2.5rem",
              }}
            >
              インストール不要。ブラウザ上でSQLを実行しながら、
              データベース操作を体系的に学べる学習プラットフォームです。
            </p>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/register"
                style={{
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  color: "#fff",
                  textDecoration: "none",
                  padding: "0.85rem 2rem",
                  borderRadius: "50px",
                  fontWeight: 700,
                  fontSize: "1rem",
                  transition: "opacity 0.2s",
                }}
              >
                無料で始める →
              </Link>
              <Link
                href="/lessons"
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
                レッスン一覧
              </Link>
            </div>
          </div>

          {/* コードプレビュー */}
          <div
            style={{
              marginTop: "3rem",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              padding: "1.5rem",
              maxWidth: "560px",
              width: "100%",
              textAlign: "left",
              fontFamily: "monospace",
              fontSize: "0.9rem",
              lineHeight: 2,
            }}
          >
            <div style={{ color: "#546e7a", marginBottom: "0.5rem", fontSize: "0.75rem" }}>
              ● sql_editor
            </div>
            <div>
              <span className="sql-keyword" style={{ color: "#c792ea", fontWeight: 600 }}>SELECT </span>
              <span style={{ color: "#82aaff" }}>e.name</span>
              <span style={{ color: "#e0e0f0" }}>, </span>
              <span style={{ color: "#82aaff" }}>d.name</span>
              <span style={{ color: "#e0e0f0" }}> AS department</span>
            </div>
            <div>
              <span className="sql-keyword" style={{ color: "#c792ea", fontWeight: 600 }}>FROM </span>
              <span style={{ color: "#82aaff" }}>employees e</span>
            </div>
            <div>
              <span className="sql-keyword" style={{ color: "#c792ea", fontWeight: 600 }}>JOIN </span>
              <span style={{ color: "#82aaff" }}>departments d</span>
              <span style={{ color: "#e0e0f0" }}> ON </span>
              <span style={{ color: "#82aaff" }}>e.department_id = d.id</span>
            </div>
            <div>
              <span className="sql-keyword" style={{ color: "#c792ea", fontWeight: 600 }}>ORDER BY </span>
              <span style={{ color: "#82aaff" }}>e.salary</span>
              <span style={{ color: "#c792ea", fontWeight: 600 }}> DESC</span>
              <span style={{ color: "#e0e0f0" }}>;</span>
            </div>
          </div>
        </section>

        {/* 機能紹介 */}
        <section
          style={{
            padding: "5rem 2rem",
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              fontWeight: 700,
              color: "#e0e0f0",
              marginBottom: "0.5rem",
            }}
          >
            SQLLearnの特徴
          </h2>
          <div
            style={{
              width: "60px",
              height: "3px",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              borderRadius: "2px",
              margin: "0 auto 3rem",
            }}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {features.map((f) => (
              <div
                key={f.title}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "16px",
                  padding: "2rem",
                  transition: "all 0.25s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = "translateY(-4px)";
                  el.style.borderColor = "rgba(102,126,234,0.3)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = "";
                  el.style.borderColor = "rgba(255,255,255,0.08)";
                }}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{f.icon}</div>
                <h3 style={{ color: "#e0e0f0", fontWeight: 700, marginBottom: "0.5rem" }}>
                  {f.title}
                </h3>
                <p style={{ color: "#8888aa", fontSize: "0.9rem", lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section
          style={{
            textAlign: "center",
            padding: "5rem 2rem",
            background: "rgba(102,126,234,0.05)",
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              color: "#e0e0f0",
              fontWeight: 700,
              marginBottom: "1rem",
            }}
          >
            今すぐSQL学習を始めよう
          </h2>
          <p style={{ color: "#8888aa", marginBottom: "2rem" }}>
            無料で全レッスンにアクセスできます
          </p>
          <Link
            href="/register"
            style={{
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "#fff",
              textDecoration: "none",
              padding: "0.85rem 2.5rem",
              borderRadius: "50px",
              fontWeight: 700,
              fontSize: "1rem",
            }}
          >
            無料アカウント作成
          </Link>
        </section>
      </main>
    </>
  );
}
