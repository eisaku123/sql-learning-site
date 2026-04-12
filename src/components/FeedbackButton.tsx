"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const CATEGORIES = [
  { value: "bug", label: "🐛 バグ報告" },
  { value: "request", label: "💡 機能要望" },
  { value: "other", label: "💬 その他" },
];

export default function FeedbackButton() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("other");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    fetch("/api/feedback/status")
      .then((r) => r.json())
      .then((d) => setVisible(d.enabled))
      .catch(() => {});
  }, []);

  if (!visible) return null;

  async function handleSubmit() {
    if (!message.trim()) return;
    setSending(true);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, message }),
      });
      setSent(true);
      setTimeout(() => {
        setOpen(false);
        setSent(false);
        setMessage("");
        setCategory("other");
      }, 2000);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {/* フローティングボタン */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          zIndex: 9000,
          background: "linear-gradient(135deg, #667eea, #764ba2)",
          border: "none",
          borderRadius: "50px",
          padding: "0.65rem 1.1rem",
          color: "#fff",
          fontSize: "0.85rem",
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(102,126,234,0.4)",
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
        }}
      >
        💬 ご意見
      </button>

      {/* モーダル */}
      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 9001,
            }}
          />
          <div
            style={{
              position: "fixed",
              bottom: "5rem",
              right: "1.5rem",
              zIndex: 9002,
              background: "linear-gradient(135deg, #0f0f2a, #1a1a3a)",
              border: "1px solid rgba(102,126,234,0.4)",
              borderRadius: "16px",
              padding: "1.5rem",
              width: "320px",
              boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
            }}
          >
            <h3 style={{ color: "#e0e0f0", fontWeight: 700, fontSize: "1rem", marginBottom: "1rem" }}>
              💬 ご意見・ご要望
            </h3>

            {sent ? (
              <div style={{ textAlign: "center", padding: "1.5rem 0", color: "#34d399", fontWeight: 700 }}>
                ✅ 送信しました！ありがとうございました。
              </div>
            ) : (
              <>
                {/* カテゴリ */}
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setCategory(c.value)}
                      style={{
                        padding: "0.3rem 0.75rem",
                        borderRadius: "20px",
                        border: `1px solid ${category === c.value ? "#667eea" : "rgba(255,255,255,0.15)"}`,
                        background: category === c.value ? "rgba(102,126,234,0.2)" : "transparent",
                        color: category === c.value ? "#667eea" : "#8888aa",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>

                        {/* ゲスト注記 */}
                {!isLoggedIn && (
                  <p style={{ color: "#546e7a", fontSize: "0.75rem", marginBottom: "0.5rem", lineHeight: 1.5 }}>
                    ※ ログインなしでも送信できますが、返信を受け取るには<br />アカウント登録が必要です。
                  </p>
                )}

                {/* テキスト */}
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="ご意見・ご要望をお聞かせください"
                  rows={4}
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    padding: "0.6rem 0.75rem",
                    color: "#e0e0f0",
                    fontSize: "0.85rem",
                    resize: "none",
                    outline: "none",
                    boxSizing: "border-box",
                    marginBottom: "0.75rem",
                    fontFamily: "inherit",
                  }}
                />

                <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                  <button
                    onClick={() => setOpen(false)}
                    style={{
                      background: "transparent",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: "8px",
                      padding: "0.5rem 1rem",
                      color: "#8888aa",
                      fontSize: "0.82rem",
                      cursor: "pointer",
                    }}
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={sending || !message.trim()}
                    style={{
                      background: "linear-gradient(135deg, #667eea, #764ba2)",
                      border: "none",
                      borderRadius: "8px",
                      padding: "0.5rem 1.25rem",
                      color: "#fff",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      cursor: sending || !message.trim() ? "not-allowed" : "pointer",
                      opacity: sending || !message.trim() ? 0.6 : 1,
                    }}
                  >
                    {sending ? "送信中..." : "送信"}
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
