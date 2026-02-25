import type { Lesson } from "@/types";

// ブラウザで実行されるサンプルデータベースの初期化SQL
export const SAMPLE_DB_SQL = `
CREATE TABLE IF NOT EXISTS departments (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT
);
CREATE TABLE IF NOT EXISTS employees (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  department_id INTEGER,
  salary INTEGER,
  hire_date TEXT,
  FOREIGN KEY (department_id) REFERENCES departments(id)
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
  product_id INTEGER,
  quantity INTEGER,
  order_date TEXT,
  customer_name TEXT,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT OR IGNORE INTO departments VALUES
  (1, '営業部', '東京'),
  (2, '開発部', '大阪'),
  (3, '人事部', '東京'),
  (4, '経理部', '名古屋'),
  (5, 'マーケティング部', '東京');

INSERT OR IGNORE INTO employees VALUES
  (1, '田中 太郎', 1, 450000, '2020-04-01'),
  (2, '鈴木 花子', 2, 520000, '2019-07-15'),
  (3, '佐藤 次郎', 2, 480000, '2021-01-10'),
  (4, '山田 美咲', 3, 380000, '2022-04-01'),
  (5, '中村 健一', 1, 550000, '2018-10-01'),
  (6, '小林 さくら', 4, 420000, '2020-09-01'),
  (7, '加藤 雄一', 2, 600000, '2017-04-01'),
  (8, '吉田 陽子', 5, 460000, '2021-07-01'),
  (9, '渡辺 勇', 1, 390000, '2023-04-01'),
  (10, '松本 智子', 3, 410000, '2019-04-01'),
  (11, '井上 拓也', 2, 530000, '2020-01-15'),
  (12, '木村 麻衣', 5, 440000, '2022-10-01'),
  (13, '林 浩二', 4, 470000, '2018-07-01'),
  (14, '清水 奈々', 1, 360000, '2023-10-01'),
  (15, '山口 博', 2, 580000, '2016-04-01');

INSERT OR IGNORE INTO products VALUES
  (1, 'ノートPC', 'パソコン', 120000, 50),
  (2, 'マウス', '周辺機器', 3500, 200),
  (3, 'キーボード', '周辺機器', 8000, 150),
  (4, 'モニター', 'ディスプレイ', 45000, 30),
  (5, 'USBハブ', '周辺機器', 2500, 300),
  (6, 'デスクトップPC', 'パソコン', 180000, 20),
  (7, 'ヘッドセット', '周辺機器', 12000, 80),
  (8, 'Webカメラ', '周辺機器', 7500, 60),
  (9, 'タブレット', 'パソコン', 65000, 40),
  (10, 'プリンター', '周辺機器', 25000, 25);

INSERT OR IGNORE INTO orders VALUES
  (1, 1, 2, '2024-01-15', '株式会社ABC'),
  (2, 2, 10, '2024-01-20', '田中商事'),
  (3, 3, 5, '2024-02-01', '鈴木工業'),
  (4, 1, 1, '2024-02-10', '山田商店'),
  (5, 4, 3, '2024-02-15', '株式会社XYZ'),
  (6, 5, 20, '2024-03-01', '佐藤商会'),
  (7, 2, 15, '2024-03-10', '中村企業'),
  (8, 7, 4, '2024-03-15', '小林商店'),
  (9, 1, 3, '2024-04-01', '加藤株式会社'),
  (10, 9, 2, '2024-04-10', '吉田商事'),
  (11, 3, 8, '2024-04-20', '渡辺工業'),
  (12, 6, 1, '2024-05-01', '松本商会'),
  (13, 4, 2, '2024-05-10', '井上企業'),
  (14, 8, 6, '2024-05-20', '木村商店'),
  (15, 10, 3, '2024-06-01', '林商事');
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

<pre><code>┌─────┬──────────┬────────────┬──────────┐
│ id  │ name     │ department │ salary   │
├─────┼──────────┼────────────┼──────────┤
│  1  │ 田中太郎  │ 営業部      │ 450000   │
│  2  │ 鈴木花子  │ 開発部      │ 520000   │
└─────┴──────────┴────────────┴──────────┘</code></pre>

<h2>このサイトで使うテーブル</h2>
<p>このサイトでは以下の4つのテーブルを使って学習します：</p>
<ul>
  <li><code>employees</code> — 従業員テーブル（15名のデータ）</li>
  <li><code>departments</code> — 部署テーブル（5部署）</li>
  <li><code>products</code> — 商品テーブル（10商品）</li>
  <li><code>orders</code> — 注文テーブル（15件）</li>
</ul>

<p>右のエディタで以下のSQLを実行してみましょう：</p>
<pre><code class="sql-example">SELECT * FROM employees;</code></pre>
    `,
    exercises: [
      {
        id: "intro-1",
        question: "departmentsテーブルの全データを取得してください",
        hint: "SELECT * FROM テーブル名; で全データを取得できます",
        answer: "SELECT * FROM departments",
        expectedColumns: ["id", "name", "location"],
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
        expectedColumns: ["id", "product_id", "quantity", "order_date", "customer_name"],
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

<pre><code><span class="sql-keyword">SELECT</span> name, salary <span class="sql-keyword">FROM</span> employees;</code></pre>

<h2>全カラムを取得（アスタリスク）</h2>
<p><code>*</code>（アスタリスク）を使うと全カラムを取得できます。</p>

<pre><code><span class="sql-keyword">SELECT</span> * <span class="sql-keyword">FROM</span> employees;</code></pre>

<h2>カラムに別名をつける（AS）</h2>
<p><code>AS</code> を使ってカラムに別名（エイリアス）をつけられます。</p>

<pre><code><span class="sql-keyword">SELECT</span> name <span class="sql-keyword">AS</span> 氏名, salary <span class="sql-keyword">AS</span> 給与 <span class="sql-keyword">FROM</span> employees;</code></pre>

<h2>重複を除いて取得（DISTINCT）</h2>
<p><code>DISTINCT</code> を使うと重複した値を除いて取得できます。</p>

<pre><code><span class="sql-keyword">SELECT DISTINCT</span> category <span class="sql-keyword">FROM</span> products;</code></pre>
    `,
    exercises: [
      {
        id: "select-1",
        question: "employeesテーブルから name と salary の2カラムだけ取得してください",
        hint: "SELECT カラム1, カラム2 FROM テーブル名",
        answer: "SELECT name, salary FROM employees",
        expectedColumns: ["name", "salary"],
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

<pre><code><span class="sql-keyword">SELECT</span> * <span class="sql-keyword">FROM</span> employees <span class="sql-keyword">WHERE</span> salary > <span class="sql-number">500000</span>;</code></pre>

<h2>比較演算子</h2>
<table>
  <tr><th>演算子</th><th>意味</th><th>例</th></tr>
  <tr><td>=</td><td>等しい</td><td>department_id = 2</td></tr>
  <tr><td>!=, &lt;&gt;</td><td>等しくない</td><td>salary != 0</td></tr>
  <tr><td>&gt;</td><td>より大きい</td><td>salary &gt; 500000</td></tr>
  <tr><td>&gt;=</td><td>以上</td><td>salary &gt;= 500000</td></tr>
  <tr><td>&lt;</td><td>より小さい</td><td>salary &lt; 400000</td></tr>
  <tr><td>&lt;=</td><td>以下</td><td>salary &lt;= 400000</td></tr>
</table>

<h2>文字列の条件</h2>
<p>文字列はシングルクォートで囲みます。</p>
<pre><code><span class="sql-keyword">SELECT</span> * <span class="sql-keyword">FROM</span> departments <span class="sql-keyword">WHERE</span> location = <span class="sql-string">'東京'</span>;</code></pre>

<h2>AND・OR で複数条件</h2>
<pre><code><span class="sql-keyword">SELECT</span> * <span class="sql-keyword">FROM</span> employees
<span class="sql-keyword">WHERE</span> department_id = <span class="sql-number">2</span> <span class="sql-keyword">AND</span> salary >= <span class="sql-number">500000</span>;</code></pre>

<h2>LIKE であいまい検索</h2>
<p><code>%</code> は任意の文字列、<code>_</code> は任意の1文字を表します。</p>
<pre><code><span class="sql-keyword">SELECT</span> * <span class="sql-keyword">FROM</span> employees <span class="sql-keyword">WHERE</span> name <span class="sql-keyword">LIKE</span> <span class="sql-string">'田%'</span>;</code></pre>

<h2>IN で複数値の指定</h2>
<pre><code><span class="sql-keyword">SELECT</span> * <span class="sql-keyword">FROM</span> employees <span class="sql-keyword">WHERE</span> department_id <span class="sql-keyword">IN</span> (<span class="sql-number">1</span>, <span class="sql-number">2</span>);</code></pre>

<h2>BETWEEN で範囲指定</h2>
<pre><code><span class="sql-keyword">SELECT</span> * <span class="sql-keyword">FROM</span> employees <span class="sql-keyword">WHERE</span> salary <span class="sql-keyword">BETWEEN</span> <span class="sql-number">400000</span> <span class="sql-keyword">AND</span> <span class="sql-number">500000</span>;</code></pre>
    `,
    exercises: [
      {
        id: "where-1",
        question: "employeesテーブルから salary が 500000 以上の従業員を取得してください",
        hint: "WHERE salary >= 500000 を使います",
        answer: "SELECT * FROM employees WHERE salary >= 500000",
        expectedColumns: ["id", "name", "department_id", "salary", "hire_date"],
      },
      {
        id: "where-2",
        question: "departmentsテーブルから location が '東京' の部署を取得してください",
        hint: "WHERE location = '東京'",
        answer: "SELECT * FROM departments WHERE location = '東京'",
        expectedColumns: ["id", "name", "location"],
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

<pre><code><span class="sql-keyword">SELECT</span> * <span class="sql-keyword">FROM</span> employees <span class="sql-keyword">ORDER BY</span> salary <span class="sql-keyword">DESC</span>;</code></pre>

<ul>
  <li><code>ASC</code>（昇順）：小さい順・古い順（デフォルト）</li>
  <li><code>DESC</code>（降順）：大きい順・新しい順</li>
</ul>

<h2>複数カラムで並び替え</h2>
<pre><code><span class="sql-keyword">SELECT</span> * <span class="sql-keyword">FROM</span> employees
<span class="sql-keyword">ORDER BY</span> department_id <span class="sql-keyword">ASC</span>, salary <span class="sql-keyword">DESC</span>;</code></pre>

<h2>LIMIT で件数を制限</h2>
<p>取得する件数を制限するには <code>LIMIT</code> を使います。</p>

<pre><code><span class="sql-keyword">SELECT</span> * <span class="sql-keyword">FROM</span> employees <span class="sql-keyword">LIMIT</span> <span class="sql-number">5</span>;</code></pre>

<h2>OFFSET でスキップ</h2>
<p><code>OFFSET</code> で先頭から何件スキップするかを指定できます（ページネーションに使用）。</p>
<pre><code><span class="sql-keyword">SELECT</span> * <span class="sql-keyword">FROM</span> employees <span class="sql-keyword">LIMIT</span> <span class="sql-number">5</span> <span class="sql-keyword">OFFSET</span> <span class="sql-number">5</span>;</code></pre>

<h2>WHERE + ORDER BY + LIMIT の組み合わせ</h2>
<pre><code><span class="sql-keyword">SELECT</span> name, salary <span class="sql-keyword">FROM</span> employees
<span class="sql-keyword">WHERE</span> department_id = <span class="sql-number">2</span>
<span class="sql-keyword">ORDER BY</span> salary <span class="sql-keyword">DESC</span>
<span class="sql-keyword">LIMIT</span> <span class="sql-number">3</span>;</code></pre>
    `,
    exercises: [
      {
        id: "order-1",
        question: "employeesテーブルをsalaryの降順（高い順）で取得してください",
        hint: "ORDER BY salary DESC",
        answer: "SELECT * FROM employees ORDER BY salary DESC",
        expectedColumns: ["id", "name", "department_id", "salary", "hire_date"],
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
        question: "employeesテーブルからsalaryが最も高い3名のname と salary を取得してください",
        hint: "ORDER BY salary DESC LIMIT 3",
        answer: "SELECT name, salary FROM employees ORDER BY salary DESC LIMIT 3",
        expectedColumns: ["name", "salary"],
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

<pre><code><span class="sql-keyword">INSERT INTO</span> departments (id, name, location)
<span class="sql-keyword">VALUES</span> (<span class="sql-number">6</span>, <span class="sql-string">'法務部'</span>, <span class="sql-string">'東京'</span>);</code></pre>

<h2>UPDATE でデータを更新</h2>
<p>既存のデータを更新するには <code>UPDATE</code> を使います。<strong>WHERE を忘れると全行が更新されるので注意！</strong></p>

<pre><code><span class="sql-keyword">UPDATE</span> employees
<span class="sql-keyword">SET</span> salary = <span class="sql-number">500000</span>
<span class="sql-keyword">WHERE</span> id = <span class="sql-number">1</span>;</code></pre>

<h2>DELETE でデータを削除</h2>
<p>データを削除するには <code>DELETE FROM</code> を使います。<strong>WHERE を忘れると全行が削除されるので注意！</strong></p>

<pre><code><span class="sql-keyword">DELETE FROM</span> departments
<span class="sql-keyword">WHERE</span> id = <span class="sql-number">6</span>;</code></pre>

<h2>実行順序の例</h2>
<pre><code><span class="sql-comment">-- 1. まず追加</span>
<span class="sql-keyword">INSERT INTO</span> departments (id, name, location) <span class="sql-keyword">VALUES</span> (<span class="sql-number">6</span>, <span class="sql-string">'法務部'</span>, <span class="sql-string">'東京'</span>);
<span class="sql-comment">-- 2. 確認</span>
<span class="sql-keyword">SELECT</span> * <span class="sql-keyword">FROM</span> departments;
<span class="sql-comment">-- 3. 更新</span>
<span class="sql-keyword">UPDATE</span> departments <span class="sql-keyword">SET</span> location = <span class="sql-string">'大阪'</span> <span class="sql-keyword">WHERE</span> id = <span class="sql-number">6</span>;
<span class="sql-comment">-- 4. 削除</span>
<span class="sql-keyword">DELETE FROM</span> departments <span class="sql-keyword">WHERE</span> id = <span class="sql-number">6</span>;</code></pre>
    `,
    exercises: [
      {
        id: "dml-1",
        question: "departmentsテーブルに id=6, name='法務部', location='東京' のデータを追加して、全データを確認してください",
        hint: "INSERT INTO departments (id, name, location) VALUES (6, '法務部', '東京'); SELECT * FROM departments;",
        answer: "INSERT INTO departments (id, name, location) VALUES (6, '法務部', '東京'); SELECT * FROM departments;",
        expectedColumns: ["id", "name", "location"],
      },
      {
        id: "dml-2",
        question: "id=1の従業員のsalaryを500000に更新し、その従業員のデータを確認してください",
        hint: "UPDATE employees SET salary = 500000 WHERE id = 1;",
        answer: "UPDATE employees SET salary = 500000 WHERE id = 1; SELECT * FROM employees WHERE id = 1;",
        expectedColumns: ["id", "name", "department_id", "salary", "hire_date"],
      },
      {
        id: "dml-3",
        question: "先ほど追加した id=6 の部署を削除して、全部署を確認してください",
        hint: "DELETE FROM departments WHERE id = 6;",
        answer: "DELETE FROM departments WHERE id = 6; SELECT * FROM departments;",
        expectedColumns: ["id", "name", "location"],
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

<pre><code><span class="sql-keyword">SELECT</span> e.name, d.name <span class="sql-keyword">AS</span> department
<span class="sql-keyword">FROM</span> employees e
<span class="sql-keyword">INNER JOIN</span> departments d <span class="sql-keyword">ON</span> e.department_id = d.id;</code></pre>

<h2>LEFT JOIN（左外部結合）</h2>
<p>左テーブルの全データ + 右テーブルの一致データを取得。一致しない場合はNULL。</p>

<pre><code><span class="sql-keyword">SELECT</span> e.name, d.name <span class="sql-keyword">AS</span> department
<span class="sql-keyword">FROM</span> employees e
<span class="sql-keyword">LEFT JOIN</span> departments d <span class="sql-keyword">ON</span> e.department_id = d.id;</code></pre>

<h2>テーブルエイリアス（別名）</h2>
<p>テーブル名が長い場合、短い別名をつけると便利です。</p>
<pre><code><span class="sql-comment">-- e が employees、d が departments の別名</span>
<span class="sql-keyword">SELECT</span> e.name, e.salary, d.name <span class="sql-keyword">AS</span> dept
<span class="sql-keyword">FROM</span> employees e
<span class="sql-keyword">JOIN</span> departments d <span class="sql-keyword">ON</span> e.department_id = d.id
<span class="sql-keyword">ORDER BY</span> e.salary <span class="sql-keyword">DESC</span>;</code></pre>

<h2>3テーブルのJOIN</h2>
<pre><code><span class="sql-keyword">SELECT</span> o.id, p.name, o.quantity, o.customer_name
<span class="sql-keyword">FROM</span> orders o
<span class="sql-keyword">JOIN</span> products p <span class="sql-keyword">ON</span> o.product_id = p.id
<span class="sql-keyword">ORDER BY</span> o.order_date;</code></pre>
    `,
    exercises: [
      {
        id: "join-1",
        question: "employeesとdepartmentsをJOINして、従業員名と部署名を取得してください",
        hint: "JOIN departments d ON e.department_id = d.id",
        answer: "SELECT e.name, d.name AS department FROM employees e JOIN departments d ON e.department_id = d.id",
        expectedColumns: ["name", "department"],
      },
      {
        id: "join-2",
        question: "ordersとproductsをJOINして、注文ID・商品名・数量・顧客名を取得してください",
        hint: "orders o JOIN products p ON o.product_id = p.id",
        answer: "SELECT o.id, p.name, o.quantity, o.customer_name FROM orders o JOIN products p ON o.product_id = p.id",
        expectedColumns: ["id", "name", "quantity", "customer_name"],
      },
      {
        id: "join-3",
        question: "開発部（id=2）の従業員名と給与を、部署名と一緒に取得してください",
        hint: "JOIN後にWHERE d.id = 2 または WHERE d.name = '開発部'",
        answer: "SELECT e.name, e.salary, d.name AS department FROM employees e JOIN departments d ON e.department_id = d.id WHERE d.id = 2",
        expectedColumns: ["name", "salary", "department"],
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

<pre><code><span class="sql-keyword">SELECT</span> department_id, <span class="sql-function">COUNT</span>(*) <span class="sql-keyword">AS</span> 人数
<span class="sql-keyword">FROM</span> employees
<span class="sql-keyword">GROUP BY</span> department_id;</code></pre>

<h2>複数の集計関数</h2>
<pre><code><span class="sql-keyword">SELECT</span> department_id,
       <span class="sql-function">COUNT</span>(*) <span class="sql-keyword">AS</span> 人数,
       <span class="sql-function">AVG</span>(salary) <span class="sql-keyword">AS</span> 平均給与,
       <span class="sql-function">MAX</span>(salary) <span class="sql-keyword">AS</span> 最高給与
<span class="sql-keyword">FROM</span> employees
<span class="sql-keyword">GROUP BY</span> department_id;</code></pre>

<h2>HAVING でグループに条件をつける</h2>
<p><code>WHERE</code>はグループ化前、<code>HAVING</code>はグループ化後の絞り込みです。</p>

<pre><code><span class="sql-keyword">SELECT</span> department_id, <span class="sql-function">COUNT</span>(*) <span class="sql-keyword">AS</span> 人数
<span class="sql-keyword">FROM</span> employees
<span class="sql-keyword">GROUP BY</span> department_id
<span class="sql-keyword">HAVING</span> <span class="sql-function">COUNT</span>(*) >= <span class="sql-number">3</span>;</code></pre>

<h2>JOIN + GROUP BY</h2>
<pre><code><span class="sql-keyword">SELECT</span> d.name <span class="sql-keyword">AS</span> 部署名, <span class="sql-function">COUNT</span>(*) <span class="sql-keyword">AS</span> 人数, <span class="sql-function">AVG</span>(e.salary) <span class="sql-keyword">AS</span> 平均給与
<span class="sql-keyword">FROM</span> employees e
<span class="sql-keyword">JOIN</span> departments d <span class="sql-keyword">ON</span> e.department_id = d.id
<span class="sql-keyword">GROUP BY</span> d.name
<span class="sql-keyword">ORDER BY</span> 平均給与 <span class="sql-keyword">DESC</span>;</code></pre>
    `,
    exercises: [
      {
        id: "group-1",
        question: "employeesテーブルをdepartment_idでグループ化して、各部署の人数を取得してください",
        hint: "GROUP BY department_id で COUNT(*) を使います",
        answer: "SELECT department_id, COUNT(*) AS 人数 FROM employees GROUP BY department_id",
        expectedColumns: ["department_id", "人数"],
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
        question: "departmentsとemployeesをJOINして、部署名・人数・平均給与を取得し、人数が3人以上の部署だけ表示してください",
        hint: "JOIN後にGROUP BY d.name、HAVING COUNT(*) >= 3",
        answer: "SELECT d.name AS 部署名, COUNT(*) AS 人数, AVG(e.salary) AS 平均給与 FROM employees e JOIN departments d ON e.department_id = d.id GROUP BY d.name HAVING COUNT(*) >= 3",
        expectedColumns: ["部署名", "人数", "平均給与"],
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
<p>全従業員の平均給与より高い給与の従業員を取得：</p>
<pre><code><span class="sql-keyword">SELECT</span> name, salary
<span class="sql-keyword">FROM</span> employees
<span class="sql-keyword">WHERE</span> salary > (
    <span class="sql-keyword">SELECT</span> <span class="sql-function">AVG</span>(salary) <span class="sql-keyword">FROM</span> employees
);</code></pre>

<h2>INを使ったサブクエリ</h2>
<p>東京にある部署の従業員を取得：</p>
<pre><code><span class="sql-keyword">SELECT</span> name, department_id
<span class="sql-keyword">FROM</span> employees
<span class="sql-keyword">WHERE</span> department_id <span class="sql-keyword">IN</span> (
    <span class="sql-keyword">SELECT</span> id <span class="sql-keyword">FROM</span> departments <span class="sql-keyword">WHERE</span> location = <span class="sql-string">'東京'</span>
);</code></pre>

<h2>FROM句のサブクエリ（派生テーブル）</h2>
<pre><code><span class="sql-keyword">SELECT</span> dept_avg.department_id, dept_avg.avg_sal
<span class="sql-keyword">FROM</span> (
    <span class="sql-keyword">SELECT</span> department_id, <span class="sql-function">AVG</span>(salary) <span class="sql-keyword">AS</span> avg_sal
    <span class="sql-keyword">FROM</span> employees
    <span class="sql-keyword">GROUP BY</span> department_id
) dept_avg
<span class="sql-keyword">WHERE</span> dept_avg.avg_sal > <span class="sql-number">500000</span>;</code></pre>
    `,
    exercises: [
      {
        id: "sub-1",
        question: "全従業員の平均給与より高い給与を持つ従業員のnameとsalaryを取得してください",
        hint: "WHERE salary > (SELECT AVG(salary) FROM employees)",
        answer: "SELECT name, salary FROM employees WHERE salary > (SELECT AVG(salary) FROM employees)",
        expectedColumns: ["name", "salary"],
      },
      {
        id: "sub-2",
        question: "東京にある部署（departmentsテーブルで location='東京'）に所属する従業員を取得してください",
        hint: "WHERE department_id IN (SELECT id FROM departments WHERE location = '東京')",
        answer: "SELECT * FROM employees WHERE department_id IN (SELECT id FROM departments WHERE location = '東京')",
        expectedColumns: ["id", "name", "department_id", "salary", "hire_date"],
      },
      {
        id: "sub-3",
        question: "最も給与が高い従業員のname と salary を取得してください（サブクエリを使って）",
        hint: "WHERE salary = (SELECT MAX(salary) FROM employees)",
        answer: "SELECT name, salary FROM employees WHERE salary = (SELECT MAX(salary) FROM employees)",
        expectedColumns: ["name", "salary"],
      },
    ],
  },
  {
    slug: "index",
    title: "インデックスとパフォーマンス",
    level: "intermediate",
    order: 9,
    description: "SQLのパフォーマンス最適化とインデックスを学びます",
    content: `
<h2>インデックスとは？</h2>
<p>インデックスは本の索引のようなもので、データの検索を高速化します。</p>

<h2>インデックスの作成</h2>
<pre><code><span class="sql-comment">-- 単一カラムのインデックス</span>
<span class="sql-keyword">CREATE INDEX</span> idx_employees_salary <span class="sql-keyword">ON</span> employees(salary);

<span class="sql-comment">-- 複合インデックス</span>
<span class="sql-keyword">CREATE INDEX</span> idx_employees_dept_salary <span class="sql-keyword">ON</span> employees(department_id, salary);</code></pre>

<h2>インデックスが効果的な場合</h2>
<ul>
  <li>WHERE句で頻繁に使うカラム</li>
  <li>JOIN条件に使うカラム（外部キー）</li>
  <li>ORDER BY で頻繁に使うカラム</li>
</ul>

<h2>EXPLAIN でクエリを分析</h2>
<p>SQLiteでは <code>EXPLAIN QUERY PLAN</code> でクエリの実行計画を確認できます。</p>

<pre><code><span class="sql-keyword">EXPLAIN QUERY PLAN</span>
<span class="sql-keyword">SELECT</span> * <span class="sql-keyword">FROM</span> employees <span class="sql-keyword">WHERE</span> salary > <span class="sql-number">500000</span>;</code></pre>

<h2>パフォーマンスのベストプラクティス</h2>
<ul>
  <li><code>SELECT *</code> より必要なカラムだけを指定する</li>
  <li>N+1問題を避けてJOINを使う</li>
  <li>大量データには LIMIT を使う</li>
  <li>インデックスのあるカラムで絞り込む</li>
</ul>

<h2>インデックスの確認・削除</h2>
<pre><code><span class="sql-comment">-- インデックス一覧</span>
<span class="sql-keyword">SELECT</span> * <span class="sql-keyword">FROM</span> sqlite_master <span class="sql-keyword">WHERE</span> type = <span class="sql-string">'index'</span>;

<span class="sql-comment">-- インデックス削除</span>
<span class="sql-keyword">DROP INDEX</span> idx_employees_salary;</code></pre>
    `,
    exercises: [
      {
        id: "idx-1",
        question: "employeesテーブルのsalaryカラムにインデックス idx_emp_salary を作成し、SQLite_masterで確認してください",
        hint: "CREATE INDEX idx_emp_salary ON employees(salary); SELECT * FROM sqlite_master WHERE type='index';",
        answer: "CREATE INDEX idx_emp_salary ON employees(salary); SELECT * FROM sqlite_master WHERE type='index';",
        expectedColumns: ["type", "name", "tbl_name", "rootpage", "sql"],
      },
      {
        id: "idx-2",
        question: "EXPLAIN QUERY PLANを使って、salary > 500000 の検索計画を確認してください",
        hint: "EXPLAIN QUERY PLAN SELECT * FROM employees WHERE salary > 500000;",
        answer: "EXPLAIN QUERY PLAN SELECT * FROM employees WHERE salary > 500000;",
        expectedColumns: ["id", "parent", "notused", "detail"],
      },
      {
        id: "idx-3",
        question: "先ほど作成したインデックス idx_emp_salary を削除して、SQLite_masterで確認してください",
        hint: "DROP INDEX idx_emp_salary;",
        answer: "DROP INDEX idx_emp_salary; SELECT * FROM sqlite_master WHERE type='index';",
        expectedColumns: ["type", "name", "tbl_name", "rootpage", "sql"],
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
