"use client";

import { useEffect, useState } from "react";

export default function AdminMaintenancePage() {
  const [enabled, setEnabled] = useState(false);
  const [premiumSignupEnabled, setPremiumSignupEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPremium, setSavingPremium] = useState(false);

  useEffect(() => {
    fetch("/api/admin/maintenance")
      .then((r) => r.json())
      .then((d) => {
        setEnabled(d.enabled);
        setPremiumSignupEnabled(d.premiumSignupEnabled);
        setLoading(false);
      });
  }, []);

  async function handleToggle() {
    setSaving(true);
    await fetch("/api/admin/maintenance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: !enabled }),
    });
    setEnabled((v) => !v);
    setSaving(false);
  }

  async function handlePremiumToggle() {
    setSavingPremium(true);
    await fetch("/api/admin/maintenance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ premiumSignupEnabled: !premiumSignupEnabled }),
    });
    setPremiumSignupEnabled((v) => !v);
    setSavingPremium(false);
  }

  return (
    <div>
      <h1 style={{ color: "#e0e0f0", fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.25rem" }}>
        メンテナンスモード
      </h1>
      <p style={{ color: "#8888aa", fontSize: "0.85rem", marginBottom: "2rem" }}>
        ONにすると一般ユーザーへのアクセスをブロックします
      </p>

      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "16px",
          padding: "2rem",
          maxWidth: "480px",
        }}
      >
        {loading ? (
          <p style={{ color: "#8888aa" }}>読み込み中...</p>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <div>
                <div style={{ color: "#e0e0f0", fontWeight: 600, marginBottom: "0.25rem" }}>
                  メンテナンスモード
                </div>
                <div style={{ color: "#8888aa", fontSize: "0.85rem" }}>
                  現在: {enabled ? (
                    <span style={{ color: "#f87171", fontWeight: 600 }}>ON（メンテナンス中）</span>
                  ) : (
                    <span style={{ color: "#34d399", fontWeight: 600 }}>OFF（通常公開中）</span>
                  )}
                </div>
              </div>
              <button
                onClick={handleToggle}
                disabled={saving}
                style={{
                  background: enabled
                    ? "rgba(248,113,113,0.15)"
                    : "linear-gradient(135deg, #667eea, #764ba2)",
                  border: enabled ? "1px solid rgba(248,113,113,0.4)" : "none",
                  borderRadius: "10px",
                  color: enabled ? "#f87171" : "#fff",
                  padding: "0.6rem 1.5rem",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.6 : 1,
                }}
              >
                {saving ? "処理中..." : enabled ? "OFFにする" : "ONにする"}
              </button>
            </div>

            <div
              style={{
                background: "rgba(102,126,234,0.06)",
                border: "1px solid rgba(102,126,234,0.2)",
                borderRadius: "10px",
                padding: "1rem",
                fontSize: "0.85rem",
                color: "#8888aa",
                lineHeight: 1.7,
                marginBottom: "1.5rem",
              }}
            >
              ⚠️ ONにすると、管理者以外の全ユーザーがメンテナンスページに自動リダイレクトされます。管理者は引き続きアクセス可能です。
            </div>

            {/* プレミアム申し込み制御 */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div>
                <div style={{ color: "#e0e0f0", fontWeight: 600, marginBottom: "0.25rem" }}>
                  プレミアム申し込み受付
                </div>
                <div style={{ color: "#8888aa", fontSize: "0.85rem" }}>
                  現在: {premiumSignupEnabled ? (
                    <span style={{ color: "#34d399", fontWeight: 600 }}>ON（受付中）</span>
                  ) : (
                    <span style={{ color: "#f87171", fontWeight: 600 }}>OFF（受付停止中）</span>
                  )}
                </div>
              </div>
              <button
                onClick={handlePremiumToggle}
                disabled={savingPremium}
                style={{
                  background: premiumSignupEnabled
                    ? "rgba(248,113,113,0.15)"
                    : "linear-gradient(135deg, #667eea, #764ba2)",
                  border: premiumSignupEnabled ? "1px solid rgba(248,113,113,0.4)" : "none",
                  borderRadius: "10px",
                  color: premiumSignupEnabled ? "#f87171" : "#fff",
                  padding: "0.6rem 1.5rem",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  cursor: savingPremium ? "not-allowed" : "pointer",
                  opacity: savingPremium ? 0.6 : 1,
                }}
              >
                {savingPremium ? "処理中..." : premiumSignupEnabled ? "OFFにする" : "ONにする"}
              </button>
            </div>
            <div
              style={{
                background: "rgba(102,126,234,0.06)",
                border: "1px solid rgba(102,126,234,0.2)",
                borderRadius: "10px",
                padding: "1rem",
                fontSize: "0.85rem",
                color: "#8888aa",
                lineHeight: 1.7,
              }}
            >
              ⚠️ OFFにすると、料金ページの申し込みボタンが無効になり、新規のプレミアム申し込みができなくなります。
            </div>
          </>
        )}
      </div>
    </div>
  );
}
