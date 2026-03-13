"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function VerifyEmailContent() {
  const params = useSearchParams();
  const success = params.get("success");
  const error = params.get("error");

  let icon = "✉️";
  let title = "メールを確認してください";
  let message = "登録したメールアドレスに確認メールを送信しました。\nメール内のリンクをクリックして認証を完了してください。";
  let isSuccess = false;
  let isError = false;

  if (success) {
    icon = "✅";
    title = "メール認証が完了しました";
    message = "アカウントが有効化されました。ログインしてご利用ください。";
    isSuccess = true;
  } else if (error === "expired") {
    icon = "⏰";
    title = "リンクの有効期限が切れています";
    message = "認証リンクの有効期限（24時間）が切れています。\n再度新規登録を行ってください。";
    isError = true;
  } else if (error === "invalid") {
    icon = "❌";
    title = "無効なリンクです";
    message = "認証リンクが無効です。\n再度新規登録を行ってください。";
    isError = true;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${isSuccess ? "rgba(52,211,153,0.2)" : isError ? "rgba(248,113,113,0.2)" : "rgba(255,255,255,0.1)"}`,
          borderRadius: "20px",
          padding: "2.5rem",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{icon}</div>
        <h1 style={{ color: "#e0e0f0", fontWeight: 700, fontSize: "1.3rem", marginBottom: "1rem" }}>
          {title}
        </h1>
        <p style={{ color: "#8888aa", fontSize: "0.9rem", lineHeight: 1.7, whiteSpace: "pre-line", marginBottom: "2rem" }}>
          {message}
        </p>

        {isSuccess && (
          <Link
            href="/login"
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "#fff",
              textDecoration: "none",
              padding: "0.7rem 2rem",
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: "0.95rem",
            }}
          >
            ログインする
          </Link>
        )}

        {isError && (
          <Link
            href="/register"
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "#fff",
              textDecoration: "none",
              padding: "0.7rem 2rem",
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: "0.95rem",
            }}
          >
            新規登録へ戻る
          </Link>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
