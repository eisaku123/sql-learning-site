"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type Message = { id: string; body: string; isAdmin: boolean; createdAt: string };
type Feedback = {
  id: string;
  category: string;
  message: string;
  userEmail: string | null;
  userId: string | null;
  createdAt: string;
  messages: Message[];
};

const CATEGORY_LABELS: Record<string, string> = {
  bug: "🐛 バグ報告",
  request: "💡 機能要望",
  other: "💬 その他",
};

export default function AdminFeedbackThreadPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchThread = async (silent = false) => {
    const r = await fetch(`/api/admin/feedback/${id}`);
    if (r.status === 401) { router.push("/admin/login"); return; }
    const d = await r.json();
    if (!d) return;
    setFeedback((prev) => {
      if (!prev) return d;
      // メッセージ数が増えた場合のみ更新（入力中のテキストを守る）
      if (d.messages.length !== prev.messages.length) return d;
      return silent ? prev : d;
    });
  };

  useEffect(() => {
    fetchThread();
    const timer = setInterval(() => fetchThread(true), 4000);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [feedback?.messages]);

  async function handleSend() {
    if (!body.trim() || sending) return;
    setSending(true);
    const res = await fetch(`/api/admin/feedback/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    if (res.ok) {
      const msg = await res.json();
      setFeedback((prev) => prev ? { ...prev, messages: [...prev.messages, msg] } : prev);
      setBody("");
    }
    setSending(false);
  }

  if (!feedback) return <div style={{ padding: "2rem", color: "#8888aa" }}>読み込み中...</div>;

  return (
    <div style={{ maxWidth: "680px", display: "flex", flexDirection: "column", height: "calc(100vh - 4rem)" }}>
      {/* ヘッダー */}
      <div style={{ marginBottom: "1.25rem" }}>
        <Link href="/admin/feedback" style={{ color: "#667eea", fontSize: "0.85rem", textDecoration: "none" }}>
          ← ご意見箱一覧
        </Link>
        <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <span style={{
            background: "rgba(102,126,234,0.15)", color: "#a78bfa",
            borderRadius: "20px", padding: "0.2rem 0.75rem", fontSize: "0.78rem", fontWeight: 700,
          }}>
            {CATEGORY_LABELS[feedback.category] ?? feedback.category}
          </span>
          <span style={{ color: "#8888aa", fontSize: "0.8rem" }}>
            {feedback.userEmail ?? "ゲスト"} ·{" "}
            {new Date(feedback.createdAt).toLocaleString("ja-JP", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </div>

      {/* チャット */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        paddingBottom: "1rem",
      }}>
        {/* 最初のメッセージ（ユーザー投稿） */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{
            maxWidth: "75%",
            background: "rgba(102,126,234,0.15)",
            border: "1px solid rgba(102,126,234,0.25)",
            borderRadius: "16px 16px 4px 16px",
            padding: "0.75rem 1rem",
          }}>
            <p style={{ color: "#e0e0f0", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>{feedback.message}</p>
            <p style={{ color: "#546e7a", fontSize: "0.72rem", marginTop: "0.4rem", textAlign: "right" }}>
              {new Date(feedback.createdAt).toLocaleString("ja-JP", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>

        {/* 追加メッセージ */}
        {feedback.messages.map((msg) => (
          <div key={msg.id} style={{ display: "flex", justifyContent: msg.isAdmin ? "flex-start" : "flex-end" }}>
            <div style={{
              maxWidth: "75%",
              background: msg.isAdmin ? "rgba(52,211,153,0.1)" : "rgba(102,126,234,0.15)",
              border: `1px solid ${msg.isAdmin ? "rgba(52,211,153,0.25)" : "rgba(102,126,234,0.25)"}`,
              borderRadius: msg.isAdmin ? "16px 16px 16px 4px" : "16px 16px 4px 16px",
              padding: "0.75rem 1rem",
            }}>
              {msg.isAdmin && (
                <p style={{ color: "#34d399", fontSize: "0.72rem", fontWeight: 700, marginBottom: "0.3rem" }}>管理者</p>
              )}
              <p style={{ color: "#e0e0f0", fontSize: "0.9rem", lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap" }}>{msg.body}</p>
              <p style={{ color: "#546e7a", fontSize: "0.72rem", marginTop: "0.4rem", textAlign: msg.isAdmin ? "left" : "right" }}>
                {new Date(msg.createdAt).toLocaleString("ja-JP", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* 返信入力（ゲストには返信不可） */}
      {!feedback.userId ? (
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "12px",
          padding: "0.75rem 1rem",
          color: "#546e7a",
          fontSize: "0.82rem",
          textAlign: "center",
        }}>
          ゲスト投稿のため返信できません
        </div>
      ) : (
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end" }}>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSend(); }}
            placeholder="返信を入力... (Ctrl+Enter で送信)"
            rows={3}
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              padding: "0.65rem 0.85rem",
              color: "#e0e0f0",
              fontSize: "0.88rem",
              resize: "none",
              outline: "none",
              fontFamily: "inherit",
            }}
          />
          <button
            onClick={handleSend}
            disabled={sending || !body.trim()}
            style={{
              background: sending || !body.trim() ? "rgba(102,126,234,0.2)" : "linear-gradient(135deg, #667eea, #764ba2)",
              border: "none",
              borderRadius: "10px",
              padding: "0.65rem 1.25rem",
              color: sending || !body.trim() ? "#546e7a" : "#fff",
              fontWeight: 700,
              fontSize: "0.88rem",
              cursor: sending || !body.trim() ? "not-allowed" : "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {sending ? "送信中..." : "送信"}
          </button>
        </div>
      )}
    </div>
  );
}
