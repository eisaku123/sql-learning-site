import { Resend } from "resend";

export async function sendVerificationEmail(email: string, token: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const baseUrl = process.env.NEXTAUTH_URL ?? "https://www.sql-learning.net";
  const verifyUrl = `${baseUrl}/api/auth/verify-email?token=${token}`;

  await resend.emails.send({
    from: "SQLLearn <noreply@sql-learning.net>",
    to: email,
    subject: "【SQLLearn】メールアドレスの確認",
    html: `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#0a0a1a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">

    <div style="text-align:center;margin-bottom:32px;">
      <span style="font-size:1.4rem;font-weight:800;">
        <span style="color:#667eea;">SQL</span><span style="color:#764ba2;">Learn</span>
      </span>
    </div>

    <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:32px;">
      <div style="text-align:center;margin-bottom:24px;">
        <div style="display:inline-block;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:50%;width:56px;height:56px;line-height:56px;font-size:1.6rem;text-align:center;">
          ✉
        </div>
      </div>

      <h1 style="color:#e0e0f0;font-size:1.25rem;font-weight:700;text-align:center;margin:0 0 8px;">
        メールアドレスの確認
      </h1>
      <p style="color:#8888aa;text-align:center;font-size:0.88rem;margin:0 0 28px;">
        SQLLearnへのご登録ありがとうございます。<br>
        以下のボタンをクリックして認証を完了してください。
      </p>

      <div style="text-align:center;margin-bottom:24px;">
        <a href="${verifyUrl}"
           style="display:inline-block;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;text-decoration:none;padding:12px 32px;border-radius:50px;font-weight:700;font-size:0.95rem;">
          メールアドレスを確認する
        </a>
      </div>

      <p style="color:#8888aa;font-size:0.8rem;line-height:1.7;margin:0;text-align:center;">
        このリンクの有効期限は <strong style="color:#e0e0f0;">24時間</strong> です。<br>
        心当たりがない場合はこのメールを無視してください。
      </p>
    </div>

    <div style="text-align:center;margin-top:24px;">
      <p style="color:#546e7a;font-size:0.75rem;line-height:1.7;margin:0;">
        このメールはSQLLearnからの自動送信です。<br>
        ご不明な点は <a href="mailto:eisaku546@gmail.com" style="color:#667eea;">eisaku546@gmail.com</a> までご連絡ください。
      </p>
    </div>

  </div>
</body>
</html>
    `.trim(),
  });
}

export async function sendPremiumWelcomeEmail({
  to,
  name,
  currentPeriodEnd,
}: {
  to: string;
  name?: string | null;
  currentPeriodEnd: Date;
}) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const periodEndStr = currentPeriodEnd.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const displayName = name ?? "お客様";

  await resend.emails.send({
    from: "SQLLearn <noreply@sql-learning.net>",
    to,
    subject: "【SQLLearn】プレミアムプランへのご登録ありがとうございます",
    html: `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#0a0a1a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">

    <!-- ヘッダー -->
    <div style="text-align:center;margin-bottom:32px;">
      <span style="font-size:1.4rem;font-weight:800;">
        <span style="color:#667eea;">SQL</span><span style="color:#764ba2;">Learn</span>
      </span>
    </div>

    <!-- メインカード -->
    <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:32px;">
      <div style="text-align:center;margin-bottom:24px;">
        <div style="display:inline-block;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:50%;width:56px;height:56px;line-height:56px;font-size:1.6rem;text-align:center;">
          ⭐
        </div>
      </div>

      <h1 style="color:#e0e0f0;font-size:1.25rem;font-weight:700;text-align:center;margin:0 0 8px;">
        プレミアムプランへのご登録<br>ありがとうございます
      </h1>
      <p style="color:#8888aa;text-align:center;font-size:0.88rem;margin:0 0 28px;">
        ${displayName}様のご登録が完了しました。
      </p>

      <!-- 情報 -->
      <div style="background:rgba(102,126,234,0.06);border:1px solid rgba(102,126,234,0.15);border-radius:12px;padding:16px 20px;margin-bottom:24px;">
        <table style="width:100%;border-collapse:collapse;font-size:0.875rem;">
          <tr>
            <td style="color:#8888aa;padding:6px 0;width:140px;">プラン</td>
            <td style="color:#e0e0f0;font-weight:600;">SQLLearnプレミアム（月額100円）</td>
          </tr>
          <tr>
            <td style="color:#8888aa;padding:6px 0;">次回更新日</td>
            <td style="color:#e0e0f0;font-weight:600;">${periodEndStr}</td>
          </tr>
          <tr>
            <td style="color:#8888aa;padding:6px 0;">ご利用可能</td>
            <td style="color:#34d399;font-weight:600;">初級50問 ＋ 中級50問（計100問）</td>
          </tr>
        </table>
      </div>

      <!-- CTAボタン -->
      <div style="text-align:center;margin-bottom:24px;">
        <a href="https://www.sql-learning.net/premium/lessons"
           style="display:inline-block;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;text-decoration:none;padding:12px 32px;border-radius:50px;font-weight:700;font-size:0.95rem;">
          プレミアムレッスンを始める →
        </a>
      </div>

      <p style="color:#8888aa;font-size:0.8rem;line-height:1.7;margin:0;text-align:center;">
        プランの解約はプレミアムレッスンページ内の<br>「プランを解約する」からいつでも行えます。
      </p>
    </div>

    <!-- フッター -->
    <div style="text-align:center;margin-top:24px;">
      <p style="color:#546e7a;font-size:0.75rem;line-height:1.7;margin:0;">
        このメールはSQLLearnからの自動送信です。<br>
        ご不明な点は <a href="mailto:eisaku546@gmail.com" style="color:#667eea;">eisaku546@gmail.com</a> までご連絡ください。
      </p>
    </div>

  </div>
</body>
</html>
    `.trim(),
  });
}
