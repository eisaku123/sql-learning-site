# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## コマンド

```bash
npm run dev       # 開発サーバー起動（Turbopack、http://localhost:3000）
npm run build     # プロダクションビルド（TypeScript型チェックも実行）
npm run lint      # ESLint
npx prisma migrate dev --name <name>  # スキーマ変更時にマイグレーション生成・適用
npx prisma studio                     # DB GUI（開発用）
```

ビルドの型チェックは `npm run build` で行われる（独立した `tsc` コマンドは不要）。

## アーキテクチャ概要

Next.js 16 App Router + Prisma 7 + sql.js（WebAssembly）の3層構成。

### 重要な技術的制約

**Prisma 7 + SQLite の接続方式**
- Prisma 7 はドライバアダプター必須。`@prisma/adapter-better-sqlite3` を使用
- `prisma/schema.prisma` の `datasource` に `url` を書かない（Prisma 7 の破壊的変更）
- URL は `prisma.config.ts` の `datasource.url` で設定
- `src/lib/db.ts` は `DATABASE_URL` 環境変数を `path.resolve()` で絶対パスに変換してアダプターに渡す
- データベースファイルはプロジェクトルートの `dev.db`（`file:./dev.db`）。`prisma/dev.db` ではない

**sql.js のブラウザ実行**
- Turbopack は `sql.js` の `exports.browser` 条件を優先するが、ブラウザビルド（`sql-wasm-browser.js`）はプロパティ名が minify される（`columns` → `lc` 等）
- `next.config.ts` の `turbopack.resolveAlias` で `sql.js` を `sql-wasm.js`（非圧縮版）に強制解決
- WASM ファイルは `public/sql-wasm.wasm` に配置し、`locateFile: (f) => \`/\${f}\`` でサーブ
- `SqlEditor` は `dynamic(() => import(...), { ssr: false })` でクライアント専用ロード
- DB初期化は `db.exec(SAMPLE_DB_SQL)`（`db.run()` は1文しか実行しないため不可）

**NextAuth.js v4 の型拡張**
- `src/types/index.ts` で `Session.user.id` と `JWT.id` を宣言拡張済み
- サーバーコンポーネントでは `getServerSession(authOptions)`、クライアントでは `useSession()`

### データフロー

**練習問題の正誤判定**
1. `SqlEditor` でクエリ実行 → `onResult(columns: string[])` コールバックで列名を親に渡す
2. `ExercisePanel` の「答え合わせ」ボタン → `POST /api/exercises/check` に `resultColumns` を送信
3. サーバー側で `curriculum.ts` の `expectedColumns` と列名比較（ソート・小文字化して比較）
4. 正解時: `POST /api/progress` でDBに記録 → `onSolve(exerciseId)` → 全問正解なら花火

**進捗記録 `POST /api/progress`**
- `{ lessonSlug }` → `UserProgress` を upsert（レッスン完了）
- `{ exerciseId, solved }` → `UserExercise` を upsert（問題解答）

### カリキュラムデータ（`src/lib/curriculum.ts`）

静的データとして全レッスン・問題を定義。DBには保存しない。

- `SAMPLE_DB_SQL`: ブラウザ内 sql.js に投入するサンプルDB（employees 15件、departments 5件、products 10件、orders 15件）
- `LESSONS`: 初級5レッスン + 中級4レッスン、各3問（計27問）
- `lesson.content` は HTML 文字列（`dangerouslySetInnerHTML` で表示）

### スタイリング

Tailwind CSS v4 は `@import "tailwindcss"` + `@theme { ... }` ディレクティブで設定（`tailwind.config.ts` は不要）。大部分の UI はインラインスタイル。

カラートークン（インラインスタイルで直接使用）:
- 背景: `#0a0a1a`
- アクセント: `#667eea`（紫）/ `#34d399`（緑）
- テキスト: `#e0e0f0`（主）/ `#8888aa`（補助）

### 環境変数（`.env`）

```
DATABASE_URL="file:./dev.db"      # プロジェクトルート相対
NEXTAUTH_SECRET="..."              # JWT署名キー（必須）
NEXTAUTH_URL="http://localhost:3000"
```

### 初期セットアップ手順

```bash
npm install
# DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL を .env に記載
npx prisma migrate dev --name init   # dev.db をプロジェクトルートに生成
npm run dev
```
