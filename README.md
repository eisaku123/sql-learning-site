# SQLLearn — ブラウザで学ぶSQL学習プラットフォーム

SQLを体系的に学び、ブラウザ上でSQLを実行できるインタラクティブな学習サイトです。

## 技術スタック

| 区分 | 技術 |
|------|------|
| フロントエンド | Next.js 16 (App Router) + TypeScript |
| スタイリング | Tailwind CSS v4 |
| データベース | Prisma 7 + SQLite |
| 認証 | NextAuth.js v4 (Credentials) |
| SQLエディタ | sql.js (WebAssembly) |

## 機能

- **ユーザー認証** — 新規登録・ログイン・ログアウト
- **SQLエディタ** — ブラウザ上でSQLを入力・実行（Ctrl+Enter で実行）
- **カリキュラム** — 初級5レッスン + 中級4レッスン（計9レッスン）
- **練習問題** — 各レッスンに3問。ヒント・解答表示・自動正誤判定
- **進捗管理** — 完了レッスン・解答問題の記録と進捗率表示

## 起動方法

```bash
# 依存パッケージのインストール
npm install

# データベースのセットアップ
npx prisma migrate dev --name init

# 開発サーバーの起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 画面構成

| パス | 画面 |
|------|------|
| `/` | トップページ |
| `/register` | 新規登録 |
| `/login` | ログイン |
| `/dashboard` | ダッシュボード（進捗サマリー） |
| `/lessons` | レッスン一覧 |
| `/lessons/[slug]` | レッスン詳細（解説 + SQLエディタ + 練習問題） |
| `/progress` | 進捗確認 |

## ディレクトリ構成

```
src/
├── app/
│   ├── (auth)/login/        # ログインページ
│   ├── (auth)/register/     # 新規登録ページ
│   ├── api/                 # APIルート
│   ├── dashboard/           # ダッシュボード
│   ├── lessons/[slug]/      # レッスン詳細
│   └── progress/            # 進捗確認
├── components/
│   ├── SqlEditor.tsx        # SQLエディタ（sql.js使用）
│   ├── ExercisePanel.tsx    # 練習問題パネル
│   ├── LessonCard.tsx       # レッスンカード
│   ├── LevelSection.tsx     # 進捗レベル別セクション
│   └── ProgressCircle.tsx   # 進捗円グラフ
└── lib/
    ├── curriculum.ts        # レッスン・問題データ
    ├── auth.ts              # NextAuth設定
    └── db.ts                # Prismaクライアント
```

## 環境変数

`.env` ファイルに以下を設定してください：

```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```
