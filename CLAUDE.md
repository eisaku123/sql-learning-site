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
vercel --prod                         # Vercelへ本番デプロイ
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
- `POST /api/stripe/checkout` → Stripe Checkout セッション作成
- `POST /api/stripe/webhook` → 支払い成功時に `Subscription` レコードを upsert
- `POST /api/stripe/cancel` → サブスクリプションキャンセル
- `GET /api/subscription` → 有効期限・ステータス確認

### 主要コンポーネント

| コンポーネント | 役割 |
|--------------|------|
| `SqlEditor` | sql.js を使ったブラウザ内SQLエディタ。`ref` で `runSql()` を外部公開 |
| `ExercisePanel` | 練習問題表示・答え合わせ・ヒント・解答表示 |
| `Fireworks` | 全問正解時の花火アニメーション（Canvas） |
| `LessonCompletionModal` | 花火終了後に表示する完了モーダル（次レッスンへのリンク付き） |
| `TableReferenceModal` | テーブル参照ボタン（押すと `/table-reference` をポップアップウィンドウで開く） |
| `Header` | ナビゲーションヘッダー（ログイン状態に応じて表示切替） |
| `LessonCard` | レッスン一覧カード（中級は未ログイン時に🔒バッジ表示） |

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
