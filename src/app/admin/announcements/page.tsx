"use client";

import { useEffect, useState } from "react";

type Announcement = {
  id: string;
  title: string;
  content: string;
  isPublished: boolean;
  createdAt: string;
};

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [form, setForm] = useState({ title: "", content: "", isPublished: false });
  const [saving, setSaving] = useState(false);

  async function fetchAll() {
    const r = await fetch("/api/admin/announcements");
    const data = await r.json();
    setAnnouncements(data);
    setLoading(false);
  }

  useEffect(() => { fetchAll(); }, []);

  function startNew() {
    setEditing(null);
    setForm({ title: "", content: "", isPublished: false });
    setShowForm(true);
  }

  function startEdit(a: Announcement) {
    setEditing(a);
    setForm({ title: a.title, content: a.content, isPublished: a.isPublished });
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    if (editing) {
      await fetch("/api/admin/announcements", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editing.id, ...form }),
      });
    } else {
      await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    await fetchAll();
    setEditing(null);
    setForm({ title: "", content: "", isPublished: false });
    setShowForm(false);
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("削除しますか？")) return;
    await fetch("/api/admin/announcements", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await fetchAll();
  }

  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    padding: "0.7rem 1rem",
    color: "#e0e0f0",
    fontSize: "0.9rem",
    outline: "none",
    boxSizing: "border-box" as const,
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ color: "#e0e0f0", fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.25rem" }}>
            お知らせ管理
          </h1>
          <p style={{ color: "#8888aa", fontSize: "0.85rem" }}>トップページに表示するお知らせを管理します</p>
        </div>
        <button
          onClick={startNew}
          style={{
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            border: "none",
            borderRadius: "10px",
            color: "#fff",
            padding: "0.6rem 1.25rem",
            fontWeight: 700,
            fontSize: "0.88rem",
            cursor: "pointer",
          }}
        >
          + 新規作成
        </button>
      </div>

      {/* フォーム */}
      {showForm ? (
        <div
          style={{
            background: "rgba(102,126,234,0.06)",
            border: "1px solid rgba(102,126,234,0.2)",
            borderRadius: "16px",
            padding: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <h2 style={{ color: "#e0e0f0", fontSize: "1rem", fontWeight: 600, marginBottom: "1rem" }}>
            {editing ? "編集" : "新規作成"}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ color: "#8888aa", fontSize: "0.82rem", display: "block", marginBottom: "0.4rem" }}>タイトル</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                style={inputStyle}
                placeholder="お知らせのタイトル"
              />
            </div>
            <div>
              <label style={{ color: "#8888aa", fontSize: "0.82rem", display: "block", marginBottom: "0.4rem" }}>内容</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                rows={4}
                style={{ ...inputStyle, resize: "vertical" }}
                placeholder="お知らせの内容"
              />
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
              />
              <span style={{ color: "#c0c0d8", fontSize: "0.88rem" }}>公開する（トップページに表示）</span>
            </label>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={handleSave}
                disabled={saving || !form.title}
                style={{
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                  padding: "0.6rem 1.5rem",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? "保存中..." : "保存"}
              </button>
              <button
                onClick={() => { setEditing(null); setForm({ title: "", content: "", isPublished: false }); setShowForm(false); }}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "#8888aa",
                  padding: "0.6rem 1.25rem",
                  cursor: "pointer",
                  fontSize: "0.88rem",
                }}
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* 一覧 */}
      {loading ? (
        <p style={{ color: "#8888aa" }}>読み込み中...</p>
      ) : announcements.length === 0 ? (
        <p style={{ color: "#8888aa" }}>お知らせはありません</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {announcements.map((a) => (
            <div
              key={a.id}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "12px",
                padding: "1.25rem 1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.25rem" }}>
                  <span style={{ color: "#e0e0f0", fontWeight: 600, fontSize: "0.95rem" }}>{a.title}</span>
                  <span
                    style={{
                      background: a.isPublished ? "rgba(52,211,153,0.1)" : "rgba(255,255,255,0.05)",
                      border: `1px solid ${a.isPublished ? "rgba(52,211,153,0.3)" : "rgba(255,255,255,0.1)"}`,
                      borderRadius: "20px",
                      padding: "0.1rem 0.5rem",
                      color: a.isPublished ? "#34d399" : "#8888aa",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                    }}
                  >
                    {a.isPublished ? "公開中" : "非公開"}
                  </span>
                </div>
                <div style={{ color: "#8888aa", fontSize: "0.82rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {a.content}
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                <button
                  onClick={() => startEdit(a)}
                  style={{
                    background: "rgba(102,126,234,0.1)",
                    border: "1px solid rgba(102,126,234,0.3)",
                    borderRadius: "8px",
                    color: "#667eea",
                    padding: "0.4rem 0.85rem",
                    fontSize: "0.82rem",
                    cursor: "pointer",
                  }}
                >
                  編集
                </button>
                <button
                  onClick={() => handleDelete(a.id)}
                  style={{
                    background: "rgba(248,113,113,0.1)",
                    border: "1px solid rgba(248,113,113,0.3)",
                    borderRadius: "8px",
                    color: "#f87171",
                    padding: "0.4rem 0.85rem",
                    fontSize: "0.82rem",
                    cursor: "pointer",
                  }}
                >
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
