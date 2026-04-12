import type { Lesson } from "@/types";

export function getPremiumLessonBySlug(slug: string): Lesson | undefined {
  return PREMIUM_LESSONS.find((l) => l.slug === slug);
}

export const PREMIUM_LESSONS: Lesson[] = [
  // ========= プレミアム初級コース =========
  {
    slug: "pb-null",
    title: "NULL値の扱い",
    level: "beginner",
    order: 1,
    description: "NULLの概念とIS NULL・COALESCE・NULLIFの使い方をusers・productsテーブルで学びます",
    content: `
<h2>NULLとは？</h2>
<p><strong>NULL</strong>は「値が存在しない」ことを表す特別な値です。0でも空文字でもなく、「不明・未入力」を意味します。</p>
<p>usersテーブルの <code>email</code> や <code>city</code>、productsテーブルの <code>stock</code> にNULLが含まれています。</p>

<h2>IS NULL / IS NOT NULL</h2>
<p>NULLかどうかの比較には <code>=</code> は使えません。<code>IS NULL</code> / <code>IS NOT NULL</code> を使います。</p>
<pre><code><span class="sql-keyword">SELECT</span> * <span class="sql-keyword">FROM</span> users <span class="sql-keyword">WHERE</span> email <span class="sql-keyword">IS NULL</span>;</code></pre>

<h2>COALESCE — NULLを別の値に置換</h2>
<p>引数の中で最初にNULLでない値を返します。</p>
<pre><code><span class="sql-keyword">SELECT</span> name, <span class="sql-function">COALESCE</span>(email, <span class="sql-string">'未登録'</span>) <span class="sql-keyword">AS</span> メール <span class="sql-keyword">FROM</span> users;</code></pre>

<h2>NULLIF — 条件が一致したらNULLを返す</h2>
<p>2つの値が等しい場合にNULLを返し、そうでなければ第1引数を返します。</p>
<pre><code><span class="sql-keyword">SELECT</span> name, <span class="sql-function">NULLIF</span>(stock, <span class="sql-number">0</span>) <span class="sql-keyword">AS</span> 在庫 <span class="sql-keyword">FROM</span> products;</code></pre>

<h2>IFNULL（SQLite専用）</h2>
<pre><code><span class="sql-keyword">SELECT</span> name, <span class="sql-function">IFNULL</span>(city, <span class="sql-string">'不明'</span>) <span class="sql-keyword">AS</span> 都市 <span class="sql-keyword">FROM</span> users;</code></pre>
    `,
    exercises: [
      {
        id: "pb-null-1",
        question: "usersテーブルからemailがNULLのユーザーのnameとemailを取得してください",
        hint: "WHERE email IS NULL",
        answer: "SELECT name, email FROM users WHERE email IS NULL",
        expectedColumns: ["name", "email"],
      },
      {
        id: "pb-null-2",
        question: "usersテーブルのnameとemailを取得し、emailがNULLの場合は「未登録」に置換して「メールアドレス」という列名で表示してください",
        hint: "COALESCE(email, '未登録') AS メールアドレス",
        answer: "SELECT name, COALESCE(email, '未登録') AS メールアドレス FROM users",
        expectedColumns: ["name", "メールアドレス"],
      },
      {
        id: "pb-null-3",
        question: "usersテーブルからcityがNULLでないユーザーのnameとcityをid順（昇順）で取得してください",
        hint: "WHERE city IS NOT NULL ORDER BY id ASC",
        answer: "SELECT name, city FROM users WHERE city IS NOT NULL ORDER BY id ASC",
        expectedColumns: ["name", "city"],
      },
      {
        id: "pb-null-4",
        question: "productsテーブルのnameとstockを取得し、stockがNULLの場合は0に置換して「在庫数」という列名で表示してください",
        hint: "COALESCE(stock, 0) AS 在庫数",
        answer: "SELECT name, COALESCE(stock, 0) AS 在庫数 FROM products",
        expectedColumns: ["name", "在庫数"],
      },
      {
        id: "pb-null-5",
        question: "NULLIF関数を使い、productsのstockが50の場合はNULLに変換し、nameとadjusted_stockとして取得してください",
        hint: "NULLIF(stock, 50) AS adjusted_stock",
        answer: "SELECT name, NULLIF(stock, 50) AS adjusted_stock FROM products",
        expectedColumns: ["name", "adjusted_stock"],
      },
    ],
  },
  {
    slug: "pb-string-functions",
    title: "文字列関数",
    level: "beginner",
    order: 2,
    description: "LENGTH・SUBSTR・REPLACE・INSTR・文字連結などの文字列操作をusers・productsテーブルで学びます",
    content: `
<h2>文字列関数一覧</h2>
<table>
  <tr><th>関数</th><th>説明</th><th>例</th></tr>
  <tr><td>LENGTH(s)</td><td>文字数を返す</td><td>LENGTH('田中 太郎') → 5</td></tr>
  <tr><td>SUBSTR(s,n,len)</td><td>部分文字列を取得</td><td>SUBSTR('田中 太郎',1,2) → '田中'</td></tr>
  <tr><td>REPLACE(s,old,new)</td><td>文字列を置換</td><td>REPLACE('田中 太郎',' ','')</td></tr>
  <tr><td>INSTR(s,sub)</td><td>部分文字列の位置</td><td>INSTR('Laptop','op') → 4</td></tr>
  <tr><td>s1 || s2</td><td>文字連結</td><td>'PC' || '-' || 'Laptop'</td></tr>
  <tr><td>TRIM(s)</td><td>前後の空白を除去</td><td>TRIM(' abc ') → 'abc'</td></tr>
</table>

<h2>使用例</h2>
<pre><code><span class="sql-comment">-- 名前の文字数を取得</span>
<span class="sql-keyword">SELECT</span> name, <span class="sql-function">LENGTH</span>(name) <span class="sql-keyword">AS</span> 文字数 <span class="sql-keyword">FROM</span> users;

<span class="sql-comment">-- 商品名とカテゴリを連結</span>
<span class="sql-keyword">SELECT</span> name <span class="sql-keyword">||</span> <span class="sql-string">' ['</span> <span class="sql-keyword">||</span> category <span class="sql-keyword">||</span> <span class="sql-string">']'</span> <span class="sql-keyword">AS</span> 商品情報 <span class="sql-keyword">FROM</span> products;

<span class="sql-comment">-- スペースを除去</span>
<span class="sql-keyword">SELECT</span> <span class="sql-function">REPLACE</span>(name, <span class="sql-string">' '</span>, <span class="sql-string">''</span>) <span class="sql-keyword">AS</span> 連続名 <span class="sql-keyword">FROM</span> users;</code></pre>
    `,
    exercises: [
      {
        id: "pb-str-1",
        question: "usersテーブルのnameと、nameの文字数を「文字数」という列名で取得してください",
        hint: "LENGTH(name) AS 文字数",
        answer: "SELECT name, LENGTH(name) AS 文字数 FROM users",
        expectedColumns: ["name", "文字数"],
      },
      {
        id: "pb-str-2",
        question: "usersテーブルのnameから最初の2文字をSUBSTRで取得し、「苗字」として表示してください",
        hint: "SUBSTR(name, 1, 2) AS 苗字",
        answer: "SELECT name, SUBSTR(name, 1, 2) AS 苗字 FROM users",
        expectedColumns: ["name", "苗字"],
      },
      {
        id: "pb-str-3",
        question: "usersテーブルのnameのスペースをREPLACEで除去し、「連続名」として表示してください",
        hint: "REPLACE(name, ' ', '') AS 連続名",
        answer: "SELECT name, REPLACE(name, ' ', '') AS 連続名 FROM users",
        expectedColumns: ["name", "連続名"],
      },
      {
        id: "pb-str-4",
        question: "productsテーブルのnameとcategoryを「 [」と「]」で囲んで連結し、「商品情報」として取得してください（例: Laptop [PC]）",
        hint: "name || ' [' || category || ']' AS 商品情報",
        answer: "SELECT name || ' [' || category || ']' AS 商品情報 FROM products",
        expectedColumns: ["商品情報"],
      },
      {
        id: "pb-str-5",
        question: "productsテーブルのnameから「op」という文字列の開始位置をINSTRで取得し、nameと「位置」として表示してください",
        hint: "INSTR(name, 'op') AS 位置",
        answer: "SELECT name, INSTR(name, 'op') AS 位置 FROM products",
        expectedColumns: ["name", "位置"],
      },
    ],
  },
  {
    slug: "pb-numeric-functions",
    title: "数値関数",
    level: "beginner",
    order: 3,
    description: "ROUND・ABS・CAST・算術演算などの数値操作をproducts・order_productsテーブルで学びます",
    content: `
<h2>数値関数一覧</h2>
<table>
  <tr><th>関数</th><th>説明</th></tr>
  <tr><td>ROUND(n, d)</td><td>小数点d桁で四捨五入</td></tr>
  <tr><td>ABS(n)</td><td>絶対値を返す</td></tr>
  <tr><td>CAST(n AS type)</td><td>型変換（INTEGER, REAL, TEXT）</td></tr>
  <tr><td>n % m</td><td>余り（剰余）</td></tr>
  <tr><td>n / m</td><td>除算（整数 ÷ 整数 = 整数）</td></tr>
  <tr><td>n * 1.0</td><td>小数除算のための実数変換</td></tr>
</table>

<h2>使用例</h2>
<pre><code><span class="sql-comment">-- 価格を千円単位に丸める</span>
<span class="sql-keyword">SELECT</span> name, <span class="sql-function">ROUND</span>(price / <span class="sql-number">1000.0</span>, <span class="sql-number">1</span>) <span class="sql-keyword">AS</span> 価格_千円 <span class="sql-keyword">FROM</span> products;

<span class="sql-comment">-- 10万円との差の絶対値</span>
<span class="sql-keyword">SELECT</span> name, <span class="sql-function">ABS</span>(price - <span class="sql-number">100000</span>) <span class="sql-keyword">AS</span> 差額 <span class="sql-keyword">FROM</span> products;

<span class="sql-comment">-- 消費税込み価格（整数に変換）</span>
<span class="sql-keyword">SELECT</span> name, <span class="sql-function">CAST</span>(price * <span class="sql-number">1.1</span> <span class="sql-keyword">AS INTEGER</span>) <span class="sql-keyword">AS</span> 税込価格 <span class="sql-keyword">FROM</span> products;</code></pre>
    `,
    exercises: [
      {
        id: "pb-num-1",
        question: "productsテーブルのnameと、priceを1000で割って小数点以下1桁に丸めた「価格_千円」を取得してください",
        hint: "ROUND(price / 1000.0, 1) AS 価格_千円",
        answer: "SELECT name, ROUND(price / 1000.0, 1) AS 価格_千円 FROM products",
        expectedColumns: ["name", "価格_千円"],
      },
      {
        id: "pb-num-2",
        question: "productsテーブルのnameと、priceと100000との差の絶対値を「差額」として取得してください",
        hint: "ABS(price - 100000) AS 差額",
        answer: "SELECT name, ABS(price - 100000) AS 差額 FROM products",
        expectedColumns: ["name", "差額"],
      },
      {
        id: "pb-num-3",
        question: "order_productsテーブルのidとquantityと、quantityを3で割った余りを「余り」として取得してください",
        hint: "quantity % 3 AS 余り",
        answer: "SELECT id, quantity, quantity % 3 AS 余り FROM order_products",
        expectedColumns: ["id", "quantity", "余り"],
      },
      {
        id: "pb-num-4",
        question: "productsテーブルのnameと、消費税10%込みの価格をROUNDして整数にした「税込価格」を取得してください",
        hint: "ROUND(price * 1.1) AS 税込価格",
        answer: "SELECT name, ROUND(price * 1.1) AS 税込価格 FROM products",
        expectedColumns: ["name", "税込価格"],
      },
      {
        id: "pb-num-5",
        question: "order_productsテーブルのidとprice・quantityと、price×quantityをCAST(AS INTEGER)した「小計」を取得してください",
        hint: "CAST(price * quantity AS INTEGER) AS 小計",
        answer: "SELECT id, price, quantity, CAST(price * quantity AS INTEGER) AS 小計 FROM order_products",
        expectedColumns: ["id", "price", "quantity", "小計"],
      },
    ],
  },
  {
    slug: "pb-date-functions",
    title: "日付・時刻関数",
    level: "beginner",
    order: 4,
    description: "strftime・date関数などを使ってorders.order_dateを操作する方法を学びます",
    content: `
<h2>SQLiteの日付関数</h2>
<p>SQLiteでは日付を文字列（'YYYY-MM-DD'形式）で扱います。<code>strftime</code> 関数で書式変換や部分取得ができます。</p>

<table>
  <tr><th>関数</th><th>説明</th><th>例</th></tr>
  <tr><td>strftime('%Y', date)</td><td>年を取得</td><td>'2024'</td></tr>
  <tr><td>strftime('%m', date)</td><td>月を取得（01〜12）</td><td>'01'</td></tr>
  <tr><td>strftime('%d', date)</td><td>日を取得（01〜31）</td><td>'15'</td></tr>
  <tr><td>date(date, '+N days')</td><td>N日後の日付</td><td>date('2024-01-15', '+7 days')</td></tr>
  <tr><td>date('now')</td><td>現在の日付</td><td>'2026-04-12'</td></tr>
</table>

<h2>使用例</h2>
<pre><code><span class="sql-comment">-- 年と月を取得</span>
<span class="sql-keyword">SELECT</span> id, order_date,
  <span class="sql-function">strftime</span>(<span class="sql-string">'%Y'</span>, order_date) <span class="sql-keyword">AS</span> 年,
  <span class="sql-function">strftime</span>(<span class="sql-string">'%m'</span>, order_date) <span class="sql-keyword">AS</span> 月
<span class="sql-keyword">FROM</span> orders;

<span class="sql-comment">-- 特定の月の注文を取得</span>
<span class="sql-keyword">SELECT</span> * <span class="sql-keyword">FROM</span> orders
<span class="sql-keyword">WHERE</span> <span class="sql-function">strftime</span>(<span class="sql-string">'%m'</span>, order_date) = <span class="sql-string">'01'</span>;</code></pre>
    `,
    exercises: [
      {
        id: "pb-date-1",
        question: "ordersテーブルのidとorder_dateと、order_dateから年を取得した「年」を表示してください",
        hint: "strftime('%Y', order_date) AS 年",
        answer: "SELECT id, order_date, strftime('%Y', order_date) AS 年 FROM orders",
        expectedColumns: ["id", "order_date", "年"],
      },
      {
        id: "pb-date-2",
        question: "ordersテーブルのidとorder_dateと、order_dateから月を取得した「月」を表示してください",
        hint: "strftime('%m', order_date) AS 月",
        answer: "SELECT id, order_date, strftime('%m', order_date) AS 月 FROM orders",
        expectedColumns: ["id", "order_date", "月"],
      },
      {
        id: "pb-date-3",
        question: "ordersテーブルから2024年2月（order_dateが'2024-02'で始まる）の注文のidとorder_dateとstatusを取得してください",
        hint: "WHERE order_date LIKE '2024-02%'",
        answer: "SELECT id, order_date, status FROM orders WHERE order_date LIKE '2024-02%'",
        expectedColumns: ["id", "order_date", "status"],
      },
      {
        id: "pb-date-4",
        question: "ordersテーブルのidとorder_dateと、30日後の日付を「期限日」として取得してください",
        hint: "date(order_date, '+30 days') AS 期限日",
        answer: "SELECT id, order_date, date(order_date, '+30 days') AS 期限日 FROM orders",
        expectedColumns: ["id", "order_date", "期限日"],
      },
      {
        id: "pb-date-5",
        question: "ordersテーブルのidとorder_dateを取得し、order_dateの新しい順（降順）に並べてください",
        hint: "ORDER BY order_date DESC",
        answer: "SELECT id, order_date FROM orders ORDER BY order_date DESC",
        expectedColumns: ["id", "order_date"],
      },
    ],
  },
  {
    slug: "pb-case",
    title: "CASE式",
    level: "beginner",
    order: 5,
    description: "CASE WHEN構文を使ってproducts.price・orders.statusを条件分岐で変換する方法を学びます",
    content: `
<h2>CASE式とは</h2>
<p>SQLの <code>CASE</code> 式は、条件に応じて異なる値を返します。プログラミングのif-else文に相当します。</p>

<h2>基本構文（検索CASE）</h2>
<pre><code><span class="sql-keyword">SELECT</span> name,
  <span class="sql-keyword">CASE</span>
    <span class="sql-keyword">WHEN</span> price >= <span class="sql-number">100000</span> <span class="sql-keyword">THEN</span> <span class="sql-string">'高額'</span>
    <span class="sql-keyword">WHEN</span> price >= <span class="sql-number">10000</span>  <span class="sql-keyword">THEN</span> <span class="sql-string">'中額'</span>
    <span class="sql-keyword">ELSE</span> <span class="sql-string">'低額'</span>
  <span class="sql-keyword">END</span> <span class="sql-keyword">AS</span> 価格帯
<span class="sql-keyword">FROM</span> products;</code></pre>

<h2>単純CASE</h2>
<pre><code><span class="sql-keyword">SELECT</span> id, status,
  <span class="sql-keyword">CASE</span> status
    <span class="sql-keyword">WHEN</span> <span class="sql-string">'completed'</span> <span class="sql-keyword">THEN</span> <span class="sql-string">'完了'</span>
    <span class="sql-keyword">WHEN</span> <span class="sql-string">'pending'</span>   <span class="sql-keyword">THEN</span> <span class="sql-string">'保留'</span>
    <span class="sql-keyword">WHEN</span> <span class="sql-string">'cancelled'</span> <span class="sql-keyword">THEN</span> <span class="sql-string">'キャンセル'</span>
    <span class="sql-keyword">ELSE</span> <span class="sql-string">'不明'</span>
  <span class="sql-keyword">END</span> <span class="sql-keyword">AS</span> ステータス
<span class="sql-keyword">FROM</span> orders;</code></pre>
    `,
    exercises: [
      {
        id: "pb-case-1",
        question: "productsテーブルのnameとpriceと、price >= 100000なら「高額」、price >= 10000なら「中額」、それ以外は「低額」という「価格帯」列を取得してください",
        hint: "CASE WHEN price >= 100000 THEN '高額' WHEN price >= 10000 THEN '中額' ELSE '低額' END AS 価格帯",
        answer: "SELECT name, price, CASE WHEN price >= 100000 THEN '高額' WHEN price >= 10000 THEN '中額' ELSE '低額' END AS 価格帯 FROM products",
        expectedColumns: ["name", "price", "価格帯"],
      },
      {
        id: "pb-case-2",
        question: "ordersテーブルのidとstatusと、statusが'completed'なら「完了」、'pending'なら「保留」、'cancelled'なら「キャンセル」という「状態」列を取得してください",
        hint: "CASE status WHEN 'completed' THEN '完了' WHEN 'pending' THEN '保留' WHEN 'cancelled' THEN 'キャンセル' END AS 状態",
        answer: "SELECT id, status, CASE status WHEN 'completed' THEN '完了' WHEN 'pending' THEN '保留' WHEN 'cancelled' THEN 'キャンセル' END AS 状態 FROM orders",
        expectedColumns: ["id", "status", "状態"],
      },
      {
        id: "pb-case-3",
        question: "productsテーブルのnameとcategoryと、categoryが'PC'なら「パソコン」、'Accessory'なら「周辺機器」、それ以外は「その他」という「カテゴリ日本語」列を取得してください",
        hint: "CASE category WHEN 'PC' THEN 'パソコン' WHEN 'Accessory' THEN '周辺機器' ELSE 'その他' END AS カテゴリ日本語",
        answer: "SELECT name, category, CASE category WHEN 'PC' THEN 'パソコン' WHEN 'Accessory' THEN '周辺機器' ELSE 'その他' END AS カテゴリ日本語 FROM products",
        expectedColumns: ["name", "category", "カテゴリ日本語"],
      },
      {
        id: "pb-case-4",
        question: "usersテーブルのnameとcityと、cityが'東京'なら「首都圏」、'大阪'または'名古屋'なら「主要都市」、NULLなら「不明」、それ以外は「その他」という「地域区分」列を取得してください",
        hint: "CASE WHEN city = '東京' THEN '首都圏' WHEN city IN ('大阪','名古屋') THEN '主要都市' WHEN city IS NULL THEN '不明' ELSE 'その他' END AS 地域区分",
        answer: "SELECT name, city, CASE WHEN city = '東京' THEN '首都圏' WHEN city IN ('大阪','名古屋') THEN '主要都市' WHEN city IS NULL THEN '不明' ELSE 'その他' END AS 地域区分 FROM users",
        expectedColumns: ["name", "city", "地域区分"],
      },
      {
        id: "pb-case-5",
        question: "productsテーブルのnameとstockと、stockがNULLなら「在庫不明」、stock = 0なら「在庫なし」、stock < 50なら「在庫少」、それ以外は「在庫あり」という「在庫状況」列を取得してください",
        hint: "CASE WHEN stock IS NULL THEN '在庫不明' WHEN stock = 0 THEN '在庫なし' WHEN stock < 50 THEN '在庫少' ELSE '在庫あり' END AS 在庫状況",
        answer: "SELECT name, stock, CASE WHEN stock IS NULL THEN '在庫不明' WHEN stock = 0 THEN '在庫なし' WHEN stock < 50 THEN '在庫少' ELSE '在庫あり' END AS 在庫状況 FROM products",
        expectedColumns: ["name", "stock", "在庫状況"],
      },
    ],
  },
  {
    slug: "pb-advanced-where",
    title: "複合条件の応用",
    level: "beginner",
    order: 6,
    description: "AND・OR・IN・BETWEEN・LIKEを組み合わせた複雑なWHERE条件を学びます",
    content: `
<h2>複合条件の演算子</h2>
<table>
  <tr><th>演算子</th><th>説明</th></tr>
  <tr><td>AND</td><td>両方の条件を満たす</td></tr>
  <tr><td>OR</td><td>どちらか一方を満たす</td></tr>
  <tr><td>NOT</td><td>条件を否定</td></tr>
  <tr><td>IN (...)</td><td>リストのいずれかに一致</td></tr>
  <tr><td>BETWEEN a AND b</td><td>a以上b以下</td></tr>
  <tr><td>LIKE</td><td>パターンマッチ（%は任意の文字列）</td></tr>
</table>

<h2>使用例</h2>
<pre><code><span class="sql-comment">-- 東京または大阪のユーザーで、emailがNULLでない</span>
<span class="sql-keyword">SELECT</span> * <span class="sql-keyword">FROM</span> users
<span class="sql-keyword">WHERE</span> city <span class="sql-keyword">IN</span> (<span class="sql-string">'東京'</span>, <span class="sql-string">'大阪'</span>)
  <span class="sql-keyword">AND</span> email <span class="sql-keyword">IS NOT NULL</span>;

<span class="sql-comment">-- 価格が5000円以上50000円以下のPC</span>
<span class="sql-keyword">SELECT</span> * <span class="sql-keyword">FROM</span> products
<span class="sql-keyword">WHERE</span> price <span class="sql-keyword">BETWEEN</span> <span class="sql-number">5000</span> <span class="sql-keyword">AND</span> <span class="sql-number">50000</span>
  <span class="sql-keyword">AND</span> category = <span class="sql-string">'PC'</span>;</code></pre>
    `,
    exercises: [
      {
        id: "pb-where-1",
        question: "productsテーブルからcategoryが'Accessory'でかつpriceが5000以上の商品のname・category・priceを取得してください",
        hint: "WHERE category = 'Accessory' AND price >= 5000",
        answer: "SELECT name, category, price FROM products WHERE category = 'Accessory' AND price >= 5000",
        expectedColumns: ["name", "category", "price"],
      },
      {
        id: "pb-where-2",
        question: "usersテーブルからcityが'東京'または'大阪'で、かつemailがNULLでないユーザーのname・city・emailを取得してください",
        hint: "WHERE city IN ('東京', '大阪') AND email IS NOT NULL",
        answer: "SELECT name, city, email FROM users WHERE city IN ('東京', '大阪') AND email IS NOT NULL",
        expectedColumns: ["name", "city", "email"],
      },
      {
        id: "pb-where-3",
        question: "productsテーブルからpriceが10000以上100000以下（BETWEEN）の商品のname・categoryとpriceを取得してください",
        hint: "WHERE price BETWEEN 10000 AND 100000",
        answer: "SELECT name, category, price FROM products WHERE price BETWEEN 10000 AND 100000",
        expectedColumns: ["name", "category", "price"],
      },
      {
        id: "pb-where-4",
        question: "ordersテーブルからstatusが'pending'または'cancelled'の注文のid・user_id・order_date・statusを取得してください",
        hint: "WHERE status IN ('pending', 'cancelled')",
        answer: "SELECT id, user_id, order_date, status FROM orders WHERE status IN ('pending', 'cancelled')",
        expectedColumns: ["id", "user_id", "order_date", "status"],
      },
      {
        id: "pb-where-5",
        question: "usersテーブルからnameが「田」で始まるユーザーのname・city・emailを取得してください",
        hint: "WHERE name LIKE '田%'",
        answer: "SELECT name, city, email FROM users WHERE name LIKE '田%'",
        expectedColumns: ["name", "city", "email"],
      },
    ],
  },
  {
    slug: "pb-calculations",
    title: "SELECT計算式と集計",
    level: "beginner",
    order: 7,
    description: "order_products.price * quantityなどの計算式とSUM・AVG・COUNT・GROUP BYを組み合わせた集計を学びます",
    content: `
<h2>SELECT内で計算する</h2>
<p>SELECT句の中で直接計算式を書けます。</p>
<pre><code><span class="sql-comment">-- 小計（単価 × 数量）</span>
<span class="sql-keyword">SELECT</span> id, price * quantity <span class="sql-keyword">AS</span> 小計 <span class="sql-keyword">FROM</span> order_products;</code></pre>

<h2>集計関数 + GROUP BY</h2>
<table>
  <tr><th>関数</th><th>説明</th></tr>
  <tr><td>SUM(col)</td><td>合計</td></tr>
  <tr><td>AVG(col)</td><td>平均</td></tr>
  <tr><td>COUNT(*)</td><td>件数</td></tr>
  <tr><td>MAX(col)</td><td>最大値</td></tr>
  <tr><td>MIN(col)</td><td>最小値</td></tr>
</table>

<pre><code><span class="sql-comment">-- 注文ごとの合計金額</span>
<span class="sql-keyword">SELECT</span> order_id, <span class="sql-function">SUM</span>(price * quantity) <span class="sql-keyword">AS</span> 合計金額
<span class="sql-keyword">FROM</span> order_products
<span class="sql-keyword">GROUP BY</span> order_id;</code></pre>
    `,
    exercises: [
      {
        id: "pb-calc-1",
        question: "order_productsテーブルのidとprice・quantityと、price×quantityを「小計」として取得してください",
        hint: "price * quantity AS 小計",
        answer: "SELECT id, price, quantity, price * quantity AS 小計 FROM order_products",
        expectedColumns: ["id", "price", "quantity", "小計"],
      },
      {
        id: "pb-calc-2",
        question: "order_productsテーブルをorder_idでグループ化し、各order_idごとのSUM(price * quantity)を「合計金額」として取得してください",
        hint: "GROUP BY order_id, SUM(price * quantity) AS 合計金額",
        answer: "SELECT order_id, SUM(price * quantity) AS 合計金額 FROM order_products GROUP BY order_id",
        expectedColumns: ["order_id", "合計金額"],
      },
      {
        id: "pb-calc-3",
        question: "productsテーブルをcategoryでグループ化し、各カテゴリのAVG(price)を小数点以下2桁に丸めた「平均価格」を取得してください",
        hint: "GROUP BY category, ROUND(AVG(price), 2) AS 平均価格",
        answer: "SELECT category, ROUND(AVG(price), 2) AS 平均価格 FROM products GROUP BY category",
        expectedColumns: ["category", "平均価格"],
      },
      {
        id: "pb-calc-4",
        question: "ordersテーブルをstatusでグループ化し、各statusのCOUNT(*)を「件数」として取得してください",
        hint: "GROUP BY status, COUNT(*) AS 件数",
        answer: "SELECT status, COUNT(*) AS 件数 FROM orders GROUP BY status",
        expectedColumns: ["status", "件数"],
      },
      {
        id: "pb-calc-5",
        question: "order_productsテーブルをorder_idでグループ化し、合計金額が100000以上のorder_idと合計金額を取得してください",
        hint: "HAVING SUM(price * quantity) >= 100000",
        answer: "SELECT order_id, SUM(price * quantity) AS 合計金額 FROM order_products GROUP BY order_id HAVING SUM(price * quantity) >= 100000",
        expectedColumns: ["order_id", "合計金額"],
      },
    ],
  },
  {
    slug: "pb-create-table",
    title: "CREATE TABLEとデータ操作",
    level: "beginner",
    order: 8,
    description: "新しいテーブルの作成とINSERT・UPDATE・DELETEによるデータ操作を学びます",
    content: `
<h2>CREATE TABLE</h2>
<pre><code><span class="sql-keyword">CREATE TABLE</span> reviews (
  id         <span class="sql-keyword">INTEGER PRIMARY KEY</span>,
  user_id    <span class="sql-keyword">INTEGER</span>,
  product_id <span class="sql-keyword">INTEGER</span>,
  rating     <span class="sql-keyword">INTEGER</span>,
  comment    <span class="sql-keyword">TEXT</span>
);</code></pre>

<h2>INSERT</h2>
<pre><code><span class="sql-keyword">INSERT INTO</span> reviews (id, user_id, product_id, rating, comment)
<span class="sql-keyword">VALUES</span> (<span class="sql-number">1</span>, <span class="sql-number">1</span>, <span class="sql-number">1</span>, <span class="sql-number">5</span>, <span class="sql-string">'最高です'</span>);</code></pre>

<h2>UPDATE</h2>
<pre><code><span class="sql-keyword">UPDATE</span> reviews <span class="sql-keyword">SET</span> rating = <span class="sql-number">4</span> <span class="sql-keyword">WHERE</span> id = <span class="sql-number">1</span>;</code></pre>

<h2>DELETE</h2>
<pre><code><span class="sql-keyword">DELETE FROM</span> reviews <span class="sql-keyword">WHERE</span> id = <span class="sql-number">1</span>;</code></pre>
    `,
    exercises: [
      {
        id: "pb-ddl-1",
        question: "reviewsテーブルを作成してください。カラムはid（INTEGER PRIMARY KEY）、user_id（INTEGER）、product_id（INTEGER）、rating（INTEGER）、comment（TEXT）です。作成後、(1, 1, 1, 5, '確認')を1件INSERTしてSELECT * FROM reviews;で確認してください",
        hint: "CREATE TABLE reviews (...); INSERT INTO reviews VALUES (1, 1, 1, 5, '確認'); SELECT * FROM reviews",
        answer: "CREATE TABLE reviews (id INTEGER PRIMARY KEY, user_id INTEGER, product_id INTEGER, rating INTEGER, comment TEXT); INSERT INTO reviews VALUES (1, 1, 1, 5, '確認'); SELECT * FROM reviews",
        expectedColumns: ["id", "user_id", "product_id", "rating", "comment"],
      },
      {
        id: "pb-ddl-2",
        question: "reviewsテーブルを作成し、(1, 1, 1, 5, '最高です')と(2, 2, 3, 4, '良かった')の2件をINSERTして全件取得してください",
        hint: "CREATE TABLE → INSERT INTO → SELECT *",
        answer: "CREATE TABLE reviews (id INTEGER PRIMARY KEY, user_id INTEGER, product_id INTEGER, rating INTEGER, comment TEXT); INSERT INTO reviews VALUES (1, 1, 1, 5, '最高です'); INSERT INTO reviews VALUES (2, 2, 3, 4, '良かった'); SELECT * FROM reviews",
        expectedColumns: ["id", "user_id", "product_id", "rating", "comment"],
      },
      {
        id: "pb-ddl-3",
        question: "reviewsテーブルを作成し、3件データを挿入後、id=1のratingを3にUPDATEして全件取得してください",
        hint: "UPDATE reviews SET rating = 3 WHERE id = 1",
        answer: "CREATE TABLE reviews (id INTEGER PRIMARY KEY, user_id INTEGER, product_id INTEGER, rating INTEGER, comment TEXT); INSERT INTO reviews VALUES (1, 1, 1, 5, '最高'); INSERT INTO reviews VALUES (2, 2, 2, 4, '良い'); INSERT INTO reviews VALUES (3, 3, 3, 2, '普通'); UPDATE reviews SET rating = 3 WHERE id = 1; SELECT * FROM reviews",
        expectedColumns: ["id", "user_id", "product_id", "rating", "comment"],
      },
      {
        id: "pb-ddl-4",
        question: "reviewsテーブルを作成して2件挿入後、id=2のレコードをDELETEして全件取得してください",
        hint: "DELETE FROM reviews WHERE id = 2",
        answer: "CREATE TABLE reviews (id INTEGER PRIMARY KEY, user_id INTEGER, product_id INTEGER, rating INTEGER, comment TEXT); INSERT INTO reviews VALUES (1, 1, 1, 5, '最高'); INSERT INTO reviews VALUES (2, 2, 2, 3, '普通'); DELETE FROM reviews WHERE id = 2; SELECT * FROM reviews",
        expectedColumns: ["id", "user_id", "product_id", "rating", "comment"],
      },
      {
        id: "pb-ddl-5",
        question: "tagsテーブル（id INTEGER PRIMARY KEY, name TEXT NOT NULL）を作成し、(1,'新着')と(2,'セール')と(3,'人気')の3件をINSERTして全件取得してください",
        hint: "CREATE TABLE tags (id INTEGER PRIMARY KEY, name TEXT NOT NULL)",
        answer: "CREATE TABLE tags (id INTEGER PRIMARY KEY, name TEXT NOT NULL); INSERT INTO tags VALUES (1, '新着'); INSERT INTO tags VALUES (2, 'セール'); INSERT INTO tags VALUES (3, '人気'); SELECT * FROM tags",
        expectedColumns: ["id", "name"],
      },
    ],
  },
  {
    slug: "pb-junction",
    title: "中間テーブルの応用",
    level: "beginner",
    order: 9,
    description: "order_productsを使った多対多の集計・絞り込みなど中間テーブルの活用方法を学びます",
    content: `
<h2>中間テーブルとは</h2>
<p>多対多の関係を表現するために使うテーブルです。<code>order_products</code> は <code>orders</code> と <code>products</code> の中間テーブルです。</p>

<pre><code>orders (1) ─── (*) order_products (*) ─── (1) products</code></pre>

<h2>中間テーブルを使ったJOIN</h2>
<pre><code><span class="sql-comment">-- 注文と商品名を取得</span>
<span class="sql-keyword">SELECT</span> o.id, p.name, op.quantity
<span class="sql-keyword">FROM</span> orders o
<span class="sql-keyword">JOIN</span> order_products op <span class="sql-keyword">ON</span> o.id = op.order_id
<span class="sql-keyword">JOIN</span> products p <span class="sql-keyword">ON</span> op.product_id = p.id;</code></pre>

<h2>集計への応用</h2>
<pre><code><span class="sql-comment">-- 商品ごとの総販売数</span>
<span class="sql-keyword">SELECT</span> p.name, <span class="sql-function">SUM</span>(op.quantity) <span class="sql-keyword">AS</span> 総販売数
<span class="sql-keyword">FROM</span> order_products od
<span class="sql-keyword">JOIN</span> products p <span class="sql-keyword">ON</span> op.product_id = p.id
<span class="sql-keyword">GROUP BY</span> p.id, p.name;</code></pre>
    `,
    exercises: [
      {
        id: "pb-junc-1",
        question: "order_productsとproductsをJOINし、各明細のorder_id・商品name・quantity・priceを取得してください",
        hint: "JOIN products p ON op.product_id = p.id",
        answer: "SELECT op.order_id, p.name, op.quantity, op.price FROM order_products op JOIN products p ON op.product_id = p.id",
        expectedColumns: ["order_id", "name", "quantity", "price"],
      },
      {
        id: "pb-junc-2",
        question: "orders・order_products・productsを3テーブルJOINし、order_id・ユーザーのuser_id・商品name・quantityを取得してください",
        hint: "FROM orders JOIN order_products ... JOIN products ...",
        answer: "SELECT o.id AS order_id, o.user_id, p.name, op.quantity FROM orders o JOIN order_products op ON o.id = op.order_id JOIN products p ON op.product_id = p.id",
        expectedColumns: ["order_id", "user_id", "name", "quantity"],
      },
      {
        id: "pb-junc-3",
        question: "productsとorder_productsをJOINしてproduct_idでグループ化し、商品nameとSUM(quantity)を「総販売数」として取得してください",
        hint: "GROUP BY p.id, p.name して SUM(op.quantity)",
        answer: "SELECT p.name, SUM(op.quantity) AS 総販売数 FROM order_products op JOIN products p ON op.product_id = p.id GROUP BY p.id, p.name",
        expectedColumns: ["name", "総販売数"],
      },
      {
        id: "pb-junc-4",
        question: "order_products・orders・usersを3テーブルJOINし、ユーザーname・order_id・SUM(op.price * op.quantity)を「注文合計」として取得しuser_idとorder_idでグループ化してください",
        hint: "JOIN orders o ... JOIN users u ... GROUP BY u.id, u.name, o.id",
        answer: "SELECT u.name, o.id AS order_id, SUM(op.price * op.quantity) AS 注文合計 FROM order_products op JOIN orders o ON op.order_id = o.id JOIN users u ON o.user_id = u.id GROUP BY u.id, u.name, o.id",
        expectedColumns: ["name", "order_id", "注文合計"],
      },
      {
        id: "pb-junc-5",
        question: "productsとorder_productsをJOINし、totalがSUM(op.quantity * op.price)として計算し、totalが50000以上の商品nameとtotalをtotal降順で取得してください",
        hint: "HAVING SUM(op.quantity * op.price) >= 50000 ORDER BY total DESC",
        answer: "SELECT p.name, SUM(op.quantity * op.price) AS total FROM order_products op JOIN products p ON op.product_id = p.id GROUP BY p.id, p.name HAVING SUM(op.quantity * op.price) >= 50000 ORDER BY total DESC",
        expectedColumns: ["name", "total"],
      },
    ],
  },
  {
    slug: "pb-comprehensive",
    title: "総合演習（初級）",
    level: "beginner",
    order: 10,
    description: "初級コースで学んだSQL全般を組み合わせた総合演習です",
    content: `
<h2>初級コースのまとめ</h2>
<p>これまで学んだSQL技術を組み合わせて、より実践的なクエリを書いてみましょう。</p>

<ul>
  <li>NULL処理（IS NULL, COALESCE）</li>
  <li>文字列関数（LENGTH, SUBSTR, REPLACE, ||）</li>
  <li>数値関数（ROUND, ABS, CAST）</li>
  <li>日付関数（strftime, date）</li>
  <li>CASE式による条件分岐</li>
  <li>複合WHERE条件（AND, OR, IN, BETWEEN, LIKE）</li>
  <li>集計（SUM, AVG, COUNT, GROUP BY, HAVING）</li>
  <li>中間テーブルを使ったJOIN</li>
</ul>

<h2>複数の技術を組み合わせる</h2>
<pre><code><span class="sql-comment">-- 東京ユーザーの注文合計金額（CASEと集計の組み合わせ）</span>
<span class="sql-keyword">SELECT</span> u.name,
  <span class="sql-function">SUM</span>(op.price * op.quantity) <span class="sql-keyword">AS</span> 合計金額,
  <span class="sql-keyword">CASE</span> <span class="sql-keyword">WHEN</span> <span class="sql-function">SUM</span>(op.price * op.quantity) >= <span class="sql-number">200000</span> <span class="sql-keyword">THEN</span> <span class="sql-string">'優良顧客'</span> <span class="sql-keyword">ELSE</span> <span class="sql-string">'一般'</span> <span class="sql-keyword">END</span> <span class="sql-keyword">AS</span> ランク
<span class="sql-keyword">FROM</span> users u
<span class="sql-keyword">JOIN</span> orders o <span class="sql-keyword">ON</span> u.id = o.user_id
<span class="sql-keyword">JOIN</span> order_products op <span class="sql-keyword">ON</span> o.id = op.order_id
<span class="sql-keyword">WHERE</span> u.city = <span class="sql-string">'東京'</span>
<span class="sql-keyword">GROUP BY</span> u.id, u.name;</code></pre>
    `,
    exercises: [
      {
        id: "pb-comp-1",
        question: "usersテーブルのnameとcityを取得し、cityがNULLなら「不明」に置換して「居住地」として、nameの文字数を「名前の長さ」として表示してください",
        hint: "COALESCE(city, '不明') AS 居住地, LENGTH(name) AS 名前の長さ",
        answer: "SELECT name, COALESCE(city, '不明') AS 居住地, LENGTH(name) AS 名前の長さ FROM users",
        expectedColumns: ["name", "居住地", "名前の長さ"],
      },
      {
        id: "pb-comp-2",
        question: "productsテーブルのnameとpriceと税込価格（price*1.1をROUNDして整数）と価格帯（100000以上「高額」10000以上「中額」それ以外「低額」）を取得してください",
        hint: "ROUND(price * 1.1) AS 税込価格, CASE WHEN ... END AS 価格帯",
        answer: "SELECT name, price, ROUND(price * 1.1) AS 税込価格, CASE WHEN price >= 100000 THEN '高額' WHEN price >= 10000 THEN '中額' ELSE '低額' END AS 価格帯 FROM products",
        expectedColumns: ["name", "price", "税込価格", "価格帯"],
      },
      {
        id: "pb-comp-3",
        question: "ordersテーブルから2024年3月以降（order_date >= '2024-03-01'）のstatusが'completed'な注文のid・user_id・order_dateを取得してください",
        hint: "WHERE order_date >= '2024-03-01' AND status = 'completed'",
        answer: "SELECT id, user_id, order_date FROM orders WHERE order_date >= '2024-03-01' AND status = 'completed'",
        expectedColumns: ["id", "user_id", "order_date"],
      },
      {
        id: "pb-comp-4",
        question: "users・orders・order_productsを3テーブルJOINし、都市別のSUM(op.price * op.quantity)を「売上合計」として都市ごとに集計し、売上合計の降順で取得してください（cityがNULLのユーザーは除く）",
        hint: "WHERE u.city IS NOT NULL GROUP BY u.city ORDER BY 売上合計 DESC",
        answer: "SELECT u.city, SUM(op.price * op.quantity) AS 売上合計 FROM users u JOIN orders o ON u.id = o.user_id JOIN order_products op ON o.id = op.order_id WHERE u.city IS NOT NULL GROUP BY u.city ORDER BY 売上合計 DESC",
        expectedColumns: ["city", "売上合計"],
      },
      {
        id: "pb-comp-5",
        question: "productsテーブルとorder_productsをJOINし、カテゴリ別に平均販売単価（AVG(op.price)）をROUND小数点以下0桁にした「平均販売単価」と、総販売数（SUM(op.quantity)）を取得してカテゴリ名のアルファベット順で表示してください",
        hint: "GROUP BY p.category ORDER BY p.category",
        answer: "SELECT p.category, ROUND(AVG(op.price), 0) AS 平均販売単価, SUM(op.quantity) AS 総販売数 FROM order_products op JOIN products p ON op.product_id = p.id GROUP BY p.category ORDER BY p.category",
        expectedColumns: ["category", "平均販売単価", "総販売数"],
      },
    ],
  },
  // ========= プレミアム中級コース =========
  {
    slug: "pi-window-rank",
    title: "ウィンドウ関数 ROW_NUMBER・RANK・DENSE_RANK",
    level: "intermediate",
    order: 11,
    description: "OVER句を使ったROW_NUMBER・RANK・DENSE_RANKのランキング付けを学びます",
    content: `
<h2>ウィンドウ関数とは</h2>
<p>グループ化せずに行ごとに集計や順位付けができる強力な機能です。<code>OVER()</code> 句を使います。</p>

<h2>ランキング関数の違い</h2>
<table>
  <tr><th>関数</th><th>同順位の扱い</th><th>例（同率2位が2件）</th></tr>
  <tr><td>ROW_NUMBER()</td><td>連番（重複なし）</td><td>1, 2, 3, 4</td></tr>
  <tr><td>RANK()</td><td>同順位→次は飛ばす</td><td>1, 2, 2, 4</td></tr>
  <tr><td>DENSE_RANK()</td><td>同順位→次は連続</td><td>1, 2, 2, 3</td></tr>
</table>

<h2>使用例</h2>
<pre><code><span class="sql-comment">-- 価格ランキング</span>
<span class="sql-keyword">SELECT</span> name, price,
  <span class="sql-function">ROW_NUMBER</span>() <span class="sql-keyword">OVER</span> (<span class="sql-keyword">ORDER BY</span> price <span class="sql-keyword">DESC</span>) <span class="sql-keyword">AS</span> 行番号,
  <span class="sql-function">RANK</span>()       <span class="sql-keyword">OVER</span> (<span class="sql-keyword">ORDER BY</span> price <span class="sql-keyword">DESC</span>) <span class="sql-keyword">AS</span> 順位,
  <span class="sql-function">DENSE_RANK</span>() <span class="sql-keyword">OVER</span> (<span class="sql-keyword">ORDER BY</span> price <span class="sql-keyword">DESC</span>) <span class="sql-keyword">AS</span> 密集順位
<span class="sql-keyword">FROM</span> products;</code></pre>

<h2>PARTITION BY（グループ内ランキング）</h2>
<pre><code><span class="sql-comment">-- カテゴリ内での価格ランキング</span>
<span class="sql-keyword">SELECT</span> name, category, price,
  <span class="sql-function">RANK</span>() <span class="sql-keyword">OVER</span> (<span class="sql-keyword">PARTITION BY</span> category <span class="sql-keyword">ORDER BY</span> price <span class="sql-keyword">DESC</span>) <span class="sql-keyword">AS</span> カテゴリ内順位
<span class="sql-keyword">FROM</span> products;</code></pre>
    `,
    exercises: [
      {
        id: "pi-rank-1",
        question: "productsテーブルのname・priceと、price降順のROW_NUMBER()を「行番号」として取得してください",
        hint: "ROW_NUMBER() OVER (ORDER BY price DESC) AS 行番号",
        answer: "SELECT name, price, ROW_NUMBER() OVER (ORDER BY price DESC) AS 行番号 FROM products",
        expectedColumns: ["name", "price", "行番号"],
      },
      {
        id: "pi-rank-2",
        question: "productsテーブルのname・priceと、price降順のRANK()を「順位」として取得してください",
        hint: "RANK() OVER (ORDER BY price DESC) AS 順位",
        answer: "SELECT name, price, RANK() OVER (ORDER BY price DESC) AS 順位 FROM products",
        expectedColumns: ["name", "price", "順位"],
      },
      {
        id: "pi-rank-3",
        question: "productsテーブルのname・category・priceと、price降順のRANK()を「全体順位」、PARTITION BY categoryのprice降順RANK()を「カテゴリ内順位」として取得してください",
        hint: "RANK() OVER (ORDER BY price DESC), RANK() OVER (PARTITION BY category ORDER BY price DESC)",
        answer: "SELECT name, category, price, RANK() OVER (ORDER BY price DESC) AS 全体順位, RANK() OVER (PARTITION BY category ORDER BY price DESC) AS カテゴリ内順位 FROM products",
        expectedColumns: ["name", "category", "price", "全体順位", "カテゴリ内順位"],
      },
      {
        id: "pi-rank-4",
        question: "order_productsテーブルのidとprice*quantityを「小計」として計算し、小計降順のDENSE_RANK()を「小計順位」として取得してください",
        hint: "DENSE_RANK() OVER (ORDER BY price*quantity DESC) AS 小計順位",
        answer: "SELECT id, price * quantity AS 小計, DENSE_RANK() OVER (ORDER BY price * quantity DESC) AS 小計順位 FROM order_products",
        expectedColumns: ["id", "小計", "小計順位"],
      },
      {
        id: "pi-rank-5",
        question: "productsテーブルのname・category・priceを取得し、カテゴリ内でprice昇順のROW_NUMBER()が1（各カテゴリで最安値）の行だけ表示してください（サブクエリを使用）",
        hint: "WHERE rn = 1 ... ROW_NUMBER() OVER (PARTITION BY category ORDER BY price ASC) AS rn",
        answer: "SELECT name, category, price FROM (SELECT name, category, price, ROW_NUMBER() OVER (PARTITION BY category ORDER BY price ASC) AS rn FROM products) WHERE rn = 1",
        expectedColumns: ["name", "category", "price"],
      },
    ],
  },
  {
    slug: "pi-window-lag-lead",
    title: "ウィンドウ関数 LAG・LEAD・移動集計",
    level: "intermediate",
    order: 12,
    description: "LAG・LEADで前後行を参照し、SUM/AVGの移動集計をorders.order_dateで学びます",
    content: `
<h2>LAG / LEAD — 前後の行を参照</h2>
<pre><code><span class="sql-comment">-- 前の注文日を取得</span>
<span class="sql-keyword">SELECT</span> id, order_date,
  <span class="sql-function">LAG</span>(order_date) <span class="sql-keyword">OVER</span> (<span class="sql-keyword">ORDER BY</span> order_date) <span class="sql-keyword">AS</span> 前回注文日,
  <span class="sql-function">LEAD</span>(order_date) <span class="sql-keyword">OVER</span> (<span class="sql-keyword">ORDER BY</span> order_date) <span class="sql-keyword">AS</span> 次回注文日
<span class="sql-keyword">FROM</span> orders;</code></pre>

<h2>移動集計（ROWS BETWEEN）</h2>
<pre><code><span class="sql-comment">-- order_productsで累積小計</span>
<span class="sql-keyword">SELECT</span> id, price * quantity <span class="sql-keyword">AS</span> 小計,
  <span class="sql-function">SUM</span>(price * quantity) <span class="sql-keyword">OVER</span> (
    <span class="sql-keyword">ORDER BY</span> id
    <span class="sql-keyword">ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</span>
  ) <span class="sql-keyword">AS</span> 累積合計
<span class="sql-keyword">FROM</span> order_products;</code></pre>
    `,
    exercises: [
      {
        id: "pi-lag-1",
        question: "ordersテーブルのid・order_dateと、order_date昇順でのLAG(order_date)を「前回注文日」として取得してください",
        hint: "LAG(order_date) OVER (ORDER BY order_date) AS 前回注文日",
        answer: "SELECT id, order_date, LAG(order_date) OVER (ORDER BY order_date) AS 前回注文日 FROM orders",
        expectedColumns: ["id", "order_date", "前回注文日"],
      },
      {
        id: "pi-lag-2",
        question: "ordersテーブルのid・order_dateと、order_date昇順でのLEAD(order_date)を「次回注文日」として取得してください",
        hint: "LEAD(order_date) OVER (ORDER BY order_date) AS 次回注文日",
        answer: "SELECT id, order_date, LEAD(order_date) OVER (ORDER BY order_date) AS 次回注文日 FROM orders",
        expectedColumns: ["id", "order_date", "次回注文日"],
      },
      {
        id: "pi-lag-3",
        question: "order_productsテーブルのidとprice*quantityを「小計」として、id昇順の累積合計（ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW）を「累積合計」として取得してください",
        hint: "SUM(price * quantity) OVER (ORDER BY id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)",
        answer: "SELECT id, price * quantity AS 小計, SUM(price * quantity) OVER (ORDER BY id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS 累積合計 FROM order_products",
        expectedColumns: ["id", "小計", "累積合計"],
      },
      {
        id: "pi-lag-4",
        question: "order_productsテーブルのidとprice*quantityを「小計」として、直前2行を含む3行の移動平均（ROWS BETWEEN 2 PRECEDING AND CURRENT ROW）をROUND小数点以下2桁で「移動平均」として取得してください",
        hint: "ROUND(AVG(price * quantity) OVER (ORDER BY id ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS 移動平均",
        answer: "SELECT id, price * quantity AS 小計, ROUND(AVG(price * quantity) OVER (ORDER BY id ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS 移動平均 FROM order_products",
        expectedColumns: ["id", "小計", "移動平均"],
      },
      {
        id: "pi-lag-5",
        question: "ordersテーブルのid・order_dateと、LAG(id)を「前の注文ID」として取得し、前の注文IDがNULLでない行（最初の行以外）だけを表示してください（サブクエリを使用）",
        hint: "WHERE prev_id IS NOT NULL ... LAG(id) OVER (ORDER BY order_date)",
        answer: "SELECT id, order_date, 前の注文ID FROM (SELECT id, order_date, LAG(id) OVER (ORDER BY order_date) AS 前の注文ID FROM orders) WHERE 前の注文ID IS NOT NULL",
        expectedColumns: ["id", "order_date", "前の注文ID"],
      },
    ],
  },
  {
    slug: "pi-cte",
    title: "CTE（WITH句）",
    level: "intermediate",
    order: 13,
    description: "WITH句を使ってクエリを読みやすく分割する方法を学びます",
    content: `
<h2>CTEとは</h2>
<p>CTE（Common Table Expression）は <code>WITH</code> 句を使って、クエリの中で一時的な名前付き結果セットを定義する機能です。複雑なサブクエリをわかりやすく整理できます。</p>

<h2>基本構文</h2>
<pre><code><span class="sql-keyword">WITH</span> cte名 <span class="sql-keyword">AS</span> (
  <span class="sql-keyword">SELECT</span> ...
)
<span class="sql-keyword">SELECT</span> * <span class="sql-keyword">FROM</span> cte名;</code></pre>

<h2>使用例</h2>
<pre><code><span class="sql-comment">-- 注文合計をCTEで計算して絞り込む</span>
<span class="sql-keyword">WITH</span> order_totals <span class="sql-keyword">AS</span> (
  <span class="sql-keyword">SELECT</span> order_id, <span class="sql-function">SUM</span>(price * quantity) <span class="sql-keyword">AS</span> 合計金額
  <span class="sql-keyword">FROM</span> order_products
  <span class="sql-keyword">GROUP BY</span> order_id
)
<span class="sql-keyword">SELECT</span> * <span class="sql-keyword">FROM</span> order_totals
<span class="sql-keyword">WHERE</span> 合計金額 >= <span class="sql-number">100000</span>;</code></pre>
    `,
    exercises: [
      {
        id: "pi-cte-1",
        question: "WITH句を使ってorder_productsからorder_idごとのSUM(price*quantity)を「合計金額」とするCTE「order_totals」を作り、全件取得してください",
        hint: "WITH order_totals AS (SELECT order_id, SUM(price*quantity) AS 合計金額 FROM order_products GROUP BY order_id) SELECT * FROM order_totals",
        answer: "WITH order_totals AS (SELECT order_id, SUM(price * quantity) AS 合計金額 FROM order_products GROUP BY order_id) SELECT * FROM order_totals",
        expectedColumns: ["order_id", "合計金額"],
      },
      {
        id: "pi-cte-2",
        question: "WITH句でorder_productsからorder_idごとの合計金額CTEを作り、合計金額が100000以上のorder_idと合計金額を取得してください",
        hint: "WHERE 合計金額 >= 100000",
        answer: "WITH order_totals AS (SELECT order_id, SUM(price * quantity) AS 合計金額 FROM order_products GROUP BY order_id) SELECT * FROM order_totals WHERE 合計金額 >= 100000",
        expectedColumns: ["order_id", "合計金額"],
      },
      {
        id: "pi-cte-3",
        question: "WITH句でusersから東京のユーザーのみ取得するCTE「tokyo_users」を作り、ordersとJOINして東京ユーザーの注文のid・user_id・order_dateを取得してください",
        hint: "WITH tokyo_users AS (SELECT id FROM users WHERE city = '東京') ... JOIN tokyo_users ...",
        answer: "WITH tokyo_users AS (SELECT id FROM users WHERE city = '東京') SELECT o.id, o.user_id, o.order_date FROM orders o JOIN tokyo_users t ON o.user_id = t.id",
        expectedColumns: ["id", "user_id", "order_date"],
      },
      {
        id: "pi-cte-4",
        question: "WITH句で各productsの平均priceを計算するCTE「avg_price」を作り（AVG(price)を「平均価格」）、productsとJOINして各商品name・price・平均価格と、price > 平均価格かどうかを「平均以上」（1 or 0）として取得してください",
        hint: "WITH avg_price AS (SELECT AVG(price) AS 平均価格 FROM products) SELECT p.name, p.price, a.平均価格, CASE WHEN p.price > a.平均価格 THEN 1 ELSE 0 END AS 平均以上",
        answer: "WITH avg_price AS (SELECT AVG(price) AS 平均価格 FROM products) SELECT p.name, p.price, a.平均価格, CASE WHEN p.price > a.平均価格 THEN 1 ELSE 0 END AS 平均以上 FROM products p, avg_price a",
        expectedColumns: ["name", "price", "平均価格", "平均以上"],
      },
      {
        id: "pi-cte-5",
        question: "2つのCTEを使ってください。CTE1: order_productsからorder_idごとの合計金額。CTE2: ordersとusersをJOINしてorder_id・ユーザーnameを取得。最終的にCTE1とCTE2をorder_idで結合し、ユーザー名・order_id・合計金額を取得してください",
        hint: "WITH totals AS (...), order_users AS (...) SELECT ou.name, ou.order_id, t.合計金額 FROM totals t JOIN order_users ou ON ...",
        answer: "WITH totals AS (SELECT order_id, SUM(price * quantity) AS 合計金額 FROM order_products GROUP BY order_id), order_users AS (SELECT o.id AS order_id, u.name FROM orders o JOIN users u ON o.user_id = u.id) SELECT ou.name, ou.order_id, t.合計金額 FROM totals t JOIN order_users ou ON t.order_id = ou.order_id",
        expectedColumns: ["name", "order_id", "合計金額"],
      },
    ],
  },
  {
    slug: "pi-exists",
    title: "EXISTS・NOT EXISTS",
    level: "intermediate",
    order: 14,
    description: "EXISTS・NOT EXISTSを使った相関サブクエリによる存在チェックを学びます",
    content: `
<h2>EXISTS / NOT EXISTS</h2>
<p>サブクエリが1件以上の結果を返すかどうかをチェックします。<code>IN</code> よりも大量データに対して効率的な場合があります。</p>

<h2>基本構文</h2>
<pre><code><span class="sql-comment">-- 注文があるユーザーだけを取得</span>
<span class="sql-keyword">SELECT</span> name <span class="sql-keyword">FROM</span> users u
<span class="sql-keyword">WHERE EXISTS</span> (
  <span class="sql-keyword">SELECT</span> <span class="sql-number">1</span> <span class="sql-keyword">FROM</span> orders o
  <span class="sql-keyword">WHERE</span> o.user_id = u.id
);</code></pre>

<pre><code><span class="sql-comment">-- 一度も注文していないユーザーを取得</span>
<span class="sql-keyword">SELECT</span> name <span class="sql-keyword">FROM</span> users u
<span class="sql-keyword">WHERE NOT EXISTS</span> (
  <span class="sql-keyword">SELECT</span> <span class="sql-number">1</span> <span class="sql-keyword">FROM</span> orders o
  <span class="sql-keyword">WHERE</span> o.user_id = u.id
);</code></pre>
    `,
    exercises: [
      {
        id: "pi-exists-1",
        question: "EXISTSを使って、ordersテーブルに注文が存在するユーザーのname・city・emailを取得してください",
        hint: "WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id)",
        answer: "SELECT name, city, email FROM users u WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id)",
        expectedColumns: ["name", "city", "email"],
      },
      {
        id: "pi-exists-2",
        question: "NOT EXISTSを使って、一度も注文していないユーザーのname・city・emailを取得してください",
        hint: "WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id)",
        answer: "SELECT name, city, email FROM users u WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id)",
        expectedColumns: ["name", "city", "email"],
      },
      {
        id: "pi-exists-3",
        question: "EXISTSを使って、order_productsに明細が存在する注文のid・user_id・order_date・statusを取得してください",
        hint: "WHERE EXISTS (SELECT 1 FROM order_products op WHERE op.order_id = o.id)",
        answer: "SELECT id, user_id, order_date, status FROM orders o WHERE EXISTS (SELECT 1 FROM order_products op WHERE op.order_id = o.id)",
        expectedColumns: ["id", "user_id", "order_date", "status"],
      },
      {
        id: "pi-exists-4",
        question: "EXISTSを使って、カテゴリが'PC'の商品が含まれる注文明細が存在するorder_idを持つ注文のid・user_id・statusを取得してください",
        hint: "WHERE EXISTS (SELECT 1 FROM order_products op JOIN products p ON op.product_id = p.id WHERE op.order_id = o.id AND p.category = 'PC')",
        answer: "SELECT id, user_id, status FROM orders o WHERE EXISTS (SELECT 1 FROM order_products op JOIN products p ON op.product_id = p.id WHERE op.order_id = o.id AND p.category = 'PC')",
        expectedColumns: ["id", "user_id", "status"],
      },
      {
        id: "pi-exists-5",
        question: "NOT EXISTSを使って、stockがNULLでない（stock IS NOT NULL）商品の中で、order_productsに存在するproduct_idを持たないものを取得するのではなく、usersの中でcityが'福岡'でかつ注文が存在しないユーザーのname・emailを取得してください",
        hint: "WHERE city = '福岡' AND NOT EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id)",
        answer: "SELECT name, email FROM users u WHERE city = '福岡' AND NOT EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id)",
        expectedColumns: ["name", "email"],
      },
    ],
  },
  {
    slug: "pi-set-operations",
    title: "UNION・INTERSECT・EXCEPT",
    level: "intermediate",
    order: 15,
    description: "集合演算（UNION・INTERSECT・EXCEPT）を使った複数クエリの結合を学びます",
    content: `
<h2>集合演算とは</h2>
<p>2つのSELECT結果を集合として組み合わせる演算です。カラム数と型が一致している必要があります。</p>

<table>
  <tr><th>演算子</th><th>説明</th></tr>
  <tr><td>UNION</td><td>和集合（重複除去）</td></tr>
  <tr><td>UNION ALL</td><td>和集合（重複含む）</td></tr>
  <tr><td>INTERSECT</td><td>積集合（両方に存在）</td></tr>
  <tr><td>EXCEPT</td><td>差集合（左にあって右にない）</td></tr>
</table>

<h2>使用例</h2>
<pre><code><span class="sql-comment">-- 東京ユーザーと大阪ユーザーのname一覧（重複除去）</span>
<span class="sql-keyword">SELECT</span> name <span class="sql-keyword">FROM</span> users <span class="sql-keyword">WHERE</span> city = <span class="sql-string">'東京'</span>
<span class="sql-keyword">UNION</span>
<span class="sql-keyword">SELECT</span> name <span class="sql-keyword">FROM</span> users <span class="sql-keyword">WHERE</span> city = <span class="sql-string">'大阪'</span>;</code></pre>
    `,
    exercises: [
      {
        id: "pi-set-1",
        question: "UNIONを使って、cityが'東京'のユーザーのnameと、cityが'大阪'のユーザーのnameを結合して取得してください（重複除去）",
        hint: "SELECT name FROM users WHERE city = '東京' UNION SELECT name FROM users WHERE city = '大阪'",
        answer: "SELECT name FROM users WHERE city = '東京' UNION SELECT name FROM users WHERE city = '大阪'",
        expectedColumns: ["name"],
      },
      {
        id: "pi-set-2",
        question: "UNION ALLを使って、productsのcategoryが'PC'の商品nameと、categoryが'Display'の商品nameを結合してください（重複含む）",
        hint: "SELECT name FROM products WHERE category = 'PC' UNION ALL SELECT name FROM products WHERE category = 'Display'",
        answer: "SELECT name FROM products WHERE category = 'PC' UNION ALL SELECT name FROM products WHERE category = 'Display'",
        expectedColumns: ["name"],
      },
      {
        id: "pi-set-3",
        question: "INTERSECTを使って、ordersにuser_idとして存在するuser idと、usersでcityが'東京'のidの共通集合（東京ユーザーのうち注文があるid）を取得してください",
        hint: "SELECT user_id FROM orders INTERSECT SELECT id FROM users WHERE city = '東京'",
        answer: "SELECT user_id FROM orders INTERSECT SELECT id FROM users WHERE city = '東京'",
        expectedColumns: ["user_id"],
      },
      {
        id: "pi-set-4",
        question: "EXCEPTを使って、usersの全idのうち、ordersに存在しないuser_idを持つユーザーのidを取得してください",
        hint: "SELECT id FROM users EXCEPT SELECT user_id FROM orders",
        answer: "SELECT id FROM users EXCEPT SELECT user_id FROM orders",
        expectedColumns: ["id"],
      },
      {
        id: "pi-set-5",
        question: "UNION ALLを使って、productsからcategory・nameと「商品」というtype列、usersからcity・nameと「ユーザー」というtype列を結合して取得してください（商品のcategoryとユーザーのcityを同じ「分類」列に）",
        hint: "SELECT category AS 分類, name, '商品' AS type FROM products UNION ALL SELECT city, name, 'ユーザー' FROM users",
        answer: "SELECT category AS 分類, name, '商品' AS type FROM products UNION ALL SELECT city, name, 'ユーザー' AS type FROM users",
        expectedColumns: ["分類", "name", "type"],
      },
    ],
  },
  {
    slug: "pi-self-cross-join",
    title: "SELF JOIN・CROSS JOIN",
    level: "intermediate",
    order: 16,
    description: "自己結合（SELF JOIN）と直積（CROSS JOIN）の使い方をproductsなどで学びます",
    content: `
<h2>SELF JOIN（自己結合）</h2>
<p>同じテーブルを別名で2回JOINすることで、行同士を比較できます。</p>
<pre><code><span class="sql-comment">-- 同じカテゴリの別の商品ペアを探す</span>
<span class="sql-keyword">SELECT</span> a.name <span class="sql-keyword">AS</span> 商品A, b.name <span class="sql-keyword">AS</span> 商品B, a.category
<span class="sql-keyword">FROM</span> products a
<span class="sql-keyword">JOIN</span> products b <span class="sql-keyword">ON</span> a.category = b.category <span class="sql-keyword">AND</span> a.id < b.id;</code></pre>

<h2>CROSS JOIN（直積）</h2>
<p>2つのテーブルのすべての組み合わせを生成します。</p>
<pre><code><span class="sql-comment">-- 商品とユーザーの全組み合わせ</span>
<span class="sql-keyword">SELECT</span> u.name <span class="sql-keyword">AS</span> ユーザー, p.name <span class="sql-keyword">AS</span> 商品
<span class="sql-keyword">FROM</span> users u
<span class="sql-keyword">CROSS JOIN</span> products p
<span class="sql-keyword">LIMIT</span> <span class="sql-number">10</span>;</code></pre>
    `,
    exercises: [
      {
        id: "pi-self-1",
        question: "productsテーブルをSELF JOINして、同じcategoryを持つ異なる商品ペア（a.id < b.id）のname（商品A・商品B）とcategoryを取得してください",
        hint: "FROM products a JOIN products b ON a.category = b.category AND a.id < b.id",
        answer: "SELECT a.name AS 商品A, b.name AS 商品B, a.category FROM products a JOIN products b ON a.category = b.category AND a.id < b.id",
        expectedColumns: ["商品A", "商品B", "category"],
      },
      {
        id: "pi-self-2",
        question: "productsテーブルをSELF JOINして、商品Aの価格が商品Bの価格より高い（a.price > b.price）ペアの商品Aのname・価格と商品Bのname・価格を取得してください",
        hint: "FROM products a JOIN products b ON a.price > b.price",
        answer: "SELECT a.name AS 商品A, a.price AS 価格A, b.name AS 商品B, b.price AS 価格B FROM products a JOIN products b ON a.price > b.price",
        expectedColumns: ["商品A", "価格A", "商品B", "価格B"],
      },
      {
        id: "pi-self-3",
        question: "usersテーブルをSELF JOINして、同じcityに住む異なるユーザーペア（a.id < b.id）のnameA・nameB・cityを取得してください（cityがNULLの行は除く）",
        hint: "FROM users a JOIN users b ON a.city = b.city AND a.id < b.id WHERE a.city IS NOT NULL",
        answer: "SELECT a.name AS nameA, b.name AS nameB, a.city FROM users a JOIN users b ON a.city = b.city AND a.id < b.id WHERE a.city IS NOT NULL",
        expectedColumns: ["nameA", "nameB", "city"],
      },
      {
        id: "pi-self-4",
        question: "products（aliasをp）をCROSS JOINしてusers（aliasをu）と組み合わせ、u.nameとp.nameを「ユーザー」「商品」として取得し、最初の10件に限定してください",
        hint: "FROM users u CROSS JOIN products p LIMIT 10",
        answer: "SELECT u.name AS ユーザー, p.name AS 商品 FROM users u CROSS JOIN products p LIMIT 10",
        expectedColumns: ["ユーザー", "商品"],
      },
      {
        id: "pi-self-5",
        question: "productsをSELF JOINして、stockの差が100以上ある（ABS(a.stock - b.stock) >= 100）異なる商品ペア（a.id < b.id）のname（商品A・商品B）とstock（在庫A・在庫B）を取得してください（stockがNULLの商品は除く）",
        hint: "ON ABS(a.stock - b.stock) >= 100 AND a.id < b.id WHERE a.stock IS NOT NULL AND b.stock IS NOT NULL",
        answer: "SELECT a.name AS 商品A, a.stock AS 在庫A, b.name AS 商品B, b.stock AS 在庫B FROM products a JOIN products b ON ABS(a.stock - b.stock) >= 100 AND a.id < b.id WHERE a.stock IS NOT NULL AND b.stock IS NOT NULL",
        expectedColumns: ["商品A", "在庫A", "商品B", "在庫B"],
      },
    ],
  },
  {
    slug: "pi-views",
    title: "ビュー",
    level: "intermediate",
    order: 17,
    description: "CREATE VIEWを使って複雑なクエリを再利用可能なビューとして定義する方法を学びます",
    content: `
<h2>ビューとは</h2>
<p>ビューは保存されたSELECT文です。テーブルのように扱えますが、データは実際のテーブルに格納されます。複雑なクエリを単純な名前で再利用できます。</p>

<h2>CREATE VIEW</h2>
<pre><code><span class="sql-keyword">CREATE VIEW</span> ビュー名 <span class="sql-keyword">AS</span>
<span class="sql-keyword">SELECT</span> ...;</code></pre>

<h2>使用例</h2>
<pre><code><span class="sql-comment">-- 注文合計ビューを作成</span>
<span class="sql-keyword">CREATE VIEW</span> order_summary <span class="sql-keyword">AS</span>
<span class="sql-keyword">SELECT</span> op.order_id, <span class="sql-function">SUM</span>(op.price * op.quantity) <span class="sql-keyword">AS</span> 合計金額
<span class="sql-keyword">FROM</span> order_products od
<span class="sql-keyword">GROUP BY</span> op.order_id;

<span class="sql-comment">-- ビューを使う</span>
<span class="sql-keyword">SELECT</span> * <span class="sql-keyword">FROM</span> order_summary <span class="sql-keyword">WHERE</span> 合計金額 >= <span class="sql-number">100000</span>;</code></pre>

<h2>DROP VIEW</h2>
<pre><code><span class="sql-keyword">DROP VIEW IF EXISTS</span> order_summary;</code></pre>
    `,
    exercises: [
      {
        id: "pi-view-1",
        question: "order_productsからorder_idごとのSUM(price*quantity)を「合計金額」とするビュー「order_summary」を作成し、SELECT * FROM order_summary; で全件取得してください",
        hint: "CREATE VIEW order_summary AS SELECT order_id, SUM(price*quantity) AS 合計金額 FROM order_products GROUP BY order_id",
        answer: "CREATE VIEW order_summary AS SELECT order_id, SUM(price * quantity) AS 合計金額 FROM order_products GROUP BY order_id; SELECT * FROM order_summary",
        expectedColumns: ["order_id", "合計金額"],
      },
      {
        id: "pi-view-2",
        question: "usersとordersをJOINして、order_id・ユーザーname・order_date・statusを取得するビュー「user_orders」を作成し、SELECT * FROM user_orders; で全件取得してください",
        hint: "CREATE VIEW user_orders AS SELECT o.id AS order_id, u.name, o.order_date, o.status FROM orders o JOIN users u ON o.user_id = u.id",
        answer: "CREATE VIEW user_orders AS SELECT o.id AS order_id, u.name, o.order_date, o.status FROM orders o JOIN users u ON o.user_id = u.id; SELECT * FROM user_orders",
        expectedColumns: ["order_id", "name", "order_date", "status"],
      },
      {
        id: "pi-view-3",
        question: "productsとorder_productsをJOINして、商品ごとのname・category・SUM(op.quantity)を「総販売数」とするビュー「product_sales」を作成し、SELECT * FROM product_sales; で取得してください",
        hint: "CREATE VIEW product_sales AS SELECT p.name, p.category, SUM(op.quantity) AS 総販売数 FROM order_products op JOIN products p ON op.product_id = p.id GROUP BY p.id, p.name, p.category",
        answer: "CREATE VIEW product_sales AS SELECT p.name, p.category, SUM(op.quantity) AS 総販売数 FROM order_products op JOIN products p ON op.product_id = p.id GROUP BY p.id, p.name, p.category; SELECT * FROM product_sales",
        expectedColumns: ["name", "category", "総販売数"],
      },
      {
        id: "pi-view-4",
        question: "product_salesビューを作成後、SELECT * FROM product_sales WHERE 総販売数 >= 3; でビューに対してWHEREフィルタをかけて取得してください",
        hint: "CREATE VIEW ... として WHERE 総販売数 >= 3",
        answer: "CREATE VIEW product_sales AS SELECT p.name, p.category, SUM(op.quantity) AS 総販売数 FROM order_products op JOIN products p ON op.product_id = p.id GROUP BY p.id, p.name, p.category; SELECT * FROM product_sales WHERE 総販売数 >= 3",
        expectedColumns: ["name", "category", "総販売数"],
      },
      {
        id: "pi-view-5",
        question: "order_summaryビューを作成後、ordersテーブルとJOINして、order_id・status・合計金額を取得してください",
        hint: "CREATE VIEW order_summary AS ... ; SELECT os.order_id, o.status, os.合計金額 FROM order_summary os JOIN orders o ON os.order_id = o.id",
        answer: "CREATE VIEW order_summary AS SELECT order_id, SUM(price * quantity) AS 合計金額 FROM order_products GROUP BY order_id; SELECT os.order_id, o.status, os.合計金額 FROM order_summary os JOIN orders o ON os.order_id = o.id",
        expectedColumns: ["order_id", "status", "合計金額"],
      },
    ],
  },
  {
    slug: "pi-advanced-subquery",
    title: "高度なサブクエリ",
    level: "intermediate",
    order: 18,
    description: "相関サブクエリ・スカラーサブクエリ・FROM句のサブクエリなど高度なサブクエリ技法を学びます",
    content: `
<h2>サブクエリの種類</h2>
<table>
  <tr><th>種類</th><th>場所</th><th>説明</th></tr>
  <tr><td>スカラーサブクエリ</td><td>SELECT句</td><td>1行1列を返す</td></tr>
  <tr><td>相関サブクエリ</td><td>WHERE句</td><td>外側クエリの値を参照</td></tr>
  <tr><td>インラインビュー</td><td>FROM句</td><td>一時テーブルとして扱う</td></tr>
</table>

<h2>使用例</h2>
<pre><code><span class="sql-comment">-- スカラーサブクエリ（SELECT句）</span>
<span class="sql-keyword">SELECT</span> name, price,
  (<span class="sql-keyword">SELECT</span> <span class="sql-function">AVG</span>(price) <span class="sql-keyword">FROM</span> products) <span class="sql-keyword">AS</span> 平均価格
<span class="sql-keyword">FROM</span> products;

<span class="sql-comment">-- 相関サブクエリ（WHERE句）</span>
<span class="sql-keyword">SELECT</span> name, price <span class="sql-keyword">FROM</span> products p
<span class="sql-keyword">WHERE</span> price > (
  <span class="sql-keyword">SELECT</span> <span class="sql-function">AVG</span>(price) <span class="sql-keyword">FROM</span> products
    <span class="sql-keyword">WHERE</span> category = p.category
);</code></pre>
    `,
    exercises: [
      {
        id: "pi-subq-1",
        question: "スカラーサブクエリを使って、productsのname・priceと、products全体の平均価格（AVG(price)）を「全体平均」として各行に表示してください",
        hint: "(SELECT AVG(price) FROM products) AS 全体平均",
        answer: "SELECT name, price, (SELECT AVG(price) FROM products) AS 全体平均 FROM products",
        expectedColumns: ["name", "price", "全体平均"],
      },
      {
        id: "pi-subq-2",
        question: "相関サブクエリを使って、productsのname・category・priceを取得し、同じカテゴリ内の平均価格より高い商品のみ表示してください",
        hint: "WHERE price > (SELECT AVG(price) FROM products WHERE category = p.category)",
        answer: "SELECT name, category, price FROM products p WHERE price > (SELECT AVG(price) FROM products WHERE category = p.category)",
        expectedColumns: ["name", "category", "price"],
      },
      {
        id: "pi-subq-3",
        question: "FROM句のサブクエリ（インラインビュー）を使って、order_productsからorder_idごとの合計金額を求め、その結果から合計金額が最大のorder_idと合計金額を取得してください",
        hint: "SELECT * FROM (SELECT order_id, SUM(price*quantity) AS 合計金額 FROM order_products GROUP BY order_id) ORDER BY 合計金額 DESC LIMIT 1",
        answer: "SELECT * FROM (SELECT order_id, SUM(price * quantity) AS 合計金額 FROM order_products GROUP BY order_id) ORDER BY 合計金額 DESC LIMIT 1",
        expectedColumns: ["order_id", "合計金額"],
      },
      {
        id: "pi-subq-4",
        question: "IN句のサブクエリを使って、statusが'completed'の注文に含まれるproduct_idを持つ商品のname・category・priceを取得してください",
        hint: "WHERE id IN (SELECT product_id FROM order_products WHERE order_id IN (SELECT id FROM orders WHERE status = 'completed'))",
        answer: "SELECT name, category, price FROM products WHERE id IN (SELECT product_id FROM order_products WHERE order_id IN (SELECT id FROM orders WHERE status = 'completed'))",
        expectedColumns: ["name", "category", "price"],
      },
      {
        id: "pi-subq-5",
        question: "スカラーサブクエリを使って、usersのname・cityと、そのユーザーの注文数（ordersテーブルのCOUNT(*)）を「注文数」として各行に表示してください（相関サブクエリ）",
        hint: "(SELECT COUNT(*) FROM orders WHERE user_id = u.id) AS 注文数",
        answer: "SELECT name, city, (SELECT COUNT(*) FROM orders WHERE user_id = u.id) AS 注文数 FROM users u",
        expectedColumns: ["name", "city", "注文数"],
      },
    ],
  },
  {
    slug: "pi-comprehensive",
    title: "総合演習（中級）",
    level: "intermediate",
    order: 19,
    description: "中級コースで学んだウィンドウ関数・CTE・EXISTS・集合演算・サブクエリを組み合わせた総合演習です",
    content: `
<h2>中級コースのまとめ</h2>
<p>これまで学んだ中級技術を組み合わせた実践的な問題に挑戦しましょう。</p>

<ul>
  <li>ウィンドウ関数（ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD）</li>
  <li>CTE（WITH句）</li>
  <li>EXISTS / NOT EXISTS</li>
  <li>UNION / INTERSECT / EXCEPT</li>
  <li>SELF JOIN / CROSS JOIN</li>
  <li>ビュー（CREATE VIEW）</li>
  <li>高度なサブクエリ</li>
</ul>

<h2>組み合わせのヒント</h2>
<pre><code><span class="sql-comment">-- CTEとウィンドウ関数の組み合わせ</span>
<span class="sql-keyword">WITH</span> ranked <span class="sql-keyword">AS</span> (
  <span class="sql-keyword">SELECT</span> name, price,
    <span class="sql-function">RANK</span>() <span class="sql-keyword">OVER</span> (<span class="sql-keyword">PARTITION BY</span> category <span class="sql-keyword">ORDER BY</span> price <span class="sql-keyword">DESC</span>) <span class="sql-keyword">AS</span> rk
  <span class="sql-keyword">FROM</span> products
)
<span class="sql-keyword">SELECT</span> * <span class="sql-keyword">FROM</span> ranked <span class="sql-keyword">WHERE</span> rk = <span class="sql-number">1</span>;</code></pre>
    `,
    exercises: [
      {
        id: "pi-comp-1",
        question: "CTEとRANK()を組み合わせて、productsのcategoryごとにprice降順でRANK付けし、各カテゴリで1位の商品のname・category・priceを取得してください",
        hint: "WITH ranked AS (SELECT ..., RANK() OVER (PARTITION BY category ORDER BY price DESC) AS rk FROM products) SELECT ... WHERE rk = 1",
        answer: "WITH ranked AS (SELECT name, category, price, RANK() OVER (PARTITION BY category ORDER BY price DESC) AS rk FROM products) SELECT name, category, price FROM ranked WHERE rk = 1",
        expectedColumns: ["name", "category", "price"],
      },
      {
        id: "pi-comp-2",
        question: "EXISTSとCTEを組み合わせて、東京ユーザー（CTE）の中で注文が存在するユーザーのname・emailを取得してください",
        hint: "WITH tokyo AS (SELECT id, name, email FROM users WHERE city = '東京') SELECT name, email FROM tokyo t WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = t.id)",
        answer: "WITH tokyo AS (SELECT id, name, email FROM users WHERE city = '東京') SELECT name, email FROM tokyo t WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = t.id)",
        expectedColumns: ["name", "email"],
      },
      {
        id: "pi-comp-3",
        question: "UNIONとスカラーサブクエリを組み合わせて、「最高価格商品」（MAX(price)の商品name・price）と「最安価格商品」（MIN(price)の商品name・price）を取得してください",
        hint: "SELECT name, price FROM products WHERE price = (SELECT MAX(price) FROM products) UNION SELECT name, price FROM products WHERE price = (SELECT MIN(price) FROM products)",
        answer: "SELECT name, price FROM products WHERE price = (SELECT MAX(price) FROM products) UNION SELECT name, price FROM products WHERE price = (SELECT MIN(price) FROM products)",
        expectedColumns: ["name", "price"],
      },
      {
        id: "pi-comp-4",
        question: "CTEを2つ使い、CTE1はcompleted注文のuser_idのリスト、CTE2はcancelled注文のuser_idのリストとし、CTE1にあってCTE2にない（EXCEPTを使用）user_idをusersテーブルからnameとともに取得してください",
        hint: "WITH completed_users AS (...), cancelled_users AS (...) SELECT u.id, u.name FROM users u WHERE u.id IN (SELECT user_id FROM completed_users EXCEPT SELECT user_id FROM cancelled_users)",
        answer: "WITH completed_users AS (SELECT user_id FROM orders WHERE status = 'completed'), cancelled_users AS (SELECT user_id FROM orders WHERE status = 'cancelled') SELECT u.id, u.name FROM users u WHERE u.id IN (SELECT user_id FROM completed_users EXCEPT SELECT user_id FROM cancelled_users)",
        expectedColumns: ["id", "name"],
      },
      {
        id: "pi-comp-5",
        question: "CTEでorder_productsのorder_idごとの合計金額を求め、LAG()でその前の注文の合計金額を「前回合計」として取得し、合計金額と前回合計の差を「増減」として表示してください（order_id昇順）",
        hint: "WITH totals AS (SELECT order_id, SUM(price*quantity) AS 合計金額 FROM order_products GROUP BY order_id) SELECT order_id, 合計金額, LAG(合計金額) OVER (ORDER BY order_id) AS 前回合計, 合計金額 - LAG(合計金額) OVER (ORDER BY order_id) AS 増減 FROM totals",
        answer: "WITH totals AS (SELECT order_id, SUM(price * quantity) AS 合計金額 FROM order_products GROUP BY order_id) SELECT order_id, 合計金額, LAG(合計金額) OVER (ORDER BY order_id) AS 前回合計, 合計金額 - LAG(合計金額) OVER (ORDER BY order_id) AS 増減 FROM totals",
        expectedColumns: ["order_id", "合計金額", "前回合計", "増減"],
      },
    ],
  },
  {
    slug: "pi-window-advanced",
    title: "ウィンドウ関数応用 NTILE・FIRST_VALUE・移動平均",
    level: "intermediate",
    order: 20,
    description: "NTILE・FIRST_VALUE・LAST_VALUE・移動平均など上級ウィンドウ関数を学びます",
    content: `
<h2>上級ウィンドウ関数</h2>
<table>
  <tr><th>関数</th><th>説明</th></tr>
  <tr><td>NTILE(n)</td><td>行をn個のバケツに均等分割</td></tr>
  <tr><td>FIRST_VALUE(col)</td><td>ウィンドウ内の最初の値</td></tr>
  <tr><td>LAST_VALUE(col)</td><td>ウィンドウ内の最後の値</td></tr>
  <tr><td>AVG(...) OVER (...)</td><td>移動平均</td></tr>
</table>

<h2>使用例</h2>
<pre><code><span class="sql-comment">-- 価格で4段階に分割</span>
<span class="sql-keyword">SELECT</span> name, price,
  <span class="sql-function">NTILE</span>(<span class="sql-number">4</span>) <span class="sql-keyword">OVER</span> (<span class="sql-keyword">ORDER BY</span> price) <span class="sql-keyword">AS</span> 四分位
<span class="sql-keyword">FROM</span> products;

<span class="sql-comment">-- カテゴリ内で最安値を各行に表示</span>
<span class="sql-keyword">SELECT</span> name, category, price,
  <span class="sql-function">FIRST_VALUE</span>(price) <span class="sql-keyword">OVER</span> (
    <span class="sql-keyword">PARTITION BY</span> category <span class="sql-keyword">ORDER BY</span> price
  ) <span class="sql-keyword">AS</span> カテゴリ最安値
<span class="sql-keyword">FROM</span> products;</code></pre>
    `,
    exercises: [
      {
        id: "pi-wadv-1",
        question: "productsテーブルのname・priceと、price昇順でNTILE(4)を「四分位」として取得してください",
        hint: "NTILE(4) OVER (ORDER BY price) AS 四分位",
        answer: "SELECT name, price, NTILE(4) OVER (ORDER BY price) AS 四分位 FROM products",
        expectedColumns: ["name", "price", "四分位"],
      },
      {
        id: "pi-wadv-2",
        question: "productsテーブルのname・category・priceと、カテゴリ内でprice昇順のFIRST_VALUE(price)を「カテゴリ最安値」として取得してください",
        hint: "FIRST_VALUE(price) OVER (PARTITION BY category ORDER BY price) AS カテゴリ最安値",
        answer: "SELECT name, category, price, FIRST_VALUE(price) OVER (PARTITION BY category ORDER BY price) AS カテゴリ最安値 FROM products",
        expectedColumns: ["name", "category", "price", "カテゴリ最安値"],
      },
      {
        id: "pi-wadv-3",
        question: "order_productsのidとprice*quantityを「小計」として、id昇順の3行移動平均（ROWS BETWEEN 2 PRECEDING AND CURRENT ROW）をROUND小数点以下1桁で「移動平均3行」として取得してください",
        hint: "ROUND(AVG(price * quantity) OVER (ORDER BY id ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 1) AS 移動平均3行",
        answer: "SELECT id, price * quantity AS 小計, ROUND(AVG(price * quantity) OVER (ORDER BY id ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 1) AS 移動平均3行 FROM order_products",
        expectedColumns: ["id", "小計", "移動平均3行"],
      },
      {
        id: "pi-wadv-4",
        question: "CTEとNTILE(3)を組み合わせて、productsをprice昇順で3グループに分割し、グループ番号が3（最高価格グループ）のname・price・グループを取得してください",
        hint: "WITH bucketed AS (SELECT name, price, NTILE(3) OVER (ORDER BY price) AS グループ FROM products) SELECT * FROM bucketed WHERE グループ = 3",
        answer: "WITH bucketed AS (SELECT name, price, NTILE(3) OVER (ORDER BY price) AS グループ FROM products) SELECT name, price, グループ FROM bucketed WHERE グループ = 3",
        expectedColumns: ["name", "price", "グループ"],
      },
      {
        id: "pi-wadv-5",
        question: "order_productsのidとprice*quantityを「小計」として、id昇順でFIRST_VALUE(price*quantity)を「初回小計」、SUM(price*quantity)のUNBOUNDED PRECEDING〜CURRENT ROWの累積合計を「累積合計」として取得してください",
        hint: "FIRST_VALUE(price*quantity) OVER (ORDER BY id) AS 初回小計, SUM(price*quantity) OVER (ORDER BY id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS 累積合計",
        answer: "SELECT id, price * quantity AS 小計, FIRST_VALUE(price * quantity) OVER (ORDER BY id) AS 初回小計, SUM(price * quantity) OVER (ORDER BY id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS 累積合計 FROM order_products",
        expectedColumns: ["id", "小計", "初回小計", "累積合計"],
      },
    ],
  },
];
