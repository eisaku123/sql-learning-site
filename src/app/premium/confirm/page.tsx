"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// カード入力フォーム
function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    setError(null);

    const { error } = await stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/premium/success`,
      },
    });

    if (error) {
      setError(error.message ?? "支払いに失敗しました。もう一度お試しください。");
      setLoading(false);
    }
    // 成功時はreturn_urlにリダイレクトされるのでsetLoadingは不要
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "12px",
          padding: "1.25rem",
        }}
      >
        <PaymentElement
          options={{
            layout: "tabs",
            wallets: { link: "never" },
          }}
        />
      </div>

      {error && (
        <div
          style={{
            background: "rgba(248,113,113,0.1)",
            border: "1px solid rgba(248,113,113,0.3)",
            borderRadius: "8px",
            padding: "0.75rem 1rem",
            color: "#f87171",
            fontSize: "0.85rem",
          }}
        >
          {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!stripe || !elements || loading}
        style={{
          width: "100%",
          background:
            !stripe || !elements || loading
              ? "rgba(255,255,255,0.06)"
              : "linear-gradient(135deg, #667eea, #764ba2)",
          border: "none",
          borderRadius: "12px",
          color: !stripe || !elements || loading ? "#546e7a" : "#fff",
          padding: "1rem",
          fontWeight: 700,
          fontSize: "1rem",
          cursor: !stripe || !elements || loading ? "not-allowed" : "pointer",
          transition: "all 0.2s",
        }}
      >
        {loading ? "処理中..." : "決済を完了する →"}
      </button>

      <p style={{ color: "#546e7a", fontSize: "0.78rem", textAlign: "center" }}>
        🔒 Stripeの安全な暗号化通信で保護されています
      </p>
    </div>
  );
}

export default function PremiumConfirmPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [step, setStep] = useState<"confirm" | "payment">("confirm");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [setupError, setSetupError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/premium/confirm");
    }
  }, [status, router]);

  const handleProceedToPayment = useCallback(async () => {
    if (!agreed) return;
    setLoadingPayment(true);
    setSetupError(null);
    try {
      const res = await fetch("/api/stripe/create-setup-intent", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === "ALREADY_SUBSCRIBED") {
          router.push("/premium/lessons");
          return;
        }
        setSetupError(data.error ?? "エラーが発生しました");
        return;
      }
      setClientSecret(data.clientSecret);
      setStep("payment");
    } catch {
      setSetupError("通信エラーが発生しました。もう一度お試しください。");
    } finally {
      setLoadingPayment(false);
    }
  }, [agreed]);

  if (status === "loading") {
    return (
      <>
        <Header />
        <main style={{ paddingTop: "80px", textAlign: "center", padding: "80px 2rem" }}>
          <p style={{ color: "#8888aa" }}>読み込み中...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main style={{ paddingTop: "60px", minHeight: "100vh" }}>
        <div style={{ maxWidth: "540px", margin: "0 auto", padding: "4rem 2rem" }}>

          {/* 戻るリンク */}
          <div style={{ marginBottom: "1.5rem" }}>
            {step === "confirm" ? (
              <Link href="/pricing" style={{ color: "#8888aa", textDecoration: "none", fontSize: "0.85rem" }}>
                ← 料金プランへ戻る
              </Link>
            ) : (
              <button
                onClick={() => setStep("confirm")}
                style={{ background: "none", border: "none", color: "#8888aa", fontSize: "0.85rem", cursor: "pointer", padding: 0 }}
              >
                ← 確認画面へ戻る
              </button>
            )}
          </div>

          {/* ステップインジケーター */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem" }}>
            <StepBadge num={1} label="内容確認" active={step === "confirm"} done={step === "payment"} />
            <div style={{ flex: 1, height: "1px", background: step === "payment" ? "#667eea" : "rgba(255,255,255,0.1)" }} />
            <StepBadge num={2} label="カード入力" active={step === "payment"} done={false} />
          </div>

          {step === "confirm" ? (
            <>
              <h1 style={{ color: "#e0e0f0", fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>
                お申し込み内容の確認
              </h1>
              <p style={{ color: "#8888aa", fontSize: "0.9rem", marginBottom: "1.75rem" }}>
                以下の内容をご確認のうえ、同意してお進みください。
              </p>

              {/* 購入内容 */}
              <div
                style={{
                  background: "rgba(102,126,234,0.06)",
                  border: "1px solid rgba(102,126,234,0.25)",
                  borderRadius: "16px",
                  padding: "1.5rem",
                  marginBottom: "1.25rem",
                }}
              >
                <div style={{ color: "#8888aa", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.08em", marginBottom: "1rem" }}>
                  購入内容
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <span style={{ color: "#e0e0f0", fontWeight: 600 }}>プレミアムプラン</span>
                  <span style={{ color: "#e0e0f0", fontWeight: 700, fontSize: "1.2rem" }}>¥100 / 月</span>
                </div>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {[
                    "プレミアム初級コース 10レッスン（50問）",
                    "プレミアム中級コース 10レッスン（50問）",
                    "毎月自動更新・いつでもキャンセル可能",
                  ].map((item) => (
                    <div key={item} style={{ display: "flex", gap: "0.6rem", color: "#8888aa", fontSize: "0.84rem" }}>
                      <span style={{ color: "#667eea", flexShrink: 0 }}>✓</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* お申込者 */}
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  padding: "1rem 1.25rem",
                  marginBottom: "1.25rem",
                }}
              >
                <div style={{ color: "#8888aa", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
                  お申込者
                </div>
                <div style={{ color: "#e0e0f0", fontSize: "0.9rem" }}>{session?.user?.name ?? session?.user?.email}</div>
                {session?.user?.name && (
                  <div style={{ color: "#546e7a", fontSize: "0.8rem", marginTop: "0.15rem" }}>{session.user.email}</div>
                )}
              </div>

              {/* 重要事項 */}
              <div
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "12px",
                  padding: "1.25rem 1.5rem",
                  marginBottom: "1.25rem",
                  fontSize: "0.82rem",
                  color: "#8888aa",
                  lineHeight: 1.8,
                }}
              >
                <div style={{ color: "#c0c0d8", fontWeight: 600, marginBottom: "0.5rem" }}>重要事項</div>
                <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
                  <li>月額100円（税込）が毎月自動で請求されます。</li>
                  <li>クレジットカード・デビットカードでお支払いいただけます。</li>
                  <li>解約はダッシュボードからいつでも可能です。</li>
                  <li>解約後も当月末まで引き続きご利用いただけます。</li>
                  <li>
                    詳細は{" "}
                    <Link href="/tokutei" target="_blank" style={{ color: "#667eea" }}>
                      特定商取引法に基づく表示
                    </Link>
                    {" "}をご確認ください。
                  </li>
                </ul>
              </div>

              {/* 同意チェック */}
              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.75rem",
                  cursor: "pointer",
                  marginBottom: "1.5rem",
                  padding: "1rem 1.25rem",
                  background: agreed ? "rgba(52,211,153,0.05)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${agreed ? "rgba(52,211,153,0.3)" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: "10px",
                  transition: "all 0.2s",
                }}
              >
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  style={{ width: "18px", height: "18px", marginTop: "1px", accentColor: "#34d399", flexShrink: 0, cursor: "pointer" }}
                />
                <span style={{ color: "#c0c0d8", fontSize: "0.87rem", lineHeight: 1.6 }}>
                  上記の重要事項および{" "}
                  <Link href="/tokutei" target="_blank" style={{ color: "#667eea" }}>
                    特定商取引法に基づく表示
                  </Link>
                  {" "}を確認し、プレミアムプランの申し込みに同意します。
                </span>
              </label>

              {setupError && (
                <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: "8px", padding: "0.75rem 1rem", color: "#f87171", fontSize: "0.85rem", marginBottom: "1rem" }}>
                  {setupError}
                </div>
              )}

              <button
                onClick={handleProceedToPayment}
                disabled={!agreed || loadingPayment}
                style={{
                  width: "100%",
                  background: agreed && !loadingPayment ? "linear-gradient(135deg, #667eea, #764ba2)" : "rgba(255,255,255,0.06)",
                  border: agreed && !loadingPayment ? "none" : "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: agreed && !loadingPayment ? "#fff" : "#546e7a",
                  padding: "1rem",
                  fontWeight: 700,
                  fontSize: "1rem",
                  cursor: agreed && !loadingPayment ? "pointer" : "not-allowed",
                  transition: "all 0.2s",
                }}
              >
                {loadingPayment ? "準備中..." : "カード情報の入力へ →"}
              </button>
            </>
          ) : (
            <>
              <h1 style={{ color: "#e0e0f0", fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>
                お支払い情報の入力
              </h1>
              <p style={{ color: "#8888aa", fontSize: "0.9rem", marginBottom: "1.75rem" }}>
                カード情報を入力して決済を完了してください。
              </p>

              {/* 金額確認 */}
              <div
                style={{
                  background: "rgba(102,126,234,0.06)",
                  border: "1px solid rgba(102,126,234,0.2)",
                  borderRadius: "10px",
                  padding: "0.85rem 1.25rem",
                  marginBottom: "1.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ color: "#8888aa", fontSize: "0.9rem" }}>プレミアムプラン（月額）</span>
                <span style={{ color: "#e0e0f0", fontWeight: 700 }}>¥100</span>
              </div>

              {clientSecret && (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: "night",
                      variables: {
                        colorPrimary: "#667eea",
                        colorBackground: "#0f0f23",
                        colorText: "#e0e0f0",
                        colorDanger: "#f87171",
                        fontFamily: "system-ui, sans-serif",
                        borderRadius: "8px",
                      },
                    },
                  }}
                >
                  <PaymentForm />
                </Elements>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}

function StepBadge({ num, label, active, done }: { num: number; label: string; active: boolean; done: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
      <div
        style={{
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          background: done ? "#34d399" : active ? "linear-gradient(135deg, #667eea, #764ba2)" : "rgba(255,255,255,0.08)",
          border: active ? "none" : done ? "none" : "1px solid rgba(255,255,255,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.75rem",
          fontWeight: 700,
          color: active || done ? "#fff" : "#546e7a",
          flexShrink: 0,
        }}
      >
        {done ? "✓" : num}
      </div>
      <span style={{ fontSize: "0.8rem", color: active ? "#e0e0f0" : "#546e7a", whiteSpace: "nowrap" }}>
        {label}
      </span>
    </div>
  );
}
