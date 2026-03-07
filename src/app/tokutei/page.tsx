import Header from "@/components/Header";

export default function TokuteiPage() {
  const items = [
    { label: "販売業者", value: "毛受英策" },
    { label: "所在地", value: "愛知県知立市堀切2丁目 アンセム102" },
    {
      label: "電話番号",
      value: "※お問い合わせはメールにてお願いします（公開していません）",
    },
    {
      label: "メールアドレス",
      value: "eisaku546@gmail.com",
    },
    { label: "販売価格", value: "月額100円（税込）" },
    { label: "支払い方法", value: "クレジットカード（Stripe決済）" },
    {
      label: "支払い時期",
      value:
        "お申し込み時に初回課金が発生し、以降毎月同日に自動更新・課金されます。",
    },
    {
      label: "サービス提供時期",
      value: "決済完了後、即時にプレミアムコンテンツをご利用いただけます。",
    },
    {
      label: "返品・キャンセルについて",
      value:
        "マイページまたはStripe管理画面からいつでもサブスクリプションをキャンセルできます。キャンセル後は次回更新日まで引き続きご利用いただけます。サービスの性質上、既にお支払いいただいた料金の返金は対応しておりません。",
    },
    {
      label: "動作環境",
      value:
        "インターネット接続環境および最新のWebブラウザ（Chrome、Firefox、Safari、Edge等）が必要です。",
    },
  ];

  return (
    <>
      <Header />
      <main style={{ paddingTop: "60px", minHeight: "100vh" }}>
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            padding: "4rem 2rem",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              fontWeight: 700,
              color: "#e0e0f0",
              marginBottom: "0.5rem",
            }}
          >
            特定商取引法に基づく表記
          </h1>
          <div
            style={{
              width: "60px",
              height: "3px",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              borderRadius: "2px",
              marginBottom: "2.5rem",
            }}
          />

          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            {items.map((item, i) => (
              <div
                key={item.label}
                style={{
                  display: "grid",
                  gridTemplateColumns: "200px 1fr",
                  borderBottom:
                    i < items.length - 1
                      ? "1px solid rgba(255,255,255,0.06)"
                      : "none",
                }}
              >
                <div
                  style={{
                    padding: "1.25rem 1.5rem",
                    background: "rgba(102,126,234,0.06)",
                    color: "#8888aa",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    borderRight: "1px solid rgba(255,255,255,0.06)",
                    display: "flex",
                    alignItems: "flex-start",
                    paddingTop: "1.25rem",
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    padding: "1.25rem 1.5rem",
                    color: "#e0e0f0",
                    fontSize: "0.9rem",
                    lineHeight: 1.7,
                  }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          <p
            style={{
              color: "#8888aa",
              fontSize: "0.82rem",
              marginTop: "2rem",
              lineHeight: 1.7,
            }}
          >
            ご不明な点はメールにてお問い合わせください：
            <a
              href="mailto:eisaku546@gmail.com"
              style={{ color: "#667eea", textDecoration: "none" }}
            >
              eisaku546@gmail.com
            </a>
          </p>
        </div>
      </main>
    </>
  );
}
