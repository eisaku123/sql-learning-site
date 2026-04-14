# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## コマンド

```bash
npm run dev       # 開発サーバー起動（Turbopack、http://localhost:3000）
npm run build     # プロダクションビルド（TypeScript型チェックも実行）
npm run lint      # ESLint
npm run test      # Vitest（ユニットテスト）
npx prisma migrate dev --name <name>  # スキーマ変更時にマイグレーション生成・適用
npx prisma studio                     # DB GUI（開発用）
git push origin main                  # Vercelへ本番デプロイ（GitHub連携で自動デプロイ）
```

ビルドの型チェックは `npm run build` で行われる（独立した `tsc` コマンドは不要）。

## アーキテクチャ概要

Next.js 16 App Router + Prisma 7 + PostgreSQL（Neon）+ sql.js（WebAssembly）の構成。

### 重要な技術的制約

**Prisma 7 + PostgreSQL（Neon）の接続方式**
- `@prisma/adapter-pg` を使用
- `prisma/schema.prisma` の provider は `postgresql`
- `DATABASE_URL` に Neon の接続文字列を設定
- `src/lib/db.ts` でアダプターを初期化してPrismaクライアントに渡す

**sql.js のブラウザ実行**
- Turbopack は `sql.js` の `exports.browser` 条件を優先するが、ブラウザビルド（`sql-wasm-browser.js`）はプロパティ名が minify される（`columns` → `lc` 等）
- `next.config.ts` の `turbopack.resolveAlias` で `sql.js` を `sql-wasm.js`（非圧縮版）に強制解決
- WASM ファイルは `public/sql-wasm.wasm` に配置し、`locateFile: (f) => \`/\${f}\`` でサーブ
- `SqlEditor` は `dynamic(() => import(...), { ssr: false })` でクライアント専用ロード
- DB初期化は `db.exec(SAMPLE_DB_SQL)`（`db.run()` は1文しか実行しないため不可）
- サンプルDBはメモリ上のみ。ページリロードでリセットされる

**NextAuth.js v4 の型拡張**
- `src/types/index.ts` で `Session.user.id` と `JWT.id` を宣言拡張済み
- サーバーコンポーネントでは `getServerSession(authOptions)`、クライアントでは `useSession()`

### データフロー

**練習問題の正誤判定（ブラウザ内完結）**
1. `SqlEditor` でクエリ実行 → `onResult(columns, rows)` で結果を親に渡す
2. `ExercisePanel` の「答え合わせ」ボタン → `runAnswerSql(exercise.answer)` でモデル解答をブラウザ内SQLiteで実行
3. `compareResults()` でカラム名・行データの両方を比較（ソート・小文字化して比較）
4. `ORDER BY` がある場合は行の順番も考慮
5. 正解時: `POST /api/progress` でDBに記録 → `onSolve(exerciseId)` → 全問正解なら花火 → 花火終了後に完了モーダル表示
- SQLエラー時は `onResult([], [])` を呼び出してフィードバックをクリアする

**進捗記録 `POST /api/progress`**
- `{ lessonSlug }` → `UserProgress` を upsert（レッスン完了）
- `{ exerciseId, solved }` → `UserExercise` を upsert（問題解答）

### カリキュラムデータ

**無料レッスン（`src/lib/curriculum.ts`）**
- `SAMPLE_DB_SQL`: ブラウザ内 sql.js に投入するサンプルDB（employees 15件、departments 5件、products 10件、orders 15件）
- `LESSONS`: 初級5レッスン + 中級4レッスン、各3問（計27問）
- `lesson.content` は HTML 文字列（`dangerouslySetInnerHTML` で表示）
- 静的データ。DBには保存しない

**プレミアムレッスン（`src/lib/premium-curriculum.ts`）**
- `PREMIUM_LESSONS`: 初級・中級あわせて計100問
- 同じ `SAMPLE_DB_SQL` を使用

### アクセス制御

| コンテンツ | 条件 |
|-----------|------|
| 無料初級レッスン | ログイン不要 |
| 無料中級レッスン | ログイン必須（未ログイン時はログイン促進画面） |
| プレミアムレッスン | ログイン + 有効なサブスクリプション必須 |
| 管理画面（`/admin`） | 管理者ログイン必須（NextAuth とは別） |

### 認証・メール

**メール認証（新規登録時）**
- 登録時に `EmailVerificationToken` を生成（24時間有効）
- Resend でメール送信 → `/api/auth/verify-email?token=xxx` で認証
- 未認証ユーザーはログイン不可（`EMAIL_NOT_VERIFIED` エラー）

**パスワードリセット**
- `/forgot-password` → `POST /api/auth/forgot-password` → Resend でメール送信
- `PasswordResetToken`（1時間有効）→ `/reset-password?token=xxx` で新パスワード設定

### 決済（Stripe）

- 月額100円のサブスクリプション
- `/premium/confirm` → 2ステップの購入フロー（確認画面 → カード入力）
- `POST /api/stripe/create-setup-intent` → SetupIntent 作成（顧客作成・重複チェック含む）
- `POST /api/stripe/subscribe` → SetupIntent 確認後にサブスク有効化・DB記録・ウェルカムメール送信
- `POST /api/stripe/webhook` → `invoice.payment_succeeded` / `checkout.session.completed` でDB upsert
- `POST /api/stripe/cancel` → サブスクリプションキャンセル
- `GET /api/subscription` → 有効期限・ステータス確認
- Stripe Link は非表示（`wallets: { link: "never" }`）
- 重複サブスク作成は 409 `ALREADY_SUBSCRIBED` でブロック
- テスト時は Stripe ダッシュボードで既存サブスクをキャンセルしてから試す

### 主要コンポーネント

| コンポーネント | 役割 |
|--------------|------|
| `SqlEditor` | sql.js を使ったブラウザ内SQLエディタ。`ref` で `runSql()` / `resetDb()` を外部公開 |
| `ExercisePanel` | 練習問題表示・答え合わせ・ヒント・解答表示 |
| `Fireworks` | 全問正解時の花火アニメーション（Canvas）。ログインユーザーのみ発火 |
| `LessonCompletionModal` | 花火終了後に表示する完了モーダル（次レッスンへのリンク付き） |
| `TableReferenceModal` | テーブル参照ボタン（押すと `/table-reference` をポップアップウィンドウで開く） |
| `Header` | ナビゲーションヘッダー（ログイン状態に応じて表示切替）。進捗リンクは削除済み |
| `LessonCard` | レッスン一覧カード（中級は未ログイン時に🔒バッジ表示） |
| `LessonTour` | driver.js を使った初回訪問ガイドツアー（9ステップ）。`localStorage` の `lesson_tour_done` で管理 |

### テーブル参照ポップアップ（`/table-reference`）

- `window.open()` で独立したポップアップウィンドウとして開く
- タブ: `employees 社員` / `departments 部署` / `products 商品` / `orders 注文` / **ER図**
- ER図はSVGで描画。`employees → departments`（N:1）、`orders → products`（N:1）

### スタイリング

Tailwind CSS v4 は `@import "tailwindcss"` + `@theme { ... }` ディレクティブで設定（`tailwind.config.ts` は不要）。大部分の UI はインラインスタイル。

カラートークン（インラインスタイルで直接使用）:
- 背景: `#0a0a1a`
- アクセント: `#667eea`（紫）/ `#34d399`（緑）
- テキスト: `#e0e0f0`（主）/ `#8888aa`（補助）

### 環境変数（`.env`）

```
DATABASE_URL="postgresql://..."     # Neon の接続文字列
NEXTAUTH_SECRET="..."               # JWT署名キー（必須）
NEXTAUTH_URL="https://www.sql-learning.net"
RESEND_API_KEY="..."                # メール送信（Resend）
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="..."
STRIPE_SECRET_KEY="..."
STRIPE_PRICE_ID="..."               # 月額100円のプライスID
STRIPE_WEBHOOK_SECRET="..."
```

### 初期セットアップ手順

```bash
npm install
# 上記環境変数を .env に記載
npx prisma migrate dev --name init
npm run dev
```

### その他のルール
- 作成する前に必ず提案の確認をしてほしい
- デプロイするときはバージョン番号をあげてアップしてください（`vercel --prod`）
- ドキュメント（CLAUDE.md）は変更があれば自動で追記していく
- 機能追加の提案を求められたときは必ず案を出す

---

## 開発履歴

### v2.2.x（2026-04-15） ブランチ: feature/right-panel-table-tabs

#### 右パネル タブ式サンプルテーブルビューア

**新コンポーネント `SampleTableViewer`**
- 右パネルにタブ切り替え式のサンプルテーブルを常時表示
- タブ: `👤 users` / `📦 products` / `🛒 orders` / `🔗 order_products`（全件表示）
- SQL実行後に `⚡ 実行結果` タブが右端に出現・自動選択
- 問題切り替え時は実行結果タブをリセットして `users` タブへ戻る
- `SqlEditorHandle.queryTable(tableName)` で現在のDBからデータ取得

**レイアウト変更（`LessonPageClient`）**
- `showExplanation = false`（解説非表示）:
  - 左パネル: 練習問題 + SQLエディタ（`hideResults=true`で結果を非表示）
  - 右パネル: SampleTableViewer（サンプルテーブル + 実行結果タブ）
- `showExplanation = true`（解説表示）: 現在と同じ（左＝解説、右＝練習問題＋SQLエディタ）

**`SqlEditor` 拡張**
- `hideResults?: boolean` — エディタ内結果テーブルを非表示（右パネルに表示するため）
- `onReady?: () => void` — DB初期化完了時のコールバック
- `queryTable(tableName)` — テーブル全件取得（SampleTableViewer用）
- `getCurrentQuery()` — 現在のクエリ文字列取得（解説トグル時の保存用）
- 解説トグル時にクエリ文字列を保存し、SQLエディタ再マウント後に復元

### v2.1.x（2026-04-05）

#### ナビゲーション整理
- Header から「進捗」リンクを削除
- `/progress` は `/dashboard` にリダイレクト

#### 練習問題のDB汚染バグ修正
- `SqlEditor` に `resetDb()` を追加（`SqlEditorHandle` インターフェースに追記）
- 問題切り替え時（`activeExerciseIdx` 変化）に DB をリセットし `lastResult` もクリア
- 原因: 前の問題で実行した `CREATE TABLE` がメモリDB上に残り、次の問題の答え合わせが失敗していた
- 修正: モデル解答は常にフレッシュなDBで実行する

#### Stripe 組み込み決済フロー
- Stripe Checkout（外部リダイレクト）→ 自前の決済ページ `/premium/confirm` に変更
- SetupIntent 方式を採用（Stripe API 2026-02-25.clover で payment_intent が invoice から削除されたため）
- Step1: 購入内容確認・特定商取引法リンク・利用規約同意チェック
- Step2: Stripe PaymentElement（カード入力）
- 確認後 `/premium/success` でサブスクリプション有効化 → DB記録 → ウェルカムメール送信

#### オンボーディングツアー（driver.js）
- `src/components/LessonTour.tsx` を新規作成
- 初回訪問時（ログイン有無問わず）に9ステップのガイドを自動表示
- ツアー対象要素に `id="tour-*"` を付与（SqlEditor, ExercisePanel, TableReferenceModal）
- 「解説を隠す」ボタンを SQLエディタの「クリア」横に移動（`id="tour-toggle-explanation"`）
- driver.js のポップオーバーは白背景のため、インラインスタイルの文字色は濃色（`#1a1a3e` 等）を使用

### v1.x 以前
- 初級・中級レッスン実装（計27問）
- プレミアムレッスン100問追加
- NextAuth.js + メール認証 + パスワードリセット
- Stripe サブスクリプション（月額100円）
- 管理画面（ユーザー管理・メンテナンスモード・お知らせ）
- テーブル参照ポップアップ（ER図含む）
- 花火 + 完了モーダル
