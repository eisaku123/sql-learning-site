export default function MaintenancePage() {
  return (
    <html lang="ja">
      <body style={{ margin: 0, background: "#0a0a1a", fontFamily: "system-ui, sans-serif" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "2rem",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "rgba(102,126,234,0.1)",
              border: "2px solid rgba(102,126,234,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              marginBottom: "2rem",
            }}
          >
            🔧
          </div>
          <h1
            style={{
              color: "#e0e0f0",
              fontSize: "1.8rem",
              fontWeight: 800,
              marginBottom: "1rem",
            }}
          >
            メンテナンス中
          </h1>
          <p
            style={{
              color: "#8888aa",
              fontSize: "1rem",
              lineHeight: 1.8,
              maxWidth: "400px",
            }}
          >
            現在、システムのメンテナンスを行っております。
            <br />
            しばらく時間をおいてから再度アクセスしてください。
          </p>
          <p style={{ color: "#546e7a", fontSize: "0.85rem", marginTop: "2rem" }}>SQLLearn</p>
        </div>
      </body>
    </html>
  );
}
