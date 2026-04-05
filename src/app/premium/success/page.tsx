"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";

export default function PremiumSuccessPage() {
  const searchParams = useSearchParams();
  const setupIntentId = searchParams.get("setup_intent");
  const redirectStatus = searchParams.get("redirect_status");

  const [status, setStatus] = useState<"processing" | "success" | "error">(
    setupIntentId ? "processing" : "success"
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!setupIntentId) return;
    if (redirectStatus !== "succeeded") {
      setStatus("error");
      setErrorMsg("カード情報の確認に失敗しました。もう一度お試しください。");
      return;
    }

    // SetupIntent成功後にサブスクリプションを作成
    fetch("/api/stripe/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ setupIntentId }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setStatus("error");
          setErrorMsg(data.error);
        } else {
          setStatus("success");
        }
      })
      .catch(() => {
        setStatus("error");
        setErrorMsg("通信エラーが発生しました。ダッシュボードで契約状況をご確認ください。");
      });
  }, [setupIntentId, redirectStatus]);

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
        <div style={{ textAlign: "center", maxWidth: "500px" }}>
          {status === "processing" && (
            <>
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
                ⏳
              </div>
              <h1 style={{ color: "#e0e0f0", fontSize: "1.8rem", fontWeight: 800, marginBottom: "1rem" }}>
                処理中...
              </h1>
              <p style={{ color: "#8888aa", lineHeight: 1.8 }}>
                サブスクリプションを有効化しています。<br />少々お待ちください。
              </p>
            </>
          )}

          {status === "success" && (
            <>
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
              <h1 style={{ color: "#e0e0f0", fontSize: "1.8rem", fontWeight: 800, marginBottom: "1rem" }}>
                プレミアム登録完了！
              </h1>
              <p style={{ color: "#8888aa", lineHeight: 1.8, marginBottom: "2rem" }}>
                プレミアムプランへの登録が完了しました。<br />
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
            </>
          )}

          {status === "error" && (
            <>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "rgba(248,113,113,0.1)",
                  border: "2px solid rgba(248,113,113,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2rem",
                  margin: "0 auto 2rem",
                }}
              >
                ✗
              </div>
              <h1 style={{ color: "#e0e0f0", fontSize: "1.8rem", fontWeight: 800, marginBottom: "1rem" }}>
                エラーが発生しました
              </h1>
              <p style={{ color: "#f87171", lineHeight: 1.8, marginBottom: "2rem" }}>
                {errorMsg}
              </p>
              <Link
                href="/premium/confirm"
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
                もう一度試す
              </Link>
            </>
          )}
        </div>
      </main>
    </>
  );
}
