"use client";

import { useEffect, useState } from "react";

type Feedback = {
  id: string;
  category: string;
  message: string;
  userEmail: string | null;
  isRead: boolean;
  createdAt: string;
};

const CATEGORY_LABELS: Record<string, string> = {
  bug: "🐛 バグ報告",
  request: "💡 機能要望",
  other: "💬 その他",
};

const CATEGORY_COLORS: Record<string, string> = {
  bug: "#f87171",
  request: "#34d399",
  other: "#a78bfa",
};

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [buttonEnabled, setButtonEnabled] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "bug" | "request" | "other">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/feedback")
      .then((r) => r.json())
      .then((d) => {
        setFeedbacks(d.feedbacks ?? []);
        setButtonEnabled(d.buttonEnabled);
        setLoading(false);
      });
  }, []);

  async function toggleButton() {
    const next = !buttonEnabled;
    setButtonEnabled(next);
    await fetch("/api/admin/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ buttonEnabled: next }),
    });
  }

  async function toggleRead(id: string, isRead: boolean) {
    setFeedbacks((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isRead: !isRead } : f))
    );
    await fetch("/api/admin/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isRead: !isRead }),
    });
  }

  const filtered = feedbacks.filter((f) => {
    if (filter === "unread") return !f.isRead;
    if (filter === "bug" || filter === "request" || filter === "other") return f.category === filter;
    return true;
  });

  const unreadCount = feedbacks.filter((f) => !f.isRead).length;

  const cell: React.CSSProperties = {
    padding: "0.75rem 1rem",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    color: "#c0c0d8",
    fontSize: "0.875rem",
    verticalAlign: "top",
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1000px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ color: "#e0e0f0", fontWeight: 700, fontSize: "1.4rem", marginBottom: "0.25rem" }}>
            💬 ご意見箱
          </h1>
          <p style={{ color: "#8888aa", fontSize: "0.85rem" }}>
            {unreadCount > 0 ? `未読 ${unreadCount} 件` : "未読なし"} / 合計 {feedbacks.length} 件
          </p>
        </div>

        {/* ボタン表示ON/OFF */}
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            padding: "1rem 1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div>
            <p style={{ color: "#e0e0f0", fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.2rem" }}>
              「ご意見」ボタン
            </p>
            <p style={{ color: "#8888aa", fontSize: "0.78rem" }}>
              サイト上の表示を制御
            </p>
          </div>
          <button
            onClick={toggleButton}
            style={{
              width: "52px",
              height: "28px",
              borderRadius: "14px",
              border: "none",
              background: buttonEnabled ? "#667eea" : "rgba(255,255,255,0.15)",
              cursor: "pointer",
              position: "relative",
              transition: "background 0.2s",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                position: "absolute",
                top: "3px",
                left: buttonEnabled ? "27px" : "3px",
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                background: "#fff",
                transition: "left 0.2s",
              }}
            />
          </button>
        </div>
      </div>

      {/* フィルター */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        {(["all", "unread", "bug", "request", "other"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "0.3rem 0.85rem",
              borderRadius: "20px",
              border: `1px solid ${filter === f ? "#667eea" : "rgba(255,255,255,0.12)"}`,
              background: filter === f ? "rgba(102,126,234,0.2)" : "transparent",
              color: filter === f ? "#667eea" : "#8888aa",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {f === "all" ? "すべて" : f === "unread" ? `未読 (${unreadCount})` : CATEGORY_LABELS[f]}
          </button>
        ))}
      </div>

      {/* テーブル */}
      {loading ? (
        <p style={{ color: "#8888aa" }}>読み込み中...</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: "#8888aa" }}>データなし</p>
      ) : (
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["カテゴリ", "メッセージ", "ユーザー", "日時", "既読"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "0.65rem 1rem",
                      textAlign: "left",
                      color: "#8888aa",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      borderBottom: "1px solid rgba(255,255,255,0.08)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
                <tr
                  key={f.id}
                  style={{ background: f.isRead ? "transparent" : "rgba(102,126,234,0.04)" }}
                >
                  <td style={cell}>
                    <span
                      style={{
                        background: `${CATEGORY_COLORS[f.category] ?? "#a78bfa"}22`,
                        color: CATEGORY_COLORS[f.category] ?? "#a78bfa",
                        borderRadius: "20px",
                        padding: "0.2rem 0.6rem",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {CATEGORY_LABELS[f.category] ?? f.category}
                    </span>
                  </td>
                  <td style={{ ...cell, maxWidth: "340px" }}>
                    <span style={{ color: f.isRead ? "#8888aa" : "#e0e0f0" }}>
                      {f.message}
                    </span>
                  </td>
                  <td style={{ ...cell, whiteSpace: "nowrap" }}>
                    {f.userEmail ?? <span style={{ color: "#546e7a" }}>ゲスト</span>}
                  </td>
                  <td style={{ ...cell, whiteSpace: "nowrap", color: "#8888aa" }}>
                    {new Date(f.createdAt).toLocaleString("ja-JP", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td style={{ ...cell, textAlign: "center" }}>
                    <button
                      onClick={() => toggleRead(f.id, f.isRead)}
                      style={{
                        background: f.isRead ? "rgba(255,255,255,0.06)" : "rgba(102,126,234,0.15)",
                        border: `1px solid ${f.isRead ? "rgba(255,255,255,0.1)" : "rgba(102,126,234,0.3)"}`,
                        borderRadius: "6px",
                        padding: "0.25rem 0.6rem",
                        color: f.isRead ? "#546e7a" : "#667eea",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      {f.isRead ? "未読に戻す" : "既読"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
