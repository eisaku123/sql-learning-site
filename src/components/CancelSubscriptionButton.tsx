"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingButton from "@/components/LoadingButton";

export default function CancelSubscriptionButton({
  periodEnd,
  alreadyCanceling = false,
}: {
  periodEnd: Date;
  alreadyCanceling?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(alreadyCanceling);
  const [confirm, setConfirm] = useState(false);
  const router = useRouter();

  const periodEndStr = new Date(periodEnd).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  async function handleCancel() {
    setLoading(true);
    const res = await fetch("/api/stripe/cancel", { method: "POST" });
    setLoading(false);
    if (res.ok) {
      setDone(true);
      router.refresh();
    } else {
      alert("エラーが発生しました。もう一度お試しください。");
    }
  }

  if (done) {
    return (
      <div
        style={{
          background: "rgba(255,100,100,0.08)",
          border: "1px solid rgba(255,100,100,0.2)",
          borderRadius: "12px",
          padding: "1rem 1.5rem",
          color: "#ff8888",
          fontSize: "0.88rem",
          lineHeight: 1.7,
        }}
      >
        解約手続きが完了しました。{periodEndStr}まで引き続きご利用いただけます。
      </div>
    );
  }

  if (confirm) {
    return (
      <div
        style={{
          background: "rgba(255,100,100,0.06)",
          border: "1px solid rgba(255,100,100,0.2)",
          borderRadius: "12px",
          padding: "1.25rem 1.5rem",
        }}
      >
        <p
          style={{
            color: "#e0e0f0",
            fontSize: "0.9rem",
            marginBottom: "1rem",
            lineHeight: 1.7,
          }}
        >
          本当に解約しますか？{periodEndStr}まで使えますが、以降は更新されません。
        </p>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <LoadingButton
            onClick={handleCancel}
            loading={loading}
            loadingText="処理中..."
            style={{
              background: "rgba(255,80,80,0.2)",
              border: "1px solid rgba(255,80,80,0.4)",
              borderRadius: "8px",
              color: "#ff8888",
              padding: "0.5rem 1.25rem",
              fontSize: "0.88rem",
              fontWeight: 600,
            }}
          >
            解約する
          </LoadingButton>
          <button
            onClick={() => setConfirm(false)}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "8px",
              color: "#8888aa",
              padding: "0.5rem 1.25rem",
              cursor: "pointer",
              fontSize: "0.88rem",
            }}
          >
            キャンセル
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      style={{
        background: "none",
        border: "none",
        color: "#8888aa",
        fontSize: "0.82rem",
        cursor: "pointer",
        textDecoration: "underline",
        padding: 0,
      }}
    >
      プランを解約する
    </button>
  );
}
