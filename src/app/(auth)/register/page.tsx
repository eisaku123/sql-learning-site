"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "登録に失敗しました");
        setLoading(false);
        return;
      }
      // 登録後、自動ログイン
      await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      router.push("/dashboard");
    } catch {
      setError("サーバーエラーが発生しました");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        background: "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(102,126,234,0.08) 0%, transparent 70%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "20px",
          padding: "2.5rem",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{ color: "#667eea", fontWeight: 700, fontSize: "1.3rem" }}>SQL</span>
            <span style={{ color: "#764ba2", fontWeight: 700, fontSize: "1.3rem" }}>Learn</span>
          </Link>
          <h1 style={{ color: "#e0e0f0", fontWeight: 700, fontSize: "1.5rem", marginTop: "1rem" }}>
            新規登録
          </h1>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ color: "#8888aa", fontSize: "0.85rem", display: "block", marginBottom: "0.4rem" }}>
              お名前（任意）
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="田中 太郎"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ color: "#8888aa", fontSize: "0.85rem", display: "block", marginBottom: "0.4rem" }}>
              メールアドレス
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              placeholder="example@email.com"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ color: "#8888aa", fontSize: "0.85rem", display: "block", marginBottom: "0.4rem" }}>
              パスワード（6文字以上）
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
              placeholder="••••••••"
              style={inputStyle}
            />
          </div>

          {error && (
            <div
              style={{
                background: "rgba(248,113,113,0.1)",
                border: "1px solid rgba(248,113,113,0.3)",
                borderRadius: "8px",
                padding: "0.6rem 0.8rem",
                color: "#f87171",
                fontSize: "0.85rem",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? "rgba(102,126,234,0.3)" : "linear-gradient(135deg, #667eea, #764ba2)",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              padding: "0.8rem",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: 700,
              fontSize: "0.95rem",
              marginTop: "0.5rem",
            }}
          >
            {loading ? "登録中..." : "アカウント作成"}
          </button>
        </form>

        <p style={{ textAlign: "center", color: "#8888aa", fontSize: "0.85rem", marginTop: "1.5rem" }}>
          すでにアカウントをお持ちの方は{" "}
          <Link href="/login" style={{ color: "#667eea", textDecoration: "none" }}>
            ログイン
          </Link>
        </p>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.7rem 0.9rem",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "8px",
  color: "#e0e0f0",
  fontSize: "0.9rem",
  outline: "none",
  boxSizing: "border-box",
};
