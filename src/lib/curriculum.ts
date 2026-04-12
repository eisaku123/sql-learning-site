import type { Lesson } from "@/types";

// ブラウザで実行されるサンプルデータベースの初期化SQL
export const SAMPLE_DB_SQL = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  city TEXT
);
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  price INTEGER,
  stock INTEGER
);
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  order_date TEXT,
  status TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS order_details (
  id INTEGER PRIMARY KEY,
  order_id INTEGER,
  product_id INTEGER,
  quantity INTEGER,
  price INTEGER,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT OR IGNORE INTO users VALUES
  (1,  '田中 太郎',   'tanaka@example.com',    '東京'),
  (2,  '鈴木 花子',   'suzuki@example.com',    '大阪'),
  (3,  '佐藤 次郎',   'sato@example.com',      '東京'),
  (4,  '山田 美咲',   'yamada@example.com',    '名古屋'),
  (5,  '中村 健一',   'nakamura@example.com',  '東京'),
  (6,  '小林 さくら', 'kobayashi@example.com', '福岡'),
  (7,  '加藤 雄一',   'kato@example.com',      '大阪'),
  (8,  '吉田 陽子',   'yoshida@example.com',   '東京'),
  (9,  '渡辺 勇',     'watanabe@example.com',  '名古屋'),
  (10, '松本 智子',   'matsumoto@example.com', '大阪'),
  (11, '井上 拓也',   'inoue@example.com',     '東京'),
  (12, '木村 麻衣',   NULL,                    '福岡'),
  (13, '林 浩二',     'hayashi@example.com',   '大阪'),
  (14, '清水 理恵',   NULL,                    NULL),
  (15, '山口 誠',     'yamaguchi@example.com', '東京');

INSERT OR IGNORE INTO products VALUES
  (1,  'Laptop',    'PC',          120000, 50),
  (2,  'Mouse',     'Accessory',   3500,   200),
  (3,  'Keyboard',  'Accessory',   8000,   150),
  (4,  'Monitor',   'Display',     45000,  30),
  (5,  'USB Hub',   'Accessory',   2500,   300),
  (6,  'Desktop',   'PC',          180000, 20),
  (7,  'Headset',   'Accessory',   12000,  80),
  (8,  'Webcam',    'Accessory',   7500,   60),
  (9,  'Tablet',    'PC',          65000,  NULL),
  (10, 'Printer',   'Peripheral',  25000,  NULL);

INSERT OR IGNORE INTO orders VALUES
  (1,  1,  '2024-01-15', 'completed'),
  (2,  2,  '2024-01-20', 'completed'),
  (3,  3,  '2024-02-01', 'completed'),
  (4,  1,  '2024-02-10', 'completed'),
  (5,  4,  '2024-02-15', 'pending'),
  (6,  5,  '2024-03-01', 'completed'),
  (7,  2,  '2024-03-10', 'completed'),
  (8,  6,  '2024-03-15', 'cancelled'),
  (9,  1,  '2024-04-01', 'completed'),
  (10, 7,  '2024-04-10', 'pending'),
  (11, 3,  '2024-04-20', 'completed'),
  (12, 8,  '2024-05-01', 'completed'),
  (13, 4,  '2024-05-10', 'completed'),
  (14, 9,  '2024-05-20', 'pending'),
  (15, 10, '2024-06-01', 'completed');

INSERT OR IGNORE INTO order_details VALUES
  (1,  1,  1, 2, 120000),
  (2,  1,  2, 1, 3500),
  (3,  2,  3, 3, 8000),
  (4,  3,  4, 1, 45000),
  (5,  4,  2, 5, 3500),
  (6,  5,  1, 1, 120000),
  (7,  5,  3, 2, 8000),
  (8,  6,  5, 10, 2500),
  (9,  7,  7, 2, 12000),
  (10, 8,  2, 3, 3500),
  (11, 9,  1, 1, 120000),
  (12, 9,  4, 1, 45000),
  (13, 10, 9, 1, 65000),
  (14, 11, 3, 4, 8000),
  (15, 12, 6, 1, 180000),
  (16, 13, 4, 2, 45000),
  (17, 14, 8, 3, 7500),
  (18, 15, 10, 2, 25000),
  (19, 6,  2, 5, 3500),
  (20, 7,  1, 1, 120000);
`;

export const LESSONS: Lesson[] = [
  // ========= 初級コース =========
  {
    slug: "intro",
    title: "SQLとは？データベースの基礎",
    level: "beginner",
    order: 1,
    description: "データベースとSQLの基本概念を学びます",
    content: `
<h2>データベースとは？</h2>
<p>データベースとは、<strong>データを整理して保存する仕組み</strong>です。表計算ソフトのようなイメージですが、大量のデータを高速に検索・管理できます。</p>

<h2>SQLとは？</h2>
<p><strong>SQL（エスキューエル）</strong>は、データベースを操作するための言語です。英語に近い構文で書けるため、プログラミング未経験者でも学びやすいのが特徴です。</p>

<h2>テーブルの構造</h2>
<p>データは<strong>テーブル（表）</strong>に格納されます。テーブルは<strong>列（カラム）</strong>と<strong>行（レコード）</strong>で構成されます。</p>

<pre><code>┌─────┬────────────┬──────────────────────────┬──────────┐
│ id  │ name       │ email                    │ city     │
├─────┼────────────┼──────────────────────────┼──────────┤
│  1  │ 田中 太郎  │ tanaka@example.com       │ 東京     │
│  2  │ 鈴木 花子  │ suzuki@example.com       │ 大阪     │
└─────┴────────────┴──────────────────────────┴──────────┘</code></pre>

<h2>このサイトで使うテーブル</h2>
<p>このサイトでは以下の4つのテーブルを使って学習します：</p>
<ul>
  <li><code>users</code> — ユーザーテーブル（15名のデータ）</li>
  <li><code>products</code> — 商品テーブル（10商品）</li>
  <li><code>orders</code> — 注文テーブル（15件）</li>
  <li><code>order_details</code> — 注文明細テーブル（20件）</li>
</ul>

<p>右のエディタで以下のSQLを実行してみましょう：</p>
<pre><code class="sql-example">SELECT * FROM users;</code></pre>
    `,
    exercises: [
      {
        id: "intro-1",
        question: "usersテーブルの全データを取得してください",
        hint: "SELECT * FROM テーブル名; で全データを取得できます",
        answer: "SELECT * FROM users",
        expectedColumns: ["id", "name", "email", "city"],
      },
      {
        id: "intro-2",
        question: "productsテーブルの全データを取得してください",
        hint: "テーブル名は products です",
        answer: "SELECT * FROM products",
        expectedColumns: ["id", "name", "category", "price", "stock"],
      },
      {
        id: "intro-3",
        question: "ordersテーブルの全データを取得してください",
        hint: "テーブル名は orders です",
        answer: "SELECT * FROM orders",
        expectedColumns: ["id", "user_id", "order_date", "status"],
      },
    ],
  },
  {
    slug: "select-basics",
    title: "SELECT文の基礎",
    level: "beginner",
    order: 2,
    description: "データを取得するSELECT文の基本を学びます",
    content: `
<h2>SELECT文の基本構文</h2>
<p>SQLでデータを取得するには <code>SELECT</code> 文を使います。</p>

<pre><code><span class="sql-keyword">SELECT</span> カラム名 <span class="sql-keyword">FROM</span> テーブル名;</code></pre>

<h2>特定のカラムを取得</h2>
<p>必要なカラムだけを取得できます。複数の場合はカンマで区切ります。</p>

<pre><code><span class="sql-keyword">SELECT</span> name, city <span class="sql-keyword">FROM</span> users;</code></pre>

<h2>全カラムを取得（アスタリスク）</h2>
<p><code>*</code>（アスタリスク）を使うと全カラムを取得できます。</p>

<pre><code><span class="sql-keyword">SELECT</span> * <span class="sql-keyword">FROM</span> users;</code></pre>

<h2>カラムに別名をつける（AS）</h2>
<p><code>AS</code> を使ってカラムに別名（エイリアス）をつけられます。</p>

<pre><code><span class="sql-keyword">SELECT</span> name <span class="sql-keyword">AS</span> ユーザー名, city <span class="sql-keyword">AS</span> 都市 <span class="sql-keyword">FROM</span> users;</code></pre>

<h2>重複を除いて取得（DISTINCT）</h2>
<p><code>DISTINCT</code> を使うと重複した値を除いて取得できます。</p>

<pre><code><span class="sql-keyword">SELECT DISTINCT</span> category <span class="sql-keyword">FROM</span> products;</code></pre>
    `,
    exercises: [
      {
        id: "select-1",
        question: "usersテーブルから name と city の2カラムだけ取得してください",
        hint: "SELECT カラム1, カラム2 FROM テーブル名",
        answer: "SELECT name, city FROM users",
        expectedColumns: ["name", "city"],
      },
      {
        id: "select-2",
        question: "productsテーブルから name と price を取得し、それぞれ「商品名」「価格」という別名をつけてください",
        hint: "SELECT name AS 商品名, price AS 価格 FROM products",
        answer: "SELECT name AS 商品名, price AS 価格 FROM products",
        expectedColumns: ["商品名", "価格"],
      },
      {
        id: "select-3",
        question: "productsテーブルから重複なしのcategoryを取得してください",
        hint: "SELECT DISTINCT を使います",
        answer: "SELECT DISTINCT category FROM products",
        expectedColumns: ["category"],
      },
    ],
  },
  {
    slug: "where-clause",
    title: "WHERE句で絞り込む",
    level: "beginner",
    order: 3,
    description: "条件を指定してデータを絞り込む方法を学びます",
    content: `
<h2>WHERE句の基本</h2>
<p>特定の条件に合うデータだけを取得するには <code>WHERE</code> 句を使います。</p>

<pre><code><span class="sql-keyword">SELECT</span> * <span class="sql-keyword">FROM</span> products <span class="sql-keyword">WHERE</span> price > <span class="sql-number">50000</span>;</code></pre>

<h2>比較演算子</h2>
<table>
  <tr><th>演算子</th><th>意味</th><th>例</th></tr>
  <tr><td>=</td><td>等しい</td><td>category = 'PC'</td></tr>
  <tr><td>!=, &lt;&gt;</td><td>等しくない</td><td>status != 'cancelled'</td></tr>
  <tr><td>&gt;</td><td>より大きい</td><td>price &gt; 50000</td></tr>
  <tr><td>&gt;=</td><td>以上</td><td>price &gt;= 50000</td></tr>
  <tr><td>&lt;</td><td>より小さい</td><td>price &lt; 10000</td></tr>
  <tr><td>&lt;=</td><td>以下</td><td>price &lt;= 10000</td></tr>
</table>

<h2>文字列の条件</h2>
<p>文字列はシングルクォートで囲みます。</p>
<pre><code><span class="sql-keyword">SELECT</span> * <span class="sql-keyword">FROM</span> users <span class="sql-keyword">WHERE</span> city = <span class="sql-string">'東京'</span>;</code></pre>

<h2>AND・OR で複数条件</h2>
<pre><code><span class="sql-keyword">SELECT</span> * <span class="sql-keyword">FROM</span> products
<span class="sql-keyword">WHERE</span> category = <span class="sql-string">'PC'</span> <span class="sql-keyword">AND</span> price >= <span class="sql-number">100000</span>;</code></pre>

<h2>LIKE であいまい検索</h2>
<p><code>%</code> は任意の文字列、<code>_</code> は任意の1文字を表します。</p>
<pre><code><span class="sql-keyword">SELECT</span> * <span class="sql-keyword">FROM</span> users <span class="sql-keyword">WHERE</span> name <span class="sql-keyword">LIKE</span> <span class="sql-string">'田%'</span>;</code></pre>

<h2>IN で複数値の指定</h2>
<pre><code><span class="sql-keyword">SELECT</span> * <span class="sql-keyword">FROM</span> orders <span class="sql-keyword">WHERE</span> status <span class="sql-keyword">IN</span> (<span class="sql-string">'pending'</span>, <span class="sql-string">'cancelled'</span>);</code></pre>

<h2>BETWEEN で範囲指定</h2>
<pre><code><span class="sql-keyword">SELECT</span> * <span class="sql-keyword">FROM</span> products <span class="sql-keyword">WHERE</span> price <span class="sql-keyword">BETWEEN</span> <span class="sql-number">5000</span> <span class="sql-keyword">AND</span> <span class="sql-number">50000</span>;</code></pre>
    `,
    exercises: [
      {
        id: "where-1",
        question: "productsテーブルから price が 50000 以上の商品を取得してください",
        hint: "WHERE price >= 50000 を使います",
        answer: "SELECT * FROM products WHERE price >= 50000",
        expectedColumns: ["id", "name", "category", "price", "stock"],
      },
      {
        id: "where-2",
        question: "usersテーブルから city が '東京' のユーザーを取得してください",
        hint: "WHERE city = '東京'",
        answer: "SELECT * FROM users WHERE city = '東京'",
        expectedColumns: ["id", "name", "email", "city"],
      },
      {
        id: "where-3",
        question: "productsテーブルから price が 5000 以上 50000 以下の商品を取得してください",
        hint: "BETWEEN を使います",
        answer: "SELECT * FROM products WHERE price BETWEEN 5000 AND 50000",
        expectedColumns: ["id", "name", "category", "price", "stock"],
      },
    ],
  },
  {
    slug: "order-limit",
    title: "ORDER BY・LIMITで並び替えと件数制限",
    level: "beginner",
    order: 4,
    description: "データの並び替えと件数制限を学びます",
    content: `
<h2>ORDER BY で並び替え</h2>
<p>データを特定のカラムで並び替えるには <code>ORDER BY</code> を使います。</p>

<pre><code><span class="sql-keyword">SELECT</span> * <span class="sql-keyword">FROM</span> products <span class="sql-keyword">ORDER BY</span> price <span class="sql-keyword">DESC</span>;</code></pre>

<ul>
  <li><code>ASC</code>（昇順）：小さい順・古い順（デフォルト）</li>
  <li><code>DESC</code>（降順）：大きい順・新しい順</li>
</ul>

<h2>複数カラムで並び替え</h2>
<pre><code><span class="sql-keyword">SELECT</span> * <span class="sql-keyword">FROM</span> products
<span class="sql-keyword">ORDER BY</span> category <span class="sql-keyword">ASC</span>, price <span class="sql-keyword">DESC</span>;</code></pre>

<h2>LIMIT で件数を制限</h2>
<p>取得する件数を制限するには <code>LIMIT</code> を使います。</p>

<pre><code><span class="sql-keyword">SELECT</span> * <span class="sql-keyword">FROM</span> products <span class="sql-keyword">LIMIT</span> <span class="sql-number">5</span>;</code></pre>

<h2>OFFSET でスキップ</h2>
<p><code>OFFSET</code> で先頭から何件スキップするかを指定できます（ページネーションに使用）。</p>
<pre><code><span class="sql-keyword">SELECT</span> * <span class="sql-keyword">FROM</span> products <span class="sql-keyword">LIMIT</span> <span class="sql-number">5</span> <span class="sql-keyword">OFFSET</span> <span class="sql-number">5</span>;</code></pre>

<h2>WHERE + ORDER BY + LIMIT の組み合わせ</h2>
<pre><code><span class="sql-keyword">SELECT</span> name, price <span class="sql-keyword">FROM</span> products
<span class="sql-keyword">WHERE</span> category = <span class="sql-string">'PC'</span>
<span class="sql-keyword">ORDER BY</span> price <span class="sql-keyword">DESC</span>
<span class="sql-keyword">LIMIT</span> <span class="sql-number">3</span>;</code></pre>
    `,
    exercises: [
      {
        id: "order-1",
        question: "productsテーブルをpriceの降順（高い順）で全件取得してください",
        hint: "ORDER BY price DESC",
        answer: "SELECT * FROM products ORDER BY price DESC",
        expectedColumns: ["id", "name", "category", "price", "stock"],
      },
      {
        id: "order-2",
        question: "productsテーブルをpriceの昇順（安い順）で取得し、上位5件だけ表示してください",
        hint: "ORDER BY price ASC LIMIT 5",
        answer: "SELECT * FROM products ORDER BY price ASC LIMIT 5",
        expectedColumns: ["id", "name", "category", "price", "stock"],
      },
      {
        id: "order-3",
        question: "productsテーブルから最も価格が高い3商品のname と price を取得してください",
        hint: "ORDER BY price DESC LIMIT 3",
        answer: "SELECT name, price FROM products ORDER BY price DESC LIMIT 3",
        expectedColumns: ["name", "price"],
      },
    ],
  },
  {
    slug: "insert-update-delete",
    title: "INSERT・UPDATE・DELETE",
    level: "beginner",
    order: 5,
    description: "データの追加・更新・削除を学びます",
    content: `
<h2>INSERT でデータを追加</h2>
<p>テーブルに新しいデータを追加するには <code>INSERT INTO</code> を使います。</p>

<pre><code><span class="sql-keyword">INSERT INTO</span> users (id, name, email, city)
<span class="sql-keyword">VALUES</span> (<span class="sql-number">16</span>, <span class="sql-string">'新田 一郎'</span>, <span class="sql-string">'nitta@example.com'</span>, <span class="sql-string">'札幌'</span>);</code></pre>

<h2>UPDATE でデータを更新</h2>
<p>既存のデータを更新するには <code>UPDATE</code> を使います。<strong>WHERE を忘れると全行が更新されるので注意！</strong></p>

<pre><code><span class="sql-keyword">UPDATE</span> products
<span class="sql-keyword">SET</span> price = <span class="sql-number">100000</span>
<span class="sql-keyword">WHERE</span> id = <span class="sql-number">1</span>;</code></pre>

<h2>DELETE でデータを削除</h2>
<p>データを削除するには <code>DELETE FROM</code> を使います。<strong>WHERE を忘れると全行が削除されるので注意！</strong></p>

<pre><code><span class="sql-keyword">DELETE FROM</span> users
<span class="sql-keyword">WHERE</span> id = <span class="sql-number">16</span>;</code></pre>

<h2>実行順序の例</h2>
<pre><code><span class="sql-comment">-- 1. まず追加</span>
<span class="sql-keyword">INSERT INTO</span> users (id, name, email, city) <span class="sql-keyword">VALUES</span> (<span class="sql-number">16</span>, <span class="sql-string">'新田 一郎'</span>, <span class="sql-string">'nitta@example.com'</span>, <span class="sql-string">'札幌'</span>);
<span class="sql-comment">-- 2. 確認</span>
<span class="sql-keyword">SELECT</span> * <span class="sql-keyword">FROM</span> users;
<span class="sql-comment">-- 3. 更新</span>
<span class="sql-keyword">UPDATE</span> users <span class="sql-keyword">SET</span> city = <span class="sql-string">'仙台'</span> <span class="sql-keyword">WHERE</span> id = <span class="sql-number">16</span>;
<span class="sql-comment">-- 4. 削除</span>
<span class="sql-keyword">DELETE FROM</span> users <span class="sql-keyword">WHERE</span> id = <span class="sql-number">16</span>;</code></pre>
    `,
    exercises: [
      {
        id: "dml-1",
        question: "usersテーブルに id=16, name='新田 一郎', email='nitta@example.com', city='札幌' のデータを追加して、全データを確認してください",
        hint: "INSERT INTO users (id, name, email, city) VALUES (16, '新田 一郎', 'nitta@example.com', '札幌'); SELECT * FROM users;",
        answer: "INSERT INTO users (id, name, email, city) VALUES (16, '新田 一郎', 'nitta@example.com', '札幌'); SELECT * FROM users;",
        expectedColumns: ["id", "name", "email", "city"],
      },
      {
        id: "dml-2",
        question: "id=1のLaptopの price を 100000 に更新し、そのデータを確認してください",
        hint: "UPDATE products SET price = 100000 WHERE id = 1;",
        answer: "UPDATE products SET price = 100000 WHERE id = 1; SELECT * FROM products WHERE id = 1;",
        expectedColumns: ["id", "name", "category", "price", "stock"],
      },
      {
        id: "dml-3",
        question: "先ほど追加した id=16 のユーザーを削除して、全ユーザーを確認してください",
        hint: "DELETE FROM users WHERE id = 16;",
        answer: "DELETE FROM users WHERE id = 16; SELECT * FROM users;",
        expectedColumns: ["id", "name", "email", "city"],
      },
    ],
  },

  // ========= 中級コース =========
  {
    slug: "joins",
    title: "JOINでテーブルを結合する",
    level: "intermediate",
    order: 6,
    description: "複数テーブルを結合してデータを取得する方法を学びます",
    content: `
<h2>JOINとは？</h2>
<p>複数のテーブルを関連するカラムで結合してデータを取得します。</p>

<h2>INNER JOIN（内部結合）</h2>
<p>両方のテーブルに一致するデータのみを取得します。</p>

<pre><code><span class="sql-keyword">SELECT</span> o.id, u.name, o.order_date, o.status
<span class="sql-keyword">FROM</span> orders o
<span class="sql-keyword">INNER JOIN</span> users u <span class="sql-keyword">ON</span> o.user_id = u.id;</code></pre>

<h2>LEFT JOIN（左外部結合）</h2>
<p>左テーブルの全データ + 右テーブルの一致データを取得。一致しない場合はNULL。</p>

<pre><code><span class="sql-keyword">SELECT</span> u.name, o.order_date
<span class="sql-keyword">FROM</span> users u
<span class="sql-keyword">LEFT JOIN</span> orders o <span class="sql-keyword">ON</span> u.id = o.user_id;</code></pre>

<h2>テーブルエイリアス（別名）</h2>
<p>テーブル名が長い場合、短い別名をつけると便利です。</p>
<pre><code><span class="sql-comment">-- o が orders、u が users の別名</span>
<span class="sql-keyword">SELECT</span> o.id, u.name, o.status
<span class="sql-keyword">FROM</span> orders o
<span class="sql-keyword">JOIN</span> users u <span class="sql-keyword">ON</span> o.user_id = u.id
<span class="sql-keyword">ORDER BY</span> o.order_date;</code></pre>

<h2>order_details を使った3テーブルのJOIN</h2>
<pre><code><span class="sql-keyword">SELECT</span> u.name, p.name <span class="sql-keyword">AS</span> product, od.quantity
<span class="sql-keyword">FROM</span> orders o
<span class="sql-keyword">JOIN</span> users u <span class="sql-keyword">ON</span> o.user_id = u.id
<span class="sql-keyword">JOIN</span> order_details od <span class="sql-keyword">ON</span> o.id = od.order_id
<span class="sql-keyword">JOIN</span> products p <span class="sql-keyword">ON</span> od.product_id = p.id;</code></pre>
    `,
    exercises: [
      {
        id: "join-1",
        question: "ordersとusersをJOINして、注文ID・ユーザー名・注文日・ステータスを取得してください",
        hint: "JOIN users u ON o.user_id = u.id",
        answer: "SELECT o.id, u.name, o.order_date, o.status FROM orders o JOIN users u ON o.user_id = u.id",
        expectedColumns: ["id", "name", "order_date", "status"],
      },
      {
        id: "join-2",
        question: "order_detailsとproductsをJOINして、明細ID・商品名・数量・価格を取得してください",
        hint: "order_details od JOIN products p ON od.product_id = p.id",
        answer: "SELECT od.id, p.name, od.quantity, od.price FROM order_details od JOIN products p ON od.product_id = p.id",
        expectedColumns: ["id", "name", "quantity", "price"],
      },
      {
        id: "join-3",
        question: "status が 'completed' の注文を、ユーザー名と一緒に取得してください",
        hint: "JOIN後にWHERE o.status = 'completed'",
        answer: "SELECT o.id, u.name, o.order_date FROM orders o JOIN users u ON o.user_id = u.id WHERE o.status = 'completed'",
        expectedColumns: ["id", "name", "order_date"],
      },
    ],
  },
  {
    slug: "group-by",
    title: "GROUP BY・HAVINGで集計する",
    level: "intermediate",
    order: 7,
    description: "データをグループ化して集計する方法を学びます",
    content: `
<h2>集計関数</h2>
<table>
  <tr><th>関数</th><th>意味</th></tr>
  <tr><td>COUNT(*)</td><td>行数を数える</td></tr>
  <tr><td>SUM(列)</td><td>合計を求める</td></tr>
  <tr><td>AVG(列)</td><td>平均を求める</td></tr>
  <tr><td>MAX(列)</td><td>最大値を求める</td></tr>
  <tr><td>MIN(列)</td><td>最小値を求める</td></tr>
</table>

<h2>GROUP BY でグループ化</h2>
<p>指定したカラムの値ごとにデータをグループ化して集計します。</p>

<pre><code><span class="sql-keyword">SELECT</span> city, <span class="sql-function">COUNT</span>(*) <span class="sql-keyword">AS</span> 人数
<span class="sql-keyword">FROM</span> users
<span class="sql-keyword">GROUP BY</span> city;</code></pre>

<h2>複数の集計関数</h2>
<pre><code><span class="sql-keyword">SELECT</span> category,
       <span class="sql-function">COUNT</span>(*) <span class="sql-keyword">AS</span> 商品数,
       <span class="sql-function">AVG</span>(price) <span class="sql-keyword">AS</span> 平均価格,
       <span class="sql-function">MAX</span>(price) <span class="sql-keyword">AS</span> 最高価格
<span class="sql-keyword">FROM</span> products
<span class="sql-keyword">GROUP BY</span> category;</code></pre>

<h2>HAVING でグループに条件をつける</h2>
<p><code>WHERE</code>はグループ化前、<code>HAVING</code>はグループ化後の絞り込みです。</p>

<pre><code><span class="sql-keyword">SELECT</span> city, <span class="sql-function">COUNT</span>(*) <span class="sql-keyword">AS</span> 人数
<span class="sql-keyword">FROM</span> users
<span class="sql-keyword">GROUP BY</span> city
<span class="sql-keyword">HAVING</span> <span class="sql-function">COUNT</span>(*) >= <span class="sql-number">2</span>;</code></pre>

<h2>JOIN + GROUP BY</h2>
<pre><code><span class="sql-keyword">SELECT</span> u.city, <span class="sql-function">COUNT</span>(o.id) <span class="sql-keyword">AS</span> 注文数
<span class="sql-keyword">FROM</span> users u
<span class="sql-keyword">JOIN</span> orders o <span class="sql-keyword">ON</span> u.id = o.user_id
<span class="sql-keyword">GROUP BY</span> u.city
<span class="sql-keyword">ORDER BY</span> 注文数 <span class="sql-keyword">DESC</span>;</code></pre>
    `,
    exercises: [
      {
        id: "group-1",
        question: "usersテーブルをcityでグループ化して、各都市のユーザー数を取得してください",
        hint: "GROUP BY city で COUNT(*) を使います",
        answer: "SELECT city, COUNT(*) AS 人数 FROM users GROUP BY city",
        expectedColumns: ["city", "人数"],
      },
      {
        id: "group-2",
        question: "productsテーブルをcategoryでグループ化して、各カテゴリの商品数と平均価格を取得してください",
        hint: "COUNT(*) と AVG(price) を GROUP BY category と組み合わせます",
        answer: "SELECT category, COUNT(*) AS 商品数, AVG(price) AS 平均価格 FROM products GROUP BY category",
        expectedColumns: ["category", "商品数", "平均価格"],
      },
      {
        id: "group-3",
        question: "usersテーブルをcityでグループ化して、ユーザー数が2人以上の都市と人数を取得してください",
        hint: "GROUP BY city、HAVING COUNT(*) >= 2",
        answer: "SELECT city, COUNT(*) AS 人数 FROM users GROUP BY city HAVING COUNT(*) >= 2",
        expectedColumns: ["city", "人数"],
      },
    ],
  },
  {
    slug: "subquery",
    title: "サブクエリ",
    level: "intermediate",
    order: 8,
    description: "クエリの中にクエリを書くサブクエリを学びます",
    content: `
<h2>サブクエリとは？</h2>
<p>SQL文の中に別のSQL文を埋め込む技術です。括弧で囲んで記述します。</p>

<h2>WHERE句のサブクエリ</h2>
<p>全商品の平均価格より高い商品を取得：</p>
<pre><code><span class="sql-keyword">SELECT</span> name, price
<span class="sql-keyword">FROM</span> products
<span class="sql-keyword">WHERE</span> price > (
    <span class="sql-keyword">SELECT</span> <span class="sql-function">AVG</span>(price) <span class="sql-keyword">FROM</span> products
);</code></pre>

<h2>INを使ったサブクエリ</h2>
<p>東京在住ユーザーの注文を取得：</p>
<pre><code><span class="sql-keyword">SELECT</span> * <span class="sql-keyword">FROM</span> orders
<span class="sql-keyword">WHERE</span> user_id <span class="sql-keyword">IN</span> (
    <span class="sql-keyword">SELECT</span> id <span class="sql-keyword">FROM</span> users <span class="sql-keyword">WHERE</span> city = <span class="sql-string">'東京'</span>
);</code></pre>

<h2>FROM句のサブクエリ（派生テーブル）</h2>
<pre><code><span class="sql-keyword">SELECT</span> cat.category, cat.avg_price
<span class="sql-keyword">FROM</span> (
    <span class="sql-keyword">SELECT</span> category, <span class="sql-function">AVG</span>(price) <span class="sql-keyword">AS</span> avg_price
    <span class="sql-keyword">FROM</span> products
    <span class="sql-keyword">GROUP BY</span> category
) cat
<span class="sql-keyword">WHERE</span> cat.avg_price > <span class="sql-number">20000</span>;</code></pre>
    `,
    exercises: [
      {
        id: "sub-1",
        question: "全商品の平均価格より高い商品のnameとpriceを取得してください",
        hint: "WHERE price > (SELECT AVG(price) FROM products)",
        answer: "SELECT name, price FROM products WHERE price > (SELECT AVG(price) FROM products)",
        expectedColumns: ["name", "price"],
      },
      {
        id: "sub-2",
        question: "東京在住のユーザー（usersテーブルでcity='東京'）が行った注文を取得してください",
        hint: "WHERE user_id IN (SELECT id FROM users WHERE city = '東京')",
        answer: "SELECT * FROM orders WHERE user_id IN (SELECT id FROM users WHERE city = '東京')",
        expectedColumns: ["id", "user_id", "order_date", "status"],
      },
      {
        id: "sub-3",
        question: "最も価格が高い商品のname と price を取得してください（サブクエリを使って）",
        hint: "WHERE price = (SELECT MAX(price) FROM products)",
        answer: "SELECT name, price FROM products WHERE price = (SELECT MAX(price) FROM products)",
        expectedColumns: ["name", "price"],
      },
    ],
  },
  {
    slug: "junction-table",
    title: "中間テーブルで多対多を表現する",
    level: "intermediate",
    order: 9,
    description: "中間テーブル（order_details）を使って多対多の関係を理解します",
    content: `
<h2>多対多の関係とは？</h2>
<p>1つの注文には複数の商品が含まれ、1つの商品は複数の注文に含まれます。このような<strong>多対多（N:M）</strong>の関係は、直接テーブルを結びつけることができません。</p>

<h2>中間テーブルで解決する</h2>
<p><strong>中間テーブル</strong>（または関連テーブル）を間に挟むことで多対多を表現します。</p>

<pre><code>orders ─── order_details ─── products
  1件の注文   N件の明細    1種の商品
（1）       （多対多）       （1）</code></pre>

<h2>order_details の構造</h2>
<pre><code>order_details
  id          — 明細ID
  order_id    — どの注文か（ordersのid）
  product_id  — どの商品か（productsのid）
  quantity    — 数量
  price       — 単価</code></pre>

<h2>3テーブルを結合して読み解く</h2>
<pre><code><span class="sql-keyword">SELECT</span>
  u.name <span class="sql-keyword">AS</span> ユーザー,
  p.name <span class="sql-keyword">AS</span> 商品,
  od.quantity <span class="sql-keyword">AS</span> 数量,
  od.price * od.quantity <span class="sql-keyword">AS</span> 小計
<span class="sql-keyword">FROM</span> orders o
<span class="sql-keyword">JOIN</span> users u          <span class="sql-keyword">ON</span> o.user_id = u.id
<span class="sql-keyword">JOIN</span> order_details od <span class="sql-keyword">ON</span> o.id = od.order_id
<span class="sql-keyword">JOIN</span> products p       <span class="sql-keyword">ON</span> od.product_id = p.id;</code></pre>

<h2>集計への応用</h2>
<pre><code><span class="sql-keyword">SELECT</span> u.name, <span class="sql-function">SUM</span>(od.price * od.quantity) <span class="sql-keyword">AS</span> 合計金額
<span class="sql-keyword">FROM</span> orders o
<span class="sql-keyword">JOIN</span> users u          <span class="sql-keyword">ON</span> o.user_id = u.id
<span class="sql-keyword">JOIN</span> order_details od <span class="sql-keyword">ON</span> o.id = od.order_id
<span class="sql-keyword">GROUP BY</span> u.name
<span class="sql-keyword">ORDER BY</span> 合計金額 <span class="sql-keyword">DESC</span>;</code></pre>
    `,
    exercises: [
      {
        id: "junction-1",
        question: "orders・order_details・productsを結合して、注文ID・商品名・数量・単価を取得してください",
        hint: "orders o JOIN order_details od ON o.id = od.order_id JOIN products p ON od.product_id = p.id",
        answer: "SELECT o.id, p.name, od.quantity, od.price FROM orders o JOIN order_details od ON o.id = od.order_id JOIN products p ON od.product_id = p.id",
        expectedColumns: ["id", "name", "quantity", "price"],
      },
      {
        id: "junction-2",
        question: "order_detailsとproductsを使って、'Laptop' が含まれる注文のorder_idを取得してください",
        hint: "JOIN products p ON od.product_id = p.id WHERE p.name = 'Laptop'",
        answer: "SELECT od.order_id FROM order_details od JOIN products p ON od.product_id = p.id WHERE p.name = 'Laptop'",
        expectedColumns: ["order_id"],
      },
      {
        id: "junction-3",
        question: "ユーザーごとの合計購入金額（price × quantity の合計）を求めて、金額の高い順に表示してください",
        hint: "SUM(od.price * od.quantity) AS 合計金額、GROUP BY u.name",
        answer: "SELECT u.name, SUM(od.price * od.quantity) AS 合計金額 FROM orders o JOIN users u ON o.user_id = u.id JOIN order_details od ON o.id = od.order_id GROUP BY u.name ORDER BY 合計金額 DESC",
        expectedColumns: ["name", "合計金額"],
      },
    ],
  },
];

export function getLessonBySlug(slug: string): Lesson | undefined {
  return LESSONS.find((l) => l.slug === slug);
}

export function getLessonsByLevel(level: "beginner" | "intermediate"): Lesson[] {
  return LESSONS.filter((l) => l.level === level).sort((a, b) => a.order - b.order);
}
