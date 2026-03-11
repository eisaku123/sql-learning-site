import type { Lesson } from "@/types";

export const PREMIUM_LESSONS: Lesson[] = [
  // ========= プレミアム初級コース =========
  {
    slug: "pb-null",
    title: "NULL値の扱い",
    level: "beginner",
    order: 1,
    description: "NULLの概念とIS NULL・COALESCE・NULLIFの使い方を学びます",
    content: `
<h2>NULLとは？</h2>
<p><strong>NULL</strong>は「値が存在しない」ことを表す特別な値です。0でも空文字でもなく、「不明・未入力」を意味します。</p>

<h2>IS NULL / IS NOT NULL</h2>
<p>NULLかどうかの比較には <code>=</code> は使えません。<code>IS NULL</code> / <code>IS NOT NULL</code> を使います。</p>

<pre><code><span class="sql-keyword">SELECT</span> * <span class="sql-keyword">FROM</span> employees <span class="sql-keyword">WHERE</span> salary <span class="sql-keyword">IS NOT NULL</span>;</code></pre>

<h2>COALESCE — NULLを別の値に置換</h2>
<p>引数の中で最初にNULLでない値を返します。</p>
<pre><code><span class="sql-keyword">SELECT</span> name, <span class="sql-function">COALESCE</span>(salary, <span class="sql-number">0</span>) <span class="sql-keyword">AS</span> 給与 <span class="sql-keyword">FROM</span> employees;</code></pre>

<h2>NULLIF — 条件が一致したらNULLを返す</h2>
<p>2つの値が等しい場合にNULLを返し、そうでなければ第1引数を返します。</p>
<pre><code><span class="sql-keyword">SELECT</span> name, <span class="sql-function">NULLIF</span>(salary, <span class="sql-number">0</span>) <span class="sql-keyword">AS</span> salary <span class="sql-keyword">FROM</span> employees;</code></pre>

<h2>IFNULL（SQLite専用）</h2>
<pre><code><span class="sql-keyword">SELECT</span> name, <span class="sql-function">IFNULL</span>(salary, <span class="sql-number">0</span>) <span class="sql-keyword">AS</span> 給与 <span class="sql-keyword">FROM</span> employees;</code></pre>
    `,
    exercises: [
      {
        id: "pb-null-1",
        question: "employeesテーブルからnameがNULLでない従業員のnameを全件取得してください",
        hint: "WHERE name IS NOT NULL",
        answer: "SELECT name FROM employees WHERE name IS NOT NULL",
        expectedColumns: ["name"],
      },
      {
        id: "pb-null-2",
        question: "employeesテーブルのnameとsalaryを取得し、salaryがNULLの場合は0に置換して「給与」という列名で表示してください",
        hint: "COALESCE(salary, 0) AS 給与",
        answer: "SELECT name, COALESCE(salary, 0) AS 給与 FROM employees",
        expectedColumns: ["name", "給与"],
      },
      {
        id: "pb-null-3",
        question: "employeesテーブルからhire_dateがNULLでない従業員のnameとhire_dateをhire_dateの昇順で取得してください",
        hint: "WHERE hire_date IS NOT NULL ORDER BY hire_date ASC",
        answer: "SELECT name, hire_date FROM employees WHERE hire_date IS NOT NULL ORDER BY hire_date ASC",
        expectedColumns: ["name", "hire_date"],
      },
      {
        id: "pb-null-4",
        question: "NULLIF関数を使い、employeesのsalaryが450000の場合はNULLに変換し、nameとadjusted_salaryとして取得してください",
        hint: "NULLIF(salary, 450000) AS adjusted_salary",
        answer: "SELECT name, NULLIF(salary, 450000) AS adjusted_salary FROM employees",
        expectedColumns: ["name", "adjusted_salary"],
      },
      {
        id: "pb-null-5",
        question: "productsテーブルからstockがNULLでない商品のname・price・stockを取得してください",
        hint: "WHERE stock IS NOT NULL",
        answer: "SELECT name, price, stock FROM products WHERE stock IS NOT NULL",
        expectedColumns: ["name", "price", "stock"],
      },
    ],
  },
  {
    slug: "pb-string-functions",
    title: "文字列関数",
    level: "beginner",
    order: 2,
    description: "LENGTH・SUBSTR・REPLACE・INSTR・文字連結など文字列操作を学びます",
    content: `
<h2>文字列関数一覧</h2>
<table>
  <tr><th>関数</th><th>説明</th><th>例</th></tr>
  <tr><td>LENGTH(s)</td><td>文字数を返す</td><td>LENGTH('hello') → 5</td></tr>
  <tr><td>SUBSTR(s,n,len)</td><td>部分文字列を取得</td><td>SUBSTR('田中太郎',1,2) → '田中'</td></tr>
  <tr><td>REPLACE(s,old,new)</td><td>文字列を置換</td><td>REPLACE('ab cd','cd','EF')</td></tr>
  <tr><td>INSTR(s,sub)</td><td>部分文字列の位置</td><td>INSTR('hello','ll') → 3</td></tr>
  <tr><td>s1 || s2</td><td>文字連結</td><td>'田' || '中' → '田中'</td></tr>
  <tr><td>TRIM(s)</td><td>前後の空白を除去</td><td>TRIM(' abc ') → 'abc'</td></tr>
</table>

<h2>使用例</h2>
<pre><code><span class="sql-comment">-- 名前の文字数を取得</span>
<span class="sql-keyword">SELECT</span> name, <span class="sql-function">LENGTH</span>(name) <span class="sql-keyword">AS</span> 文字数 <span class="sql-keyword">FROM</span> employees;

<span class="sql-comment">-- 名前と部署名を連結</span>
<span class="sql-keyword">SELECT</span> name <span class="sql-keyword">||</span> <span class="sql-string">' ('</span> <span class="sql-keyword">||</span> department_id <span class="sql-keyword">||</span> <span class="sql-string">')'</span> <span class="sql-keyword">AS</span> 表示名 <span class="sql-keyword">FROM</span> employees;

<span class="sql-comment">-- 空白を除去</span>
<span class="sql-keyword">SELECT</span> <span class="sql-function">REPLACE</span>(name, <span class="sql-string">' '</span>, <span class="sql-string">''</span>) <span class="sql-keyword">AS</span> 連続名 <span class="sql-keyword">FROM</span> employees;</code></pre>
    `,
    exercises: [
      {
        id: "pb-str-1",
        question: "employeesテーブルのnameと、nameの文字数を「文字数」という列名で取得してください",
        hint: "LENGTH(name) AS 文字数",
        answer: "SELECT name, LENGTH(name) AS 文字数 FROM employees",
        expectedColumns: ["name", "文字数"],
      },
      {
        id: "pb-str-2",
        question: "employeesテーブルのnameから最初の2文字（苗字）をSUBSTRで取得し、「苗字」として表示してください",
        hint: "SUBSTR(name, 1, 2) AS 苗字",
        answer: "SELECT name, SUBSTR(name, 1, 2) AS 苗字 FROM employees",
        expectedColumns: ["name", "苗字"],
      },
      {
        id: "pb-str-3",
        question: "employeesテーブルのnameの空白をREPLACEで除去し、「連続名」として表示してください",
        hint: "REPLACE(name, ' ', '') AS 連続名",
        answer: "SELECT name, REPLACE(name, ' ', '') AS 連続名 FROM employees",
        expectedColumns: ["name", "連続名"],
      },
      {
        id: "pb-str-4",
        question: "productsテーブルのnameとcategoryを「|」で連結し、「商品情報」として取得してください",
        hint: "name || ' | ' || category AS 商品情報",
        answer: "SELECT name || ' | ' || category AS 商品情報 FROM products",
        expectedColumns: ["商品情報"],
      },
      {
        id: "pb-str-5",
        question: "productsテーブルのnameから「PC」という文字列の開始位置をINSTRで取得し、nameと「位置」として表示してください",
        hint: "INSTR(name, 'PC') AS 位置",
        answer: "SELECT name, INSTR(name, 'PC') AS 位置 FROM products",
        expectedColumns: ["name", "位置"],
      },
    ],
  },
  {
    slug: "pb-numeric-functions",
    title: "数値関数",
    level: "beginner",
    order: 3,
    description: "ROUND・ABS・CAST・算術演算などの数値操作を学びます",
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
<pre><code><span class="sql-comment">-- 給与を千円単位に丸める</span>
<span class="sql-keyword">SELECT</span> name, <span class="sql-function">ROUND</span>(salary / <span class="sql-number">1000.0</span>, <span class="sql-number">1</span>) <span class="sql-keyword">AS</span> 給与_千円 <span class="sql-keyword">FROM</span> employees;

<span class="sql-comment">-- 50万との差の絶対値</span>
<span class="sql-keyword">SELECT</span> name, <span class="sql-function">ABS</span>(salary - <span class="sql-number">500000</span>) <span class="sql-keyword">AS</span> 差額 <span class="sql-keyword">FROM</span> employees;

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
        question: "employeesテーブルのnameと、salaryと500000との差の絶対値を「差額」として取得してください",
        hint: "ABS(salary - 500000) AS 差額",
        answer: "SELECT name, ABS(salary - 500000) AS 差額 FROM employees",
        expectedColumns: ["name", "差額"],
      },
      {
        id: "pb-num-3",
        question: "ordersテーブルのidとquantityと、quantityを3で割った余りを「余り」として取得してください",
        hint: "quantity % 3 AS 余り",
        answer: "SELECT id, quantity, quantity % 3 AS 余り FROM orders",
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
        question: "employeesテーブルのnameとsalaryと、salaryの85%をCAST(AS INTEGER)した「差引額」を取得してください",
        hint: "CAST(salary * 0.85 AS INTEGER) AS 差引額",
        answer: "SELECT name, salary, CAST(salary * 0.85 AS INTEGER) AS 差引額 FROM employees",
        expectedColumns: ["name", "salary", "差引額"],
      },
    ],
  },
  {
    slug: "pb-date-functions",
    title: "日付・時刻関数",
    level: "beginner",
    order: 4,
    description: "strftime・date・年月日の抽出など日付操作を学びます",
    content: `
<h2>SQLiteの日付関数</h2>
<table>
  <tr><th>関数</th><th>説明</th></tr>
  <tr><td>date('now')</td><td>今日の日付（YYYY-MM-DD）</td></tr>
  <tr><td>strftime('%Y', d)</td><td>年を4桁で取得</td></tr>
  <tr><td>strftime('%m', d)</td><td>月を2桁で取得</td></tr>
  <tr><td>strftime('%d', d)</td><td>日を2桁で取得</td></tr>
  <tr><td>strftime('%Y-%m', d)</td><td>年月（YYYY-MM）</td></tr>
</table>

<h2>使用例</h2>
<pre><code><span class="sql-comment">-- 入社年を取得</span>
<span class="sql-keyword">SELECT</span> name, <span class="sql-function">strftime</span>(<span class="sql-string">'%Y'</span>, hire_date) <span class="sql-keyword">AS</span> 入社年 <span class="sql-keyword">FROM</span> employees;

<span class="sql-comment">-- 2020年以降の入社者を絞り込む</span>
<span class="sql-keyword">SELECT</span> name, hire_date <span class="sql-keyword">FROM</span> employees
<span class="sql-keyword">WHERE</span> <span class="sql-function">strftime</span>(<span class="sql-string">'%Y'</span>, hire_date) >= <span class="sql-string">'2020'</span>;

<span class="sql-comment">-- 今日の日付</span>
<span class="sql-keyword">SELECT</span> <span class="sql-function">date</span>(<span class="sql-string">'now'</span>) <span class="sql-keyword">AS</span> 今日;</code></pre>
    `,
    exercises: [
      {
        id: "pb-date-1",
        question: "employeesテーブルのnameと、hire_dateから年だけを「入社年」として取得してください",
        hint: "strftime('%Y', hire_date) AS 入社年",
        answer: "SELECT name, strftime('%Y', hire_date) AS 入社年 FROM employees",
        expectedColumns: ["name", "入社年"],
      },
      {
        id: "pb-date-2",
        question: "employeesテーブルのnameと、hire_dateから月だけを「入社月」として取得してください",
        hint: "strftime('%m', hire_date) AS 入社月",
        answer: "SELECT name, strftime('%m', hire_date) AS 入社月 FROM employees",
        expectedColumns: ["name", "入社月"],
      },
      {
        id: "pb-date-3",
        question: "今日の日付を「今日」という列名で取得してください",
        hint: "SELECT date('now') AS 今日",
        answer: "SELECT date('now') AS 今日",
        expectedColumns: ["今日"],
      },
      {
        id: "pb-date-4",
        question: "ordersテーブルから2024年のデータだけを絞り込み、id・order_date・customer_nameを取得してください",
        hint: "WHERE strftime('%Y', order_date) = '2024'",
        answer: "SELECT id, order_date, customer_name FROM orders WHERE strftime('%Y', order_date) = '2024'",
        expectedColumns: ["id", "order_date", "customer_name"],
      },
      {
        id: "pb-date-5",
        question: "employeesテーブルのnameと、hire_dateを年月形式（YYYY-MM）にした「入社年月」をhire_dateの昇順で取得してください",
        hint: "strftime('%Y-%m', hire_date) AS 入社年月 ORDER BY hire_date",
        answer: "SELECT name, strftime('%Y-%m', hire_date) AS 入社年月 FROM employees ORDER BY hire_date",
        expectedColumns: ["name", "入社年月"],
      },
    ],
  },
  {
    slug: "pb-case",
    title: "CASE式で条件分岐",
    level: "beginner",
    order: 5,
    description: "CASE WHENを使ったデータの分類・ランク付け・集計を学びます",
    content: `
<h2>CASE式の構文</h2>
<pre><code><span class="sql-keyword">CASE</span>
  <span class="sql-keyword">WHEN</span> 条件1 <span class="sql-keyword">THEN</span> 値1
  <span class="sql-keyword">WHEN</span> 条件2 <span class="sql-keyword">THEN</span> 値2
  <span class="sql-keyword">ELSE</span> デフォルト値
<span class="sql-keyword">END</span> <span class="sql-keyword">AS</span> 列名</code></pre>

<h2>給与ランク分類の例</h2>
<pre><code><span class="sql-keyword">SELECT</span> name, salary,
  <span class="sql-keyword">CASE</span>
    <span class="sql-keyword">WHEN</span> salary >= <span class="sql-number">550000</span> <span class="sql-keyword">THEN</span> <span class="sql-string">'高'</span>
    <span class="sql-keyword">WHEN</span> salary >= <span class="sql-number">450000</span> <span class="sql-keyword">THEN</span> <span class="sql-string">'中'</span>
    <span class="sql-keyword">ELSE</span> <span class="sql-string">'低'</span>
  <span class="sql-keyword">END</span> <span class="sql-keyword">AS</span> 給与ランク
<span class="sql-keyword">FROM</span> employees;</code></pre>

<h2>CASE式 + GROUP BY で集計</h2>
<pre><code><span class="sql-keyword">SELECT</span>
  <span class="sql-keyword">CASE</span>
    <span class="sql-keyword">WHEN</span> salary >= <span class="sql-number">550000</span> <span class="sql-keyword">THEN</span> <span class="sql-string">'高'</span>
    <span class="sql-keyword">WHEN</span> salary >= <span class="sql-number">450000</span> <span class="sql-keyword">THEN</span> <span class="sql-string">'中'</span>
    <span class="sql-keyword">ELSE</span> <span class="sql-string">'低'</span>
  <span class="sql-keyword">END</span> <span class="sql-keyword">AS</span> 給与ランク,
  <span class="sql-function">COUNT</span>(*) <span class="sql-keyword">AS</span> 人数
<span class="sql-keyword">FROM</span> employees
<span class="sql-keyword">GROUP BY</span> 給与ランク;</code></pre>
    `,
    exercises: [
      {
        id: "pb-case-1",
        question: "employeesのname・salaryと、salary>=550000を「高」、>=450000を「中」、それ以外を「低」とした「給与ランク」を取得してください",
        hint: "CASE WHEN salary >= 550000 THEN '高' WHEN salary >= 450000 THEN '中' ELSE '低' END AS 給与ランク",
        answer: "SELECT name, salary, CASE WHEN salary >= 550000 THEN '高' WHEN salary >= 450000 THEN '中' ELSE '低' END AS 給与ランク FROM employees",
        expectedColumns: ["name", "salary", "給与ランク"],
      },
      {
        id: "pb-case-2",
        question: "departmentsのname・locationと、locationが「東京」なら「首都圏」、それ以外なら「地方」とした「エリア」を取得してください",
        hint: "CASE WHEN location = '東京' THEN '首都圏' ELSE '地方' END AS エリア",
        answer: "SELECT name, location, CASE WHEN location = '東京' THEN '首都圏' ELSE '地方' END AS エリア FROM departments",
        expectedColumns: ["name", "location", "エリア"],
      },
      {
        id: "pb-case-3",
        question: "ordersのidとquantityと、quantity>=10なら「大口」、>=5なら「中口」、それ以外なら「小口」とした「規模」を取得してください",
        hint: "CASE WHEN quantity >= 10 THEN '大口' ...",
        answer: "SELECT id, quantity, CASE WHEN quantity >= 10 THEN '大口' WHEN quantity >= 5 THEN '中口' ELSE '小口' END AS 規模 FROM orders",
        expectedColumns: ["id", "quantity", "規模"],
      },
      {
        id: "pb-case-4",
        question: "productsのname・categoryと、categoryが「パソコン」なら「10%」、「ディスプレイ」なら「5%」、それ以外なら「3%」とした「割引率」を取得してください",
        hint: "CASE WHEN category = 'パソコン' THEN '10%' ...",
        answer: "SELECT name, category, CASE WHEN category = 'パソコン' THEN '10%' WHEN category = 'ディスプレイ' THEN '5%' ELSE '3%' END AS 割引率 FROM products",
        expectedColumns: ["name", "category", "割引率"],
      },
      {
        id: "pb-case-5",
        question: "CASE式とGROUP BYを組み合わせ、employeesの給与ランク（高/中/低）別の人数を「給与ランク」と「人数」として取得してください",
        hint: "GROUP BY 給与ランク で集計します",
        answer: "SELECT CASE WHEN salary >= 550000 THEN '高' WHEN salary >= 450000 THEN '中' ELSE '低' END AS 給与ランク, COUNT(*) AS 人数 FROM employees GROUP BY 給与ランク",
        expectedColumns: ["給与ランク", "人数"],
      },
    ],
  },
  {
    slug: "pb-advanced-where",
    title: "複合条件の応用",
    level: "beginner",
    order: 6,
    description: "AND・OR・IN・BETWEEN・LIKEを組み合わせた高度な絞り込みを学びます",
    content: `
<h2>複合条件の基本</h2>
<pre><code><span class="sql-comment">-- AND: 両方の条件を満たす</span>
<span class="sql-keyword">WHERE</span> salary >= <span class="sql-number">500000</span> <span class="sql-keyword">AND</span> department_id = <span class="sql-number">2</span>

<span class="sql-comment">-- OR: どちらかの条件を満たす</span>
<span class="sql-keyword">WHERE</span> department_id = <span class="sql-number">1</span> <span class="sql-keyword">OR</span> department_id = <span class="sql-number">3</span>

<span class="sql-comment">-- NOT: 条件を反転</span>
<span class="sql-keyword">WHERE NOT</span> (salary < <span class="sql-number">400000</span>)</code></pre>

<h2>IN・BETWEEN・LIKEの組み合わせ</h2>
<pre><code><span class="sql-comment">-- IN: 複数値の指定</span>
<span class="sql-keyword">WHERE</span> department_id <span class="sql-keyword">IN</span> (<span class="sql-number">1</span>, <span class="sql-number">2</span>, <span class="sql-number">3</span>)

<span class="sql-comment">-- BETWEEN: 範囲指定</span>
<span class="sql-keyword">WHERE</span> salary <span class="sql-keyword">BETWEEN</span> <span class="sql-number">400000</span> <span class="sql-keyword">AND</span> <span class="sql-number">550000</span>

<span class="sql-comment">-- LIKE: パターンマッチ（% = 任意文字列、_ = 任意1文字）</span>
<span class="sql-keyword">WHERE</span> name <span class="sql-keyword">LIKE</span> <span class="sql-string">'田%'</span> <span class="sql-keyword">OR</span> name <span class="sql-keyword">LIKE</span> <span class="sql-string">'鈴%'</span></code></pre>

<h2>括弧で優先順位を制御</h2>
<pre><code><span class="sql-keyword">WHERE</span> (department_id = <span class="sql-number">1</span> <span class="sql-keyword">OR</span> department_id = <span class="sql-number">2</span>)
  <span class="sql-keyword">AND</span> salary >= <span class="sql-number">500000</span></code></pre>
    `,
    exercises: [
      {
        id: "pb-where-1",
        question: "employeesからsalaryが500000以上かつdepartment_idが2の従業員のname・salary・department_idを取得してください",
        hint: "WHERE salary >= 500000 AND department_id = 2",
        answer: "SELECT name, salary, department_id FROM employees WHERE salary >= 500000 AND department_id = 2",
        expectedColumns: ["name", "salary", "department_id"],
      },
      {
        id: "pb-where-2",
        question: "employeesからdepartment_idが1または3の従業員のname・department_id・salaryをsalary降順で取得してください",
        hint: "WHERE department_id IN (1, 3) ORDER BY salary DESC",
        answer: "SELECT name, department_id, salary FROM employees WHERE department_id IN (1, 3) ORDER BY salary DESC",
        expectedColumns: ["name", "department_id", "salary"],
      },
      {
        id: "pb-where-3",
        question: "productsからpriceが10000以上かつstockが50以下の商品のname・price・stockを取得してください",
        hint: "WHERE price >= 10000 AND stock <= 50",
        answer: "SELECT name, price, stock FROM products WHERE price >= 10000 AND stock <= 50",
        expectedColumns: ["name", "price", "stock"],
      },
      {
        id: "pb-where-4",
        question: "employeesからnameが「田」または「鈴」で始まる従業員のname・salaryを取得してください",
        hint: "WHERE name LIKE '田%' OR name LIKE '鈴%'",
        answer: "SELECT name, salary FROM employees WHERE name LIKE '田%' OR name LIKE '鈴%'",
        expectedColumns: ["name", "salary"],
      },
      {
        id: "pb-where-5",
        question: "ordersからquantityが3以上10以下かつorder_dateが2024-03-01以降のid・quantity・order_dateを取得してください",
        hint: "WHERE quantity BETWEEN 3 AND 10 AND order_date >= '2024-03-01'",
        answer: "SELECT id, quantity, order_date FROM orders WHERE quantity BETWEEN 3 AND 10 AND order_date >= '2024-03-01'",
        expectedColumns: ["id", "quantity", "order_date"],
      },
    ],
  },
  {
    slug: "pb-calculations",
    title: "SELECT計算式と集計の組み合わせ",
    level: "beginner",
    order: 7,
    description: "算術式・集計関数・JOINを組み合わせた実践的な集計を学びます",
    content: `
<h2>SELECT内の計算式</h2>
<pre><code><span class="sql-comment">-- 在庫金額（price × stock）</span>
<span class="sql-keyword">SELECT</span> name, price * stock <span class="sql-keyword">AS</span> 在庫金額 <span class="sql-keyword">FROM</span> products;

<span class="sql-comment">-- 月給 × 12ヶ月 + ボーナス</span>
<span class="sql-keyword">SELECT</span> name, salary * <span class="sql-number">12</span> + <span class="sql-number">50000</span> <span class="sql-keyword">AS</span> 年収 <span class="sql-keyword">FROM</span> employees;</code></pre>

<h2>JOINと計算を組み合わせる</h2>
<pre><code><span class="sql-comment">-- 注文金額（price × quantity）</span>
<span class="sql-keyword">SELECT</span> o.id, p.name, o.quantity, p.price * o.quantity <span class="sql-keyword">AS</span> 注文金額
<span class="sql-keyword">FROM</span> orders o
<span class="sql-keyword">JOIN</span> products p <span class="sql-keyword">ON</span> o.product_id = p.id;</code></pre>

<h2>集計と計算</h2>
<pre><code><span class="sql-keyword">SELECT</span> category,
  <span class="sql-function">SUM</span>(price * stock) <span class="sql-keyword">AS</span> 総在庫金額,
  <span class="sql-function">AVG</span>(price) <span class="sql-keyword">AS</span> 平均価格
<span class="sql-keyword">FROM</span> products
<span class="sql-keyword">GROUP BY</span> category;</code></pre>
    `,
    exercises: [
      {
        id: "pb-calc-1",
        question: "productsテーブルのnameと、price × stockの「在庫金額」を在庫金額の降順で取得してください",
        hint: "price * stock AS 在庫金額 ORDER BY 在庫金額 DESC",
        answer: "SELECT name, price * stock AS 在庫金額 FROM products ORDER BY 在庫金額 DESC",
        expectedColumns: ["name", "在庫金額"],
      },
      {
        id: "pb-calc-2",
        question: "employeesのnameとsalaryと、salary×12+50000の「ボーナス込年収」を取得してください",
        hint: "salary * 12 + 50000 AS ボーナス込年収",
        answer: "SELECT name, salary, salary * 12 + 50000 AS ボーナス込年収 FROM employees",
        expectedColumns: ["name", "salary", "ボーナス込年収"],
      },
      {
        id: "pb-calc-3",
        question: "ordersとproductsをJOINし、id・name（商品名）・quantity・price×quantityの「注文金額」を取得してください",
        hint: "orders o JOIN products p ON o.product_id = p.id → p.price * o.quantity AS 注文金額",
        answer: "SELECT o.id, p.name, o.quantity, p.price * o.quantity AS 注文金額 FROM orders o JOIN products p ON o.product_id = p.id",
        expectedColumns: ["id", "name", "quantity", "注文金額"],
      },
      {
        id: "pb-calc-4",
        question: "employeesのnameと、salary÷160.0をROUNDした「時給」を時給の降順で取得してください",
        hint: "ROUND(salary / 160.0) AS 時給 ORDER BY 時給 DESC",
        answer: "SELECT name, ROUND(salary / 160.0) AS 時給 FROM employees ORDER BY 時給 DESC",
        expectedColumns: ["name", "時給"],
      },
      {
        id: "pb-calc-5",
        question: "productsのnameと定価（price AS 定価）と、price×0.8をCAST(AS INTEGER)した「割引価格」を取得してください",
        hint: "price AS 定価, CAST(price * 0.8 AS INTEGER) AS 割引価格",
        answer: "SELECT name, price AS 定価, CAST(price * 0.8 AS INTEGER) AS 割引価格 FROM products",
        expectedColumns: ["name", "定価", "割引価格"],
      },
    ],
  },
  {
    slug: "pb-create-table",
    title: "CREATE TABLEとデータ操作",
    level: "beginner",
    order: 8,
    description: "テーブルの作成・制約・削除など DDLの基礎を学びます",
    content: `
<h2>CREATE TABLE の構文</h2>
<pre><code><span class="sql-keyword">CREATE TABLE</span> customers (
  id    INTEGER <span class="sql-keyword">PRIMARY KEY</span>,
  name  TEXT    <span class="sql-keyword">NOT NULL</span>,
  email TEXT    <span class="sql-keyword">UNIQUE</span>,
  score INTEGER <span class="sql-keyword">DEFAULT</span> <span class="sql-number">0</span> <span class="sql-keyword">CHECK</span>(score >= <span class="sql-number">0</span>)
);</code></pre>

<h2>よく使う制約</h2>
<table>
  <tr><th>制約</th><th>意味</th></tr>
  <tr><td>PRIMARY KEY</td><td>主キー（一意＋NOT NULL）</td></tr>
  <tr><td>NOT NULL</td><td>NULL禁止</td></tr>
  <tr><td>UNIQUE</td><td>重複禁止</td></tr>
  <tr><td>DEFAULT 値</td><td>デフォルト値</td></tr>
  <tr><td>CHECK(条件)</td><td>値の検証</td></tr>
  <tr><td>FOREIGN KEY</td><td>外部キー参照</td></tr>
</table>

<h2>DROP TABLE でテーブル削除</h2>
<pre><code><span class="sql-keyword">DROP TABLE IF EXISTS</span> customers;</code></pre>

<h2>CREATE TABLE AS SELECT</h2>
<pre><code><span class="sql-comment">-- 既存テーブルからデータを使って新テーブル作成</span>
<span class="sql-keyword">CREATE TABLE</span> high_salary <span class="sql-keyword">AS</span>
<span class="sql-keyword">SELECT</span> name, salary <span class="sql-keyword">FROM</span> employees <span class="sql-keyword">WHERE</span> salary >= <span class="sql-number">500000</span>;</code></pre>
    `,
    exercises: [
      {
        id: "pb-ddl-1",
        question: "customersテーブル（id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE）を作成し、sqlite_masterからname・sqlを確認してください",
        hint: "CREATE TABLE customers (...); SELECT name, sql FROM sqlite_master WHERE type='table' AND name='customers';",
        answer: "CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE); SELECT name, sql FROM sqlite_master WHERE type='table' AND name='customers';",
        expectedColumns: ["name", "sql"],
      },
      {
        id: "pb-ddl-2",
        question: "test_tableテーブル（id INTEGER PRIMARY KEY, label TEXT）を作成し、(1, 'テスト')を挿入して全データを取得してください",
        hint: "CREATE TABLE IF NOT EXISTS test_table (...); INSERT INTO test_table VALUES (1, 'テスト'); SELECT * FROM test_table;",
        answer: "CREATE TABLE IF NOT EXISTS test_table (id INTEGER PRIMARY KEY, label TEXT); INSERT INTO test_table VALUES (1, 'テスト'); SELECT * FROM test_table;",
        expectedColumns: ["id", "label"],
      },
      {
        id: "pb-ddl-3",
        question: "products_v2テーブル（id INTEGER PRIMARY KEY, name TEXT NOT NULL, price INTEGER CHECK(price > 0), stock INTEGER DEFAULT 0）を作成し、sqlite_masterのname・sqlを取得してください",
        hint: "CREATE TABLE IF NOT EXISTS products_v2 (...); SELECT name, sql FROM sqlite_master WHERE name='products_v2';",
        answer: "CREATE TABLE IF NOT EXISTS products_v2 (id INTEGER PRIMARY KEY, name TEXT NOT NULL, price INTEGER CHECK(price > 0), stock INTEGER DEFAULT 0); SELECT name, sql FROM sqlite_master WHERE name='products_v2';",
        expectedColumns: ["name", "sql"],
      },
      {
        id: "pb-ddl-4",
        question: "temp_tableテーブル（id INTEGER）を作成後、DROP TABLEで削除し、sqlite_masterに残るテーブルのnameを取得してください",
        hint: "CREATE TABLE IF NOT EXISTS temp_table (id INTEGER); DROP TABLE temp_table; SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;",
        answer: "CREATE TABLE IF NOT EXISTS temp_table (id INTEGER); DROP TABLE temp_table; SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;",
        expectedColumns: ["name"],
      },
      {
        id: "pb-ddl-5",
        question: "CREATE TABLE AS SELECTを使い、salary>=500000の従業員のname・salaryをhigh_salaryテーブルに作成して全データを取得してください",
        hint: "CREATE TABLE high_salary AS SELECT name, salary FROM employees WHERE salary >= 500000; SELECT * FROM high_salary;",
        answer: "CREATE TABLE high_salary AS SELECT name, salary FROM employees WHERE salary >= 500000; SELECT * FROM high_salary;",
        expectedColumns: ["name", "salary"],
      },
    ],
  },
  {
    slug: "pb-transactions",
    title: "トランザクション",
    level: "beginner",
    order: 9,
    description: "BEGIN・COMMIT・ROLLBACKによるトランザクション管理を学びます",
    content: `
<h2>トランザクションとは？</h2>
<p>複数の操作をひとまとまりとして扱う仕組みです。<strong>ACID特性</strong>（原子性・一貫性・独立性・永続性）を保証します。</p>

<h2>基本構文</h2>
<pre><code><span class="sql-keyword">BEGIN</span>;                    <span class="sql-comment">-- トランザクション開始</span>
<span class="sql-keyword">INSERT INTO</span> ...           <span class="sql-comment">-- 操作1</span>
<span class="sql-keyword">UPDATE</span> ...                <span class="sql-comment">-- 操作2</span>
<span class="sql-keyword">COMMIT</span>;                   <span class="sql-comment">-- 確定（全操作を保存）</span>

<span class="sql-comment">-- または</span>
<span class="sql-keyword">ROLLBACK</span>;                 <span class="sql-comment">-- 取消（全操作を元に戻す）</span></code></pre>

<h2>SAVEPOINTで部分的なロールバック</h2>
<pre><code><span class="sql-keyword">BEGIN</span>;
<span class="sql-keyword">INSERT INTO</span> departments (id, name, location) <span class="sql-keyword">VALUES</span> (<span class="sql-number">6</span>, <span class="sql-string">'法務部'</span>, <span class="sql-string">'東京'</span>);
<span class="sql-keyword">SAVEPOINT</span> sp1;
<span class="sql-keyword">INSERT INTO</span> departments (id, name, location) <span class="sql-keyword">VALUES</span> (<span class="sql-number">7</span>, <span class="sql-string">'広報部'</span>, <span class="sql-string">'大阪'</span>);
<span class="sql-keyword">ROLLBACK TO</span> sp1;        <span class="sql-comment">-- id=7だけ取消</span>
<span class="sql-keyword">COMMIT</span>;                 <span class="sql-comment">-- id=6は確定</span></code></pre>
    `,
    exercises: [
      {
        id: "pb-txn-1",
        question: "BEGIN〜COMMITでdepartmentsに(6,'法務部','東京')を追加し、departmentsの全データを取得してください",
        hint: "BEGIN; INSERT INTO departments (id, name, location) VALUES (6, '法務部', '東京'); COMMIT; SELECT * FROM departments;",
        answer: "BEGIN; INSERT INTO departments (id, name, location) VALUES (6, '法務部', '東京'); COMMIT; SELECT * FROM departments;",
        expectedColumns: ["id", "name", "location"],
      },
      {
        id: "pb-txn-2",
        question: "BEGIN〜COMMITで2件INSERT（id=7「広報部/大阪」、id=8「IT部/東京」）し、id>=7のdepartmentsを取得してください",
        hint: "BEGIN; INSERT ...(7,...); INSERT ...(8,...); COMMIT; SELECT * FROM departments WHERE id >= 7;",
        answer: "BEGIN; INSERT INTO departments (id, name, location) VALUES (7, '広報部', '大阪'); INSERT INTO departments (id, name, location) VALUES (8, 'IT部', '東京'); COMMIT; SELECT * FROM departments WHERE id >= 7;",
        expectedColumns: ["id", "name", "location"],
      },
      {
        id: "pb-txn-3",
        question: "BEGIN〜COMMITで従業員id=7のsalaryを700000に更新し、そのname・salaryを取得してください",
        hint: "BEGIN; UPDATE employees SET salary = 700000 WHERE id = 7; COMMIT; SELECT name, salary FROM employees WHERE id = 7;",
        answer: "BEGIN; UPDATE employees SET salary = 700000 WHERE id = 7; COMMIT; SELECT name, salary FROM employees WHERE id = 7;",
        expectedColumns: ["name", "salary"],
      },
      {
        id: "pb-txn-4",
        question: "ROLLBACKを使い、departmentsへのDELETEを取り消してから、「部署数」としてdepartmentsの件数を確認してください",
        hint: "BEGIN; DELETE FROM departments WHERE id >= 6; ROLLBACK; SELECT COUNT(*) AS 部署数 FROM departments;",
        answer: "BEGIN; DELETE FROM departments WHERE id >= 6; ROLLBACK; SELECT COUNT(*) AS 部署数 FROM departments;",
        expectedColumns: ["部署数"],
      },
      {
        id: "pb-txn-5",
        question: "SAVEPOINTを使い、id=6「法務部/東京」を挿入してからsp1を設定、id=9「研究部/京都」を挿入後ROLLBACK TO sp1でid=9を取消してCOMMITし、id>=6のdepartmentsを取得してください",
        hint: "BEGIN; INSERT ...(6,...); SAVEPOINT sp1; INSERT ...(9,...); ROLLBACK TO sp1; COMMIT; SELECT * FROM departments WHERE id >= 6;",
        answer: "BEGIN; INSERT INTO departments (id, name, location) VALUES (6, '法務部', '東京'); SAVEPOINT sp1; INSERT INTO departments (id, name, location) VALUES (9, '研究部', '京都'); ROLLBACK TO sp1; COMMIT; SELECT * FROM departments WHERE id >= 6;",
        expectedColumns: ["id", "name", "location"],
      },
    ],
  },
  {
    slug: "pb-comprehensive",
    title: "総合演習（初級）",
    level: "beginner",
    order: 10,
    description: "初級の全知識を組み合わせた実践的な問題に挑戦します",
    content: `
<h2>総合演習について</h2>
<p>ここまで学んだ内容（NULL・文字列関数・数値関数・日付・CASE・複合条件・計算・DDL・トランザクション）を組み合わせた実践的な問題です。</p>

<h2>SQL記述のコツ</h2>
<ul>
  <li>まずどのテーブルが必要かを考える</li>
  <li>JOINが必要かを判断する</li>
  <li>WHERE・GROUP BY・HAVING の順序を意識する</li>
  <li>計算式とCASE式を組み合わせると表現力が上がる</li>
</ul>

<pre><code><span class="sql-comment">-- 部署名・人数・平均給与をCASEでランク付け</span>
<span class="sql-keyword">SELECT</span>
  d.name <span class="sql-keyword">AS</span> 部署名,
  <span class="sql-function">COUNT</span>(*) <span class="sql-keyword">AS</span> 人数,
  <span class="sql-function">ROUND</span>(<span class="sql-function">AVG</span>(e.salary)) <span class="sql-keyword">AS</span> 平均給与,
  <span class="sql-keyword">CASE</span>
    <span class="sql-keyword">WHEN</span> <span class="sql-function">AVG</span>(e.salary) >= <span class="sql-number">500000</span> <span class="sql-keyword">THEN</span> <span class="sql-string">'A'</span>
    <span class="sql-keyword">ELSE</span> <span class="sql-string">'B'</span>
  <span class="sql-keyword">END</span> <span class="sql-keyword">AS</span> ランク
<span class="sql-keyword">FROM</span> employees e
<span class="sql-keyword">JOIN</span> departments d <span class="sql-keyword">ON</span> e.department_id = d.id
<span class="sql-keyword">GROUP BY</span> d.name
<span class="sql-keyword">ORDER BY</span> 平均給与 <span class="sql-keyword">DESC</span>;</code></pre>
    `,
    exercises: [
      {
        id: "pb-comp-1",
        question: "employeesとdepartmentsをJOINし、name・部署名・salary・給与ランク（高/中/低）をsalary降順で取得してください",
        hint: "JOIN departments d ON ... CASE WHEN salary >= 550000 THEN '高' ...",
        answer: "SELECT e.name, d.name AS 部署名, e.salary, CASE WHEN e.salary >= 550000 THEN '高' WHEN e.salary >= 450000 THEN '中' ELSE '低' END AS 給与ランク FROM employees e JOIN departments d ON e.department_id = d.id ORDER BY e.salary DESC",
        expectedColumns: ["name", "部署名", "salary", "給与ランク"],
      },
      {
        id: "pb-comp-2",
        question: "productsのname・price・stock・在庫金額（price×stock）を在庫金額降順でTOP3取得してください",
        hint: "SELECT name, price, stock, price * stock AS 在庫金額 FROM products ORDER BY 在庫金額 DESC LIMIT 3",
        answer: "SELECT name, price, stock, price * stock AS 在庫金額 FROM products ORDER BY 在庫金額 DESC LIMIT 3",
        expectedColumns: ["name", "price", "stock", "在庫金額"],
      },
      {
        id: "pb-comp-3",
        question: "ordersとproductsをJOINし、月（strftime('%m',order_date)）ごとの注文金額合計（price×quantity）を「月」と「注文金額合計」で月順に取得してください",
        hint: "GROUP BY strftime('%m', o.order_date) ORDER BY 月",
        answer: "SELECT strftime('%m', o.order_date) AS 月, SUM(p.price * o.quantity) AS 注文金額合計 FROM orders o JOIN products p ON o.product_id = p.id GROUP BY strftime('%m', o.order_date) ORDER BY 月",
        expectedColumns: ["月", "注文金額合計"],
      },
      {
        id: "pb-comp-4",
        question: "departmentsとemployeesをJOINして部署名・人数・平均給与をROUNDして平均給与降順で取得してください",
        hint: "JOIN, GROUP BY d.name, ROUND(AVG(e.salary)) AS 平均給与",
        answer: "SELECT d.name AS 部署名, COUNT(*) AS 人数, ROUND(AVG(e.salary)) AS 平均給与 FROM employees e JOIN departments d ON e.department_id = d.id GROUP BY d.name ORDER BY 平均給与 DESC",
        expectedColumns: ["部署名", "人数", "平均給与"],
      },
      {
        id: "pb-comp-5",
        question: "サブクエリを使い、全従業員の平均給与との比較で「平均以上」「平均未満」の区分と人数をCASEで集計してください",
        hint: "CASE WHEN salary >= (SELECT AVG(salary) FROM employees) THEN '平均以上' ELSE '平均未満' END AS 区分, COUNT(*)",
        answer: "SELECT CASE WHEN salary >= (SELECT AVG(salary) FROM employees) THEN '平均以上' ELSE '平均未満' END AS 区分, COUNT(*) AS 人数 FROM employees GROUP BY 区分",
        expectedColumns: ["区分", "人数"],
      },
    ],
  },

  // ========= プレミアム中級コース =========
  {
    slug: "pi-window-rank",
    title: "ウィンドウ関数 ROW_NUMBER・RANK・DENSE_RANK",
    level: "intermediate",
    order: 11,
    description: "ウィンドウ関数の基本であるROW_NUMBER・RANK・DENSE_RANKを学びます",
    content: `
<h2>ウィンドウ関数とは？</h2>
<p>GROUP BYのようにデータをグループ化しつつ、<strong>行を消さずに</strong>集計値を計算できる強力な機能です。</p>

<h2>基本構文</h2>
<pre><code>関数名() <span class="sql-keyword">OVER</span> (
  [<span class="sql-keyword">PARTITION BY</span> 列名]   <span class="sql-comment">-- グループ化（省略可）</span>
  [<span class="sql-keyword">ORDER BY</span> 列名]       <span class="sql-comment">-- 並び順</span>
)</code></pre>

<h2>3つの順位関数</h2>
<table>
  <tr><th>関数</th><th>同順位の扱い</th><th>例（値: 3,3,5）</th></tr>
  <tr><td>ROW_NUMBER()</td><td>連番（重複なし）</td><td>1, 2, 3</td></tr>
  <tr><td>RANK()</td><td>同順位後スキップ</td><td>1, 1, 3</td></tr>
  <tr><td>DENSE_RANK()</td><td>同順位後スキップなし</td><td>1, 1, 2</td></tr>
</table>

<pre><code><span class="sql-keyword">SELECT</span> name, salary,
  <span class="sql-function">ROW_NUMBER</span>() <span class="sql-keyword">OVER</span> (<span class="sql-keyword">ORDER BY</span> salary <span class="sql-keyword">DESC</span>) <span class="sql-keyword">AS</span> 行番号,
  <span class="sql-function">RANK</span>()       <span class="sql-keyword">OVER</span> (<span class="sql-keyword">ORDER BY</span> salary <span class="sql-keyword">DESC</span>) <span class="sql-keyword">AS</span> 順位,
  <span class="sql-function">DENSE_RANK</span>() <span class="sql-keyword">OVER</span> (<span class="sql-keyword">ORDER BY</span> salary <span class="sql-keyword">DESC</span>) <span class="sql-keyword">AS</span> 密度順位
<span class="sql-keyword">FROM</span> employees;</code></pre>
    `,
    exercises: [
      {
        id: "pi-rank-1",
        question: "employeesのname・salaryと、salary降順のROW_NUMBER()を「順位」として取得してください",
        hint: "ROW_NUMBER() OVER (ORDER BY salary DESC) AS 順位",
        answer: "SELECT name, salary, ROW_NUMBER() OVER (ORDER BY salary DESC) AS 順位 FROM employees",
        expectedColumns: ["name", "salary", "順位"],
      },
      {
        id: "pi-rank-2",
        question: "employeesのname・department_id・salaryと、department_id内でのsalary降順のRANK()を「部署内順位」として取得してください",
        hint: "RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS 部署内順位",
        answer: "SELECT name, department_id, salary, RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS 部署内順位 FROM employees",
        expectedColumns: ["name", "department_id", "salary", "部署内順位"],
      },
      {
        id: "pi-rank-3",
        question: "employeesのname・salaryと、salary降順のDENSE_RANK()を「密度順位」として取得してください",
        hint: "DENSE_RANK() OVER (ORDER BY salary DESC) AS 密度順位",
        answer: "SELECT name, salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS 密度順位 FROM employees",
        expectedColumns: ["name", "salary", "密度順位"],
      },
      {
        id: "pi-rank-4",
        question: "サブクエリとROW_NUMBER()を使い、各department_id内でsalary最高の従業員（部署内順位=1）のname・department_id・salary・部署内順位を取得してください",
        hint: "SELECT ... FROM (SELECT ..., ROW_NUMBER() OVER (PARTITION BY department_id ORDER BY salary DESC) AS 部署内順位 FROM employees) WHERE 部署内順位 = 1",
        answer: "SELECT name, department_id, salary, 部署内順位 FROM (SELECT name, department_id, salary, ROW_NUMBER() OVER (PARTITION BY department_id ORDER BY salary DESC) AS 部署内順位 FROM employees) WHERE 部署内順位 = 1",
        expectedColumns: ["name", "department_id", "salary", "部署内順位"],
      },
      {
        id: "pi-rank-5",
        question: "productsのname・category・priceと、category内でのprice降順ROW_NUMBER()「行番号」・RANK()「順位」を取得してください",
        hint: "ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) AS 行番号, RANK() OVER (...) AS 順位",
        answer: "SELECT name, category, price, ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) AS 行番号, RANK() OVER (PARTITION BY category ORDER BY price DESC) AS 順位 FROM products",
        expectedColumns: ["name", "category", "price", "行番号", "順位"],
      },
    ],
  },
  {
    slug: "pi-window-lag-lead",
    title: "ウィンドウ関数 LAG・LEAD・移動集計",
    level: "intermediate",
    order: 12,
    description: "LAG・LEADで前後の行を参照し、SUM OVERで累計・移動平均を学びます",
    content: `
<h2>LAG / LEAD — 前後の行を参照</h2>
<pre><code><span class="sql-comment">-- 前の行の値</span>
<span class="sql-function">LAG</span>(列名, オフセット, デフォルト値) <span class="sql-keyword">OVER</span> (<span class="sql-keyword">ORDER BY</span> 列名)

<span class="sql-comment">-- 後の行の値</span>
<span class="sql-function">LEAD</span>(列名, オフセット, デフォルト値) <span class="sql-keyword">OVER</span> (<span class="sql-keyword">ORDER BY</span> 列名)</code></pre>

<h2>累計と移動平均</h2>
<pre><code><span class="sql-comment">-- 累計（ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW）</span>
<span class="sql-function">SUM</span>(quantity) <span class="sql-keyword">OVER</span> (
  <span class="sql-keyword">ORDER BY</span> order_date
  <span class="sql-keyword">ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</span>
) <span class="sql-keyword">AS</span> 累計数量

<span class="sql-comment">-- 直近3行の移動平均</span>
<span class="sql-function">AVG</span>(quantity) <span class="sql-keyword">OVER</span> (
  <span class="sql-keyword">ORDER BY</span> order_date
  <span class="sql-keyword">ROWS BETWEEN</span> <span class="sql-number">2</span> <span class="sql-keyword">PRECEDING AND CURRENT ROW</span>
) <span class="sql-keyword">AS</span> 移動平均</code></pre>
    `,
    exercises: [
      {
        id: "pi-lag-1",
        question: "ordersのid・order_date・quantityと、order_date順での前の行のquantityを「前回数量」として取得してください",
        hint: "LAG(quantity) OVER (ORDER BY order_date) AS 前回数量",
        answer: "SELECT id, order_date, quantity, LAG(quantity) OVER (ORDER BY order_date) AS 前回数量 FROM orders",
        expectedColumns: ["id", "order_date", "quantity", "前回数量"],
      },
      {
        id: "pi-lag-2",
        question: "ordersのid・order_date・quantityと、order_date順での次の行のquantityを「次回数量」として取得してください",
        hint: "LEAD(quantity) OVER (ORDER BY order_date) AS 次回数量",
        answer: "SELECT id, order_date, quantity, LEAD(quantity) OVER (ORDER BY order_date) AS 次回数量 FROM orders",
        expectedColumns: ["id", "order_date", "quantity", "次回数量"],
      },
      {
        id: "pi-lag-3",
        question: "employeesのname・salaryと、salary順での前行との差（salary - LAG(salary)）を「前との差」として取得してください（salary降順）",
        hint: "salary - LAG(salary, 1, salary) OVER (ORDER BY salary DESC) AS 前との差",
        answer: "SELECT name, salary, salary - LAG(salary, 1, salary) OVER (ORDER BY salary DESC) AS 前との差 FROM employees",
        expectedColumns: ["name", "salary", "前との差"],
      },
      {
        id: "pi-lag-4",
        question: "ordersのid・order_date・quantityと、order_date順の累計数量を「累計数量」として取得してください",
        hint: "SUM(quantity) OVER (ORDER BY order_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS 累計数量",
        answer: "SELECT id, order_date, quantity, SUM(quantity) OVER (ORDER BY order_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS 累計数量 FROM orders",
        expectedColumns: ["id", "order_date", "quantity", "累計数量"],
      },
      {
        id: "pi-lag-5",
        question: "ordersのid・order_date・quantityと、直近3行の移動平均をROUND(1桁)した「移動平均」を取得してください",
        hint: "ROUND(AVG(quantity) OVER (ORDER BY order_date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 1) AS 移動平均",
        answer: "SELECT id, order_date, quantity, ROUND(AVG(quantity) OVER (ORDER BY order_date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 1) AS 移動平均 FROM orders",
        expectedColumns: ["id", "order_date", "quantity", "移動平均"],
      },
    ],
  },
  {
    slug: "pi-cte",
    title: "CTE（WITH句）",
    level: "intermediate",
    order: 13,
    description: "WITH句で一時的な名前付きクエリを定義してSQLを整理する方法を学びます",
    content: `
<h2>CTEとは？</h2>
<p><strong>CTE（Common Table Expression）</strong>は <code>WITH</code> 句で一時的な名前付きクエリを定義する機能です。複雑なサブクエリを整理・再利用できます。</p>

<h2>基本構文</h2>
<pre><code><span class="sql-keyword">WITH</span> cte名 <span class="sql-keyword">AS</span> (
  <span class="sql-keyword">SELECT</span> ...
)
<span class="sql-keyword">SELECT</span> * <span class="sql-keyword">FROM</span> cte名;</code></pre>

<h2>複数CTEの定義</h2>
<pre><code><span class="sql-keyword">WITH</span>
  cte1 <span class="sql-keyword">AS</span> (<span class="sql-keyword">SELECT</span> ...),
  cte2 <span class="sql-keyword">AS</span> (<span class="sql-keyword">SELECT</span> ... <span class="sql-keyword">FROM</span> cte1)
<span class="sql-keyword">SELECT</span> * <span class="sql-keyword">FROM</span> cte2;</code></pre>

<h2>再帰CTE</h2>
<pre><code><span class="sql-keyword">WITH RECURSIVE</span> counter(n) <span class="sql-keyword">AS</span> (
  <span class="sql-keyword">SELECT</span> <span class="sql-number">1</span>
  <span class="sql-keyword">UNION ALL</span>
  <span class="sql-keyword">SELECT</span> n + <span class="sql-number">1</span> <span class="sql-keyword">FROM</span> counter <span class="sql-keyword">WHERE</span> n < <span class="sql-number">5</span>
)
<span class="sql-keyword">SELECT</span> n <span class="sql-keyword">FROM</span> counter;</code></pre>
    `,
    exercises: [
      {
        id: "pi-cte-1",
        question: "CTEを使い、全従業員の平均給与を avg_salary として定義し、平均給与より高い従業員のname・salaryを取得してください",
        hint: "WITH avg_salary AS (SELECT AVG(salary) AS avg FROM employees) SELECT name, salary FROM employees, avg_salary WHERE salary > avg_salary.avg",
        answer: "WITH avg_salary AS (SELECT AVG(salary) AS avg FROM employees) SELECT name, salary FROM employees, avg_salary WHERE salary > avg_salary.avg",
        expectedColumns: ["name", "salary"],
      },
      {
        id: "pi-cte-2",
        question: "dept_statsというCTEで部署ごとの人数と平均給与を集計し、departmentsとJOINして部署名・人数・平均給与（ROUND）を平均給与降順で取得してください",
        hint: "WITH dept_stats AS (SELECT department_id, COUNT(*) AS 人数, AVG(salary) AS 平均給与 FROM employees GROUP BY department_id) SELECT d.name AS 部署名, ds.人数, ROUND(ds.平均給与) AS 平均給与 FROM dept_stats ds JOIN departments d ON ...",
        answer: "WITH dept_stats AS (SELECT department_id, COUNT(*) AS 人数, AVG(salary) AS 平均給与 FROM employees GROUP BY department_id) SELECT d.name AS 部署名, ds.人数, ROUND(ds.平均給与) AS 平均給与 FROM dept_stats ds JOIN departments d ON ds.department_id = d.id ORDER BY ds.平均給与 DESC",
        expectedColumns: ["部署名", "人数", "平均給与"],
      },
      {
        id: "pi-cte-3",
        question: "top_productsとproduct_infoの2つのCTEを使い、注文数量合計TOP3の商品名・price・総注文数を取得してください",
        hint: "WITH top_products AS (SELECT product_id, SUM(quantity) AS 総注文数 FROM orders GROUP BY product_id ORDER BY 総注文数 DESC LIMIT 3), product_info AS (SELECT id, name, price FROM products) SELECT ...",
        answer: "WITH top_products AS (SELECT product_id, SUM(quantity) AS 総注文数 FROM orders GROUP BY product_id ORDER BY 総注文数 DESC LIMIT 3), product_info AS (SELECT id, name, price FROM products) SELECT p.name, p.price, tp.総注文数 FROM top_products tp JOIN product_info p ON tp.product_id = p.id",
        expectedColumns: ["name", "price", "総注文数"],
      },
      {
        id: "pi-cte-4",
        question: "WITH RECURSIVE を使い、1から5までの連番を「n」という列で生成してください",
        hint: "WITH RECURSIVE counter(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM counter WHERE n < 5) SELECT n FROM counter",
        answer: "WITH RECURSIVE counter(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM counter WHERE n < 5) SELECT n FROM counter",
        expectedColumns: ["n"],
      },
      {
        id: "pi-cte-5",
        question: "CTEとウィンドウ関数を組み合わせ、部署内salary降順1位の従業員のname・salary・department_idを取得してください",
        hint: "WITH ranked AS (SELECT name, salary, department_id, RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS rank FROM employees) SELECT name, salary, department_id FROM ranked WHERE rank = 1",
        answer: "WITH ranked AS (SELECT name, salary, department_id, RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS rank FROM employees) SELECT name, salary, department_id FROM ranked WHERE rank = 1",
        expectedColumns: ["name", "salary", "department_id"],
      },
    ],
  },
  {
    slug: "pi-exists",
    title: "EXISTS・NOT EXISTS・サブクエリ比較",
    level: "intermediate",
    order: 14,
    description: "相関サブクエリを使ったEXISTS・NOT EXISTSとMAX/MIN・INを使ったサブクエリ比較を学びます",
    content: `
<h2>EXISTS — 存在チェック</h2>
<p>サブクエリが1行でも返すなら真を返します。</p>
<pre><code><span class="sql-keyword">SELECT</span> name <span class="sql-keyword">FROM</span> products
<span class="sql-keyword">WHERE EXISTS</span> (
  <span class="sql-keyword">SELECT</span> <span class="sql-number">1</span> <span class="sql-keyword">FROM</span> orders
  <span class="sql-keyword">WHERE</span> orders.product_id = products.id
);</code></pre>

<h2>NOT EXISTS — 非存在チェック</h2>
<pre><code><span class="sql-keyword">SELECT</span> name <span class="sql-keyword">FROM</span> departments
<span class="sql-keyword">WHERE NOT EXISTS</span> (
  <span class="sql-keyword">SELECT</span> <span class="sql-number">1</span> <span class="sql-keyword">FROM</span> employees
  <span class="sql-keyword">WHERE</span> employees.department_id = departments.id
  <span class="sql-keyword">AND</span> salary > <span class="sql-number">550000</span>
);</code></pre>

<h2>サブクエリによる比較（MAX/MIN）</h2>
<p>「全員より高い」は MAX、「誰かより高い」は MIN を使って実現できます。</p>
<pre><code><span class="sql-comment">-- 全員より高い（ALLの代替）</span>
<span class="sql-keyword">WHERE</span> salary > (<span class="sql-keyword">SELECT</span> <span class="sql-function">MAX</span>(salary) <span class="sql-keyword">FROM</span> ...)

<span class="sql-comment">-- 誰かより高い（ANYの代替）</span>
<span class="sql-keyword">WHERE</span> salary > (<span class="sql-keyword">SELECT</span> <span class="sql-function">MIN</span>(salary) <span class="sql-keyword">FROM</span> ...)</code></pre>
    `,
    exercises: [
      {
        id: "pi-exists-1",
        question: "EXISTSを使い、ordersに注文がある商品のnameを取得してください",
        hint: "WHERE EXISTS (SELECT 1 FROM orders WHERE orders.product_id = products.id)",
        answer: "SELECT name FROM products WHERE EXISTS (SELECT 1 FROM orders WHERE orders.product_id = products.id)",
        expectedColumns: ["name"],
      },
      {
        id: "pi-exists-2",
        question: "NOT EXISTSを使い、salary>550000の従業員が存在しない部署のname・locationを取得してください",
        hint: "WHERE NOT EXISTS (SELECT 1 FROM employees WHERE employees.department_id = departments.id AND salary > 550000)",
        answer: "SELECT name, location FROM departments WHERE NOT EXISTS (SELECT 1 FROM employees WHERE employees.department_id = departments.id AND salary > 550000)",
        expectedColumns: ["name", "location"],
      },
      {
        id: "pi-exists-3",
        question: "EXISTSと相関サブクエリを使い、東京の部署に所属する従業員のname・salaryを取得してください",
        hint: "WHERE EXISTS (SELECT 1 FROM departments d WHERE d.id = e.department_id AND d.location = '東京')",
        answer: "SELECT name, salary FROM employees e WHERE EXISTS (SELECT 1 FROM departments d WHERE d.id = e.department_id AND d.location = '東京')",
        expectedColumns: ["name", "salary"],
      },
      {
        id: "pi-exists-4",
        question: "サブクエリを使い、department_id=3の全従業員の最高給与より高い給与を持つ従業員のname・salaryを取得してください",
        hint: "WHERE salary > (SELECT MAX(salary) FROM employees WHERE department_id = 3)",
        answer: "SELECT name, salary FROM employees WHERE salary > (SELECT MAX(salary) FROM employees WHERE department_id = 3)",
        expectedColumns: ["name", "salary"],
      },
      {
        id: "pi-exists-5",
        question: "サブクエリを使い、パソコンカテゴリの最安値より高いpriceを持つ商品のname・priceを取得してください",
        hint: "WHERE price > (SELECT MIN(price) FROM products WHERE category = 'パソコン')",
        answer: "SELECT name, price FROM products WHERE price > (SELECT MIN(price) FROM products WHERE category = 'パソコン')",
        expectedColumns: ["name", "price"],
      },
    ],
  },
  {
    slug: "pi-set-operations",
    title: "集合演算 UNION・INTERSECT・EXCEPT",
    level: "intermediate",
    order: 15,
    description: "UNION・UNION ALL・INTERSECT・EXCEPTによる集合演算を学びます",
    content: `
<h2>集合演算の種類</h2>
<table>
  <tr><th>演算子</th><th>意味</th></tr>
  <tr><td>UNION</td><td>和集合（重複除く）</td></tr>
  <tr><td>UNION ALL</td><td>和集合（重複含む）</td></tr>
  <tr><td>INTERSECT</td><td>積集合（両方に存在）</td></tr>
  <tr><td>EXCEPT</td><td>差集合（左側のみ）</td></tr>
</table>

<h2>注意事項</h2>
<ul>
  <li>各SELECTの列数・型が一致している必要がある</li>
  <li>列名は最初のSELECTのものが使われる</li>
  <li>ORDER BYは最後に一度だけ記述</li>
</ul>

<pre><code><span class="sql-keyword">SELECT</span> name, <span class="sql-string">'従業員'</span> <span class="sql-keyword">AS</span> 種別 <span class="sql-keyword">FROM</span> employees
<span class="sql-keyword">UNION</span>
<span class="sql-keyword">SELECT</span> name, <span class="sql-string">'部署'</span> <span class="sql-keyword">AS</span> 種別 <span class="sql-keyword">FROM</span> departments
<span class="sql-keyword">ORDER BY</span> 種別, name;</code></pre>
    `,
    exercises: [
      {
        id: "pi-set-1",
        question: "UNIONを使い、employeesのname・「従業員」とdepartmentsのname・「部署」を合わせ、種別・name順で取得してください",
        hint: "SELECT name, '従業員' AS 種別 FROM employees UNION SELECT name, '部署' AS 種別 FROM departments ORDER BY 種別, name",
        answer: "SELECT name, '従業員' AS 種別 FROM employees UNION SELECT name, '部署' AS 種別 FROM departments ORDER BY 種別, name",
        expectedColumns: ["name", "種別"],
      },
      {
        id: "pi-set-2",
        question: "UNION ALLを使い、salary>500000の従業員のdepartment_idと、hire_date>='2021-01-01'の従業員のdepartment_idを重複込みで取得してください（department_id昇順）",
        hint: "UNION ALL (重複を除かない)",
        answer: "SELECT department_id FROM employees WHERE salary > 500000 UNION ALL SELECT department_id FROM employees WHERE hire_date >= '2021-01-01' ORDER BY department_id",
        expectedColumns: ["department_id"],
      },
      {
        id: "pi-set-3",
        question: "INTERSECTを使い、department_id=2の従業員かつsalary>=500000の従業員のnameを取得してください",
        hint: "SELECT name FROM employees WHERE department_id = 2 INTERSECT SELECT name FROM employees WHERE salary >= 500000",
        answer: "SELECT name FROM employees WHERE department_id = 2 INTERSECT SELECT name FROM employees WHERE salary >= 500000",
        expectedColumns: ["name"],
      },
      {
        id: "pi-set-4",
        question: "EXCEPTを使い、department_idが1・2・3の従業員のうち、salary<450000を除いたnameを取得してください",
        hint: "SELECT name FROM employees WHERE department_id IN (1,2,3) EXCEPT SELECT name FROM employees WHERE salary < 450000",
        answer: "SELECT name FROM employees WHERE department_id IN (1,2,3) EXCEPT SELECT name FROM employees WHERE salary < 450000",
        expectedColumns: ["name"],
      },
      {
        id: "pi-set-5",
        question: "UNIONを使い、「パソコン」カテゴリの商品数と合計金額、「その他」カテゴリの商品数と合計金額をカテゴリ・商品数・合計金額として取得してください",
        hint: "UNION で SELECT 'パソコン'... と SELECT 'その他'...",
        answer: "SELECT 'パソコン' AS カテゴリ, COUNT(*) AS 商品数, SUM(price) AS 合計金額 FROM products WHERE category = 'パソコン' UNION SELECT 'その他' AS カテゴリ, COUNT(*) AS 商品数, SUM(price) AS 合計金額 FROM products WHERE category != 'パソコン'",
        expectedColumns: ["カテゴリ", "商品数", "合計金額"],
      },
    ],
  },
  {
    slug: "pi-self-cross-join",
    title: "SELF JOIN・CROSS JOIN",
    level: "intermediate",
    order: 16,
    description: "自己結合とクロス結合の使い方と応用を学びます",
    content: `
<h2>SELF JOIN — 自己結合</h2>
<p>同じテーブルを2回使って結合します。テーブルエイリアスが必須です。</p>
<pre><code><span class="sql-comment">-- 同じ部署の従業員ペア</span>
<span class="sql-keyword">SELECT</span> a.name <span class="sql-keyword">AS</span> 従業員1, b.name <span class="sql-keyword">AS</span> 従業員2
<span class="sql-keyword">FROM</span> employees a
<span class="sql-keyword">JOIN</span> employees b
  <span class="sql-keyword">ON</span> a.department_id = b.department_id
  <span class="sql-keyword">AND</span> a.id < b.id;</code></pre>

<h2>CROSS JOIN — クロス結合（直積）</h2>
<p>両テーブルの全組み合わせを生成します。</p>
<pre><code><span class="sql-keyword">SELECT</span> a.name, b.name
<span class="sql-keyword">FROM</span> table_a a
<span class="sql-keyword">CROSS JOIN</span> table_b b;</code></pre>

<h2>SELF JOINの応用: 自分より上位の人数</h2>
<pre><code><span class="sql-keyword">SELECT</span> a.name, a.salary,
  <span class="sql-function">COUNT</span>(b.id) <span class="sql-keyword">AS</span> 上位人数
<span class="sql-keyword">FROM</span> employees a
<span class="sql-keyword">LEFT JOIN</span> employees b <span class="sql-keyword">ON</span> b.salary > a.salary
<span class="sql-keyword">GROUP BY</span> a.id, a.name, a.salary;</code></pre>
    `,
    exercises: [
      {
        id: "pi-self-1",
        question: "SELF JOINを使い、同じdepartment_idを持つ従業員ペア（従業員1・従業員2・department_id）をdepartment_id昇順で上位10件取得してください",
        hint: "FROM employees a JOIN employees b ON a.department_id = b.department_id AND a.id < b.id LIMIT 10",
        answer: "SELECT a.name AS 従業員1, b.name AS 従業員2, a.department_id FROM employees a JOIN employees b ON a.department_id = b.department_id AND a.id < b.id ORDER BY a.department_id LIMIT 10",
        expectedColumns: ["従業員1", "従業員2", "department_id"],
      },
      {
        id: "pi-self-2",
        question: "SELF JOINを使い、各従業員のname・salaryと、自分より高い給与の人の人数「上位人数」をsalary降順で取得してください",
        hint: "LEFT JOIN employees b ON b.salary > a.salary GROUP BY a.id, a.name, a.salary",
        answer: "SELECT a.name, a.salary, COUNT(b.id) AS 上位人数 FROM employees a LEFT JOIN employees b ON b.salary > a.salary GROUP BY a.id, a.name, a.salary ORDER BY a.salary DESC",
        expectedColumns: ["name", "salary", "上位人数"],
      },
      {
        id: "pi-self-3",
        question: "CROSS JOINを使い、departmentsと（productsのDISTINCT category）の全組み合わせを部署名・カテゴリとして上位10件取得してください",
        hint: "departments d CROSS JOIN (SELECT DISTINCT category FROM products) p",
        answer: "SELECT d.name AS 部署名, p.category AS カテゴリ FROM departments d CROSS JOIN (SELECT DISTINCT category FROM products) p ORDER BY d.name, p.category LIMIT 10",
        expectedColumns: ["部署名", "カテゴリ"],
      },
      {
        id: "pi-self-4",
        question: "SELF JOINを使い、同じ入社年（strftime('%Y',hire_date)）の従業員ペア（従業員1・従業員2・入社年）を入社年昇順で上位10件取得してください",
        hint: "ON strftime('%Y', a.hire_date) = strftime('%Y', b.hire_date) AND a.id < b.id",
        answer: "SELECT a.name AS 従業員1, b.name AS 従業員2, strftime('%Y', a.hire_date) AS 入社年 FROM employees a JOIN employees b ON strftime('%Y', a.hire_date) = strftime('%Y', b.hire_date) AND a.id < b.id ORDER BY 入社年 LIMIT 10",
        expectedColumns: ["従業員1", "従業員2", "入社年"],
      },
      {
        id: "pi-self-5",
        question: "CROSS JOINを使い、employeesとdepartmentsの全組み合わせの件数を「組み合わせ数」として取得してください",
        hint: "SELECT COUNT(*) AS 組み合わせ数 FROM employees CROSS JOIN departments",
        answer: "SELECT COUNT(*) AS 組み合わせ数 FROM employees CROSS JOIN departments",
        expectedColumns: ["組み合わせ数"],
      },
    ],
  },
  {
    slug: "pi-views",
    title: "ビュー（VIEW）",
    level: "intermediate",
    order: 17,
    description: "CREATE VIEW・DROP VIEWでビューを作成・管理する方法を学びます",
    content: `
<h2>ビューとは？</h2>
<p>ビューは<strong>名前付きのSELECT文</strong>です。複雑なJOINや集計を隠蔽し、シンプルなテーブルのように使えます。</p>

<h2>CREATE VIEW</h2>
<pre><code><span class="sql-keyword">CREATE VIEW IF NOT EXISTS</span> v_employee_dept <span class="sql-keyword">AS</span>
<span class="sql-keyword">SELECT</span> e.name, e.salary, d.name <span class="sql-keyword">AS</span> 部署名, d.location
<span class="sql-keyword">FROM</span> employees e
<span class="sql-keyword">JOIN</span> departments d <span class="sql-keyword">ON</span> e.department_id = d.id;</code></pre>

<h2>ビューの使用</h2>
<pre><code><span class="sql-comment">-- テーブルと同じように SELECT できる</span>
<span class="sql-keyword">SELECT</span> * <span class="sql-keyword">FROM</span> v_employee_dept <span class="sql-keyword">WHERE</span> location = <span class="sql-string">'東京'</span>;</code></pre>

<h2>DROP VIEW</h2>
<pre><code><span class="sql-keyword">DROP VIEW IF EXISTS</span> v_employee_dept;</code></pre>
    `,
    exercises: [
      {
        id: "pi-view-1",
        question: "v_employee_deptビューをCREATE VIEW（employees×departmentsのname・salary・部署名・location）で作成し、上位5件を取得してください",
        hint: "CREATE VIEW IF NOT EXISTS v_employee_dept AS SELECT e.name, e.salary, d.name AS 部署名, d.location FROM employees e JOIN departments d ON e.department_id = d.id; SELECT * FROM v_employee_dept LIMIT 5;",
        answer: "CREATE VIEW IF NOT EXISTS v_employee_dept AS SELECT e.name, e.salary, d.name AS 部署名, d.location FROM employees e JOIN departments d ON e.department_id = d.id; SELECT * FROM v_employee_dept LIMIT 5;",
        expectedColumns: ["name", "salary", "部署名", "location"],
      },
      {
        id: "pi-view-2",
        question: "v_high_salaryビューをsalary>=500000の従業員（name・salary・department_id）で作成し、salary降順で全件取得してください",
        hint: "CREATE VIEW IF NOT EXISTS v_high_salary AS SELECT name, salary, department_id FROM employees WHERE salary >= 500000; SELECT * FROM v_high_salary ORDER BY salary DESC;",
        answer: "CREATE VIEW IF NOT EXISTS v_high_salary AS SELECT name, salary, department_id FROM employees WHERE salary >= 500000; SELECT * FROM v_high_salary ORDER BY salary DESC;",
        expectedColumns: ["name", "salary", "department_id"],
      },
      {
        id: "pi-view-3",
        question: "v_dept_statsビュー（department_id・人数・平均給与）を作成し、人数>=3の部署だけ取得してください",
        hint: "CREATE VIEW ... GROUP BY department_id; SELECT * FROM v_dept_stats WHERE 人数 >= 3;",
        answer: "CREATE VIEW IF NOT EXISTS v_dept_stats AS SELECT department_id, COUNT(*) AS 人数, AVG(salary) AS 平均給与 FROM employees GROUP BY department_id; SELECT * FROM v_dept_stats WHERE 人数 >= 3;",
        expectedColumns: ["department_id", "人数", "平均給与"],
      },
      {
        id: "pi-view-4",
        question: "v_baseビュー（employeesのname）とv_tempビュー（employeesのname）を作成後、v_tempをDROP VIEWで削除し、sqlite_masterに残るビューのnameを取得してください",
        hint: "CREATE VIEW IF NOT EXISTS v_base AS SELECT name FROM employees; CREATE VIEW IF NOT EXISTS v_temp AS SELECT name FROM employees; DROP VIEW v_temp; SELECT name FROM sqlite_master WHERE type='view';",
        answer: "CREATE VIEW IF NOT EXISTS v_base AS SELECT name FROM employees; CREATE VIEW IF NOT EXISTS v_temp AS SELECT name FROM employees; DROP VIEW v_temp; SELECT name FROM sqlite_master WHERE type='view';",
        expectedColumns: ["name"],
      },
      {
        id: "pi-view-5",
        question: "v_order_summaryビュー（orders×productsのid・商品名・quantity・金額・customer_name）を作成し、商品名ごとの総売上TOP5を取得してください",
        hint: "CREATE VIEW ... JOIN ...; SELECT 商品名, SUM(金額) AS 総売上 FROM v_order_summary GROUP BY 商品名 ORDER BY 総売上 DESC LIMIT 5;",
        answer: "CREATE VIEW IF NOT EXISTS v_order_summary AS SELECT o.id, p.name AS 商品名, o.quantity, p.price * o.quantity AS 金額, o.customer_name FROM orders o JOIN products p ON o.product_id = p.id; SELECT 商品名, SUM(金額) AS 総売上 FROM v_order_summary GROUP BY 商品名 ORDER BY 総売上 DESC LIMIT 5;",
        expectedColumns: ["商品名", "総売上"],
      },
    ],
  },
  {
    slug: "pi-advanced-subquery",
    title: "高度なサブクエリと集計",
    level: "intermediate",
    order: 18,
    description: "相関サブクエリ・FROM句サブクエリ・HAVINGサブクエリを学びます",
    content: `
<h2>相関サブクエリ（SELECT句）</h2>
<p>外側のクエリの各行ごとにサブクエリを実行します。</p>
<pre><code><span class="sql-keyword">SELECT</span> name, salary,
  (<span class="sql-keyword">SELECT</span> <span class="sql-function">AVG</span>(salary) <span class="sql-keyword">FROM</span> employees e2
   <span class="sql-keyword">WHERE</span> e2.department_id = e1.department_id) <span class="sql-keyword">AS</span> 部署平均給与
<span class="sql-keyword">FROM</span> employees e1;</code></pre>

<h2>FROM句のサブクエリ（派生テーブル）</h2>
<pre><code><span class="sql-keyword">SELECT</span> d.name <span class="sql-keyword">AS</span> 部署名, sub.最高給与
<span class="sql-keyword">FROM</span> departments d
<span class="sql-keyword">JOIN</span> (
  <span class="sql-keyword">SELECT</span> department_id, <span class="sql-function">MAX</span>(salary) <span class="sql-keyword">AS</span> 最高給与
  <span class="sql-keyword">FROM</span> employees <span class="sql-keyword">GROUP BY</span> department_id
) sub <span class="sql-keyword">ON</span> d.id = sub.department_id;</code></pre>

<h2>HAVING句のサブクエリ</h2>
<pre><code><span class="sql-keyword">SELECT</span> department_id, <span class="sql-function">AVG</span>(salary) <span class="sql-keyword">AS</span> 平均給与
<span class="sql-keyword">FROM</span> employees
<span class="sql-keyword">GROUP BY</span> department_id
<span class="sql-keyword">HAVING</span> <span class="sql-function">AVG</span>(salary) > (
  <span class="sql-keyword">SELECT</span> <span class="sql-function">AVG</span>(salary) <span class="sql-keyword">FROM</span> employees
);</code></pre>
    `,
    exercises: [
      {
        id: "pi-sub-1",
        question: "相関サブクエリを使い、employeesのname・salaryと、同じdepartment_idの平均給与「部署平均給与」を取得してください",
        hint: "(SELECT AVG(salary) FROM employees e2 WHERE e2.department_id = e1.department_id) AS 部署平均給与",
        answer: "SELECT name, salary, (SELECT AVG(salary) FROM employees e2 WHERE e2.department_id = e1.department_id) AS 部署平均給与 FROM employees e1",
        expectedColumns: ["name", "salary", "部署平均給与"],
      },
      {
        id: "pi-sub-2",
        question: "FROM句のサブクエリを使い、departmentsと各部署の最高給与（dept_max）をJOINして部署名・最高給与を最高給与降順で取得してください",
        hint: "JOIN (SELECT department_id, MAX(salary) AS 最高給与 FROM employees GROUP BY department_id) dept_max ON d.id = dept_max.department_id",
        answer: "SELECT d.name AS 部署名, dept_max.最高給与 FROM departments d JOIN (SELECT department_id, MAX(salary) AS 最高給与 FROM employees GROUP BY department_id) dept_max ON d.id = dept_max.department_id ORDER BY dept_max.最高給与 DESC",
        expectedColumns: ["部署名", "最高給与"],
      },
      {
        id: "pi-sub-3",
        question: "HAVING句のサブクエリを使い、部署の平均給与が全体平均より高いdepartment_id・平均給与を取得してください",
        hint: "HAVING AVG(salary) > (SELECT AVG(salary) FROM employees)",
        answer: "SELECT department_id, AVG(salary) AS 平均給与 FROM employees GROUP BY department_id HAVING AVG(salary) > (SELECT AVG(salary) FROM employees)",
        expectedColumns: ["department_id", "平均給与"],
      },
      {
        id: "pi-sub-4",
        question: "ネストしたサブクエリを使い、東京以外の都市にある部署に所属する従業員のname・salaryを取得してください",
        hint: "WHERE department_id IN (SELECT id FROM departments WHERE location IN (SELECT DISTINCT location FROM departments WHERE location != '東京'))",
        answer: "SELECT name, salary FROM employees WHERE department_id IN (SELECT id FROM departments WHERE location IN (SELECT DISTINCT location FROM departments WHERE location != '東京'))",
        expectedColumns: ["name", "salary"],
      },
      {
        id: "pi-sub-5",
        question: "相関サブクエリを使い、productsのname・priceと、同一カテゴリ最安値との差「カテゴリ最安値との差」をcategory・price昇順で取得してください",
        hint: "price - (SELECT MIN(price) FROM products WHERE category = p.category) AS カテゴリ最安値との差",
        answer: "SELECT name, price, price - (SELECT MIN(price) FROM products WHERE category = p.category) AS カテゴリ最安値との差 FROM products p ORDER BY category, price",
        expectedColumns: ["name", "price", "カテゴリ最安値との差"],
      },
    ],
  },
  {
    slug: "pi-comprehensive",
    title: "総合演習（中級）",
    level: "intermediate",
    order: 19,
    description: "中級の全知識を組み合わせた実践的な問題に挑戦します",
    content: `
<h2>総合演習について</h2>
<p>ウィンドウ関数・CTE・EXISTS・集合演算・SELF JOIN・ビュー・高度なサブクエリを組み合わせた実践問題です。</p>

<h2>複雑なSQLを書くコツ</h2>
<ol>
  <li>まずCTEで中間テーブルを定義する</li>
  <li>ウィンドウ関数でランキングや累計を計算する</li>
  <li>最後にJOINや集計でまとめる</li>
</ol>

<pre><code><span class="sql-keyword">WITH</span>
  cte1 <span class="sql-keyword">AS</span> (
    <span class="sql-keyword">SELECT</span> ..., <span class="sql-function">RANK</span>() <span class="sql-keyword">OVER</span> (...) <span class="sql-keyword">AS</span> rank
    <span class="sql-keyword">FROM</span> ...
  )
<span class="sql-keyword">SELECT</span> ...
<span class="sql-keyword">FROM</span> cte1
<span class="sql-keyword">WHERE</span> rank <= <span class="sql-number">3</span>;</code></pre>
    `,
    exercises: [
      {
        id: "pi-comp-1",
        question: "CTEとウィンドウ関数・JOINを組み合わせ、部署内salary降順TOP2の従業員のname・salary・部署名・部署内順位を部署名・部署内順位昇順で取得してください",
        hint: "WITH ranked_employees AS (SELECT ..., RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS 部署内順位 FROM employees e JOIN departments d ...) SELECT ... WHERE 部署内順位 <= 2",
        answer: "WITH ranked_employees AS (SELECT e.name, e.salary, d.name AS 部署名, RANK() OVER (PARTITION BY e.department_id ORDER BY e.salary DESC) AS 部署内順位 FROM employees e JOIN departments d ON e.department_id = d.id) SELECT name, salary, 部署名, 部署内順位 FROM ranked_employees WHERE 部署内順位 <= 2 ORDER BY 部署名, 部署内順位",
        expectedColumns: ["name", "salary", "部署名", "部署内順位"],
      },
      {
        id: "pi-comp-2",
        question: "2つのCTEを使い、注文総売上TOP3の商品名・総数量・総売上を取得してください（order_totals CTE→ top3 CTE→ productsをJOIN）",
        hint: "WITH order_totals AS (...), top_3 AS (SELECT ... FROM order_totals ORDER BY 総売上 DESC LIMIT 3) SELECT p.name AS 商品名, t.総数量, t.総売上 FROM top_3 t JOIN products p ...",
        answer: "WITH order_totals AS (SELECT o.product_id, SUM(o.quantity) AS 総数量, SUM(p.price * o.quantity) AS 総売上 FROM orders o JOIN products p ON o.product_id = p.id GROUP BY o.product_id), top_3 AS (SELECT product_id, 総数量, 総売上 FROM order_totals ORDER BY 総売上 DESC LIMIT 3) SELECT p.name AS 商品名, t.総数量, t.総売上 FROM top_3 t JOIN products p ON t.product_id = p.id",
        expectedColumns: ["商品名", "総数量", "総売上"],
      },
      {
        id: "pi-comp-3",
        question: "employeesとdepartmentsをJOINし、部署名・人数・高給与者数（salary>=500000）・平均給与（ROUND）を平均給与降順で取得してください",
        hint: "SUM(CASE WHEN salary >= 500000 THEN 1 ELSE 0 END) AS 高給与者数",
        answer: "SELECT 部署名, COUNT(*) AS 人数, SUM(CASE WHEN salary >= 500000 THEN 1 ELSE 0 END) AS 高給与者数, ROUND(AVG(salary)) AS 平均給与 FROM (SELECT e.name, e.salary, d.name AS 部署名 FROM employees e JOIN departments d ON e.department_id = d.id) GROUP BY 部署名 ORDER BY 平均給与 DESC",
        expectedColumns: ["部署名", "人数", "高給与者数", "平均給与"],
      },
      {
        id: "pi-comp-4",
        question: "EXISTSと相関サブクエリを使い、平均給与より高い従業員が存在する部署の部署名・locationをlocation昇順で取得してください",
        hint: "WHERE EXISTS (SELECT 1 FROM employees e WHERE e.department_id = d.id AND e.salary > (SELECT AVG(salary) FROM employees))",
        answer: "SELECT d.name AS 部署名, d.location FROM departments d WHERE EXISTS (SELECT 1 FROM employees e WHERE e.department_id = d.id AND e.salary > (SELECT AVG(salary) FROM employees)) ORDER BY d.location",
        expectedColumns: ["部署名", "location"],
      },
      {
        id: "pi-comp-5",
        question: "ordersとproductsをJOINし、カテゴリ別の注文件数・総数量・平均注文額（ROUND）・最大注文額を集計し、注文件数>=3のカテゴリを総数量降順で取得してください",
        hint: "GROUP BY category HAVING COUNT(DISTINCT o.id) >= 3 ORDER BY 総数量 DESC",
        answer: "SELECT p.category AS カテゴリ, COUNT(DISTINCT o.id) AS 注文件数, SUM(o.quantity) AS 総数量, ROUND(AVG(p.price * o.quantity)) AS 平均注文額, MAX(p.price * o.quantity) AS 最大注文額 FROM orders o JOIN products p ON o.product_id = p.id GROUP BY p.category HAVING COUNT(DISTINCT o.id) >= 3 ORDER BY 総数量 DESC",
        expectedColumns: ["カテゴリ", "注文件数", "総数量", "平均注文額", "最大注文額"],
      },
    ],
  },
  {
    slug: "pi-window-advanced",
    title: "ウィンドウ関数応用（NTILE・FIRST_VALUE・移動平均）",
    level: "intermediate",
    order: 20,
    description: "NTILE・FIRST_VALUE・LAST_VALUE・移動平均・累計など実践的なウィンドウ関数を学びます",
    content: `
<h2>NTILE — データをN等分に分ける</h2>
<p>行を指定した数のグループ（タイル）に均等に分割します。四分位数や十分位数の算出に便利です。</p>
<pre><code><span class="sql-keyword">SELECT</span> name, salary,
  <span class="sql-function">NTILE</span>(<span class="sql-number">4</span>) <span class="sql-keyword">OVER</span> (<span class="sql-keyword">ORDER BY</span> salary) <span class="sql-keyword">AS</span> 四分位
<span class="sql-keyword">FROM</span> employees;</code></pre>

<h2>FIRST_VALUE / LAST_VALUE — グループ内の最初・最後の値</h2>
<p>パーティション内で最初または最後の行の値を取得します。</p>
<pre><code><span class="sql-keyword">SELECT</span> name, salary, department_id,
  <span class="sql-function">FIRST_VALUE</span>(name) <span class="sql-keyword">OVER</span> (
    <span class="sql-keyword">PARTITION BY</span> department_id <span class="sql-keyword">ORDER BY</span> salary <span class="sql-keyword">DESC</span>
  ) <span class="sql-keyword">AS</span> 部署最高給与者
<span class="sql-keyword">FROM</span> employees;</code></pre>

<h2>移動平均（ROWS BETWEEN）</h2>
<p><code>ROWS BETWEEN N PRECEDING AND CURRENT ROW</code> でフレームを指定して移動平均を計算します。</p>
<pre><code><span class="sql-keyword">SELECT</span> name, salary,
  <span class="sql-function">AVG</span>(salary) <span class="sql-keyword">OVER</span> (
    <span class="sql-keyword">ORDER BY</span> salary
    <span class="sql-keyword">ROWS BETWEEN</span> <span class="sql-number">2</span> <span class="sql-keyword">PRECEDING AND CURRENT ROW</span>
  ) <span class="sql-keyword">AS</span> 移動平均
<span class="sql-keyword">FROM</span> employees;</code></pre>

<h2>累計（SUM OVER）</h2>
<p>ORDER BY と組み合わせて累積合計を計算できます。</p>
<pre><code><span class="sql-keyword">SELECT</span> name, salary,
  <span class="sql-function">SUM</span>(salary) <span class="sql-keyword">OVER</span> (<span class="sql-keyword">ORDER BY</span> salary) <span class="sql-keyword">AS</span> 累計給与
<span class="sql-keyword">FROM</span> employees;</code></pre>
    `,
    exercises: [
      {
        id: "pi-wadv-1",
        question: "NTILE(4)を使い、employeesのname・salaryと給与四分位数を「四分位」という列名でsalary昇順に取得してください",
        hint: "NTILE(4) OVER (ORDER BY salary) AS 四分位",
        answer: "SELECT name, salary, NTILE(4) OVER (ORDER BY salary) AS 四分位 FROM employees ORDER BY salary",
        expectedColumns: ["name", "salary", "四分位"],
      },
      {
        id: "pi-wadv-2",
        question: "FIRST_VALUEを使い、employeesのname・salary・department_idと、部署内salary降順で最も給与が高い従業員名を「部署最高給与者」として取得してください",
        hint: "FIRST_VALUE(name) OVER (PARTITION BY department_id ORDER BY salary DESC) AS 部署最高給与者",
        answer: "SELECT name, salary, department_id, FIRST_VALUE(name) OVER (PARTITION BY department_id ORDER BY salary DESC) AS 部署最高給与者 FROM employees",
        expectedColumns: ["name", "salary", "department_id", "部署最高給与者"],
      },
      {
        id: "pi-wadv-3",
        question: "LAST_VALUEを使い、employeesのname・salary・department_idと、部署内salary昇順で最も給与が低い従業員名を「部署最低給与者」としてROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWINGで取得してください",
        hint: "LAST_VALUE(name) OVER (PARTITION BY department_id ORDER BY salary ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS 部署最低給与者",
        answer: "SELECT name, salary, department_id, LAST_VALUE(name) OVER (PARTITION BY department_id ORDER BY salary ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS 部署最低給与者 FROM employees",
        expectedColumns: ["name", "salary", "department_id", "部署最低給与者"],
      },
      {
        id: "pi-wadv-4",
        question: "salary昇順で直前2行を含む移動平均をROUNDして「移動平均給与」として、employeesのname・salary・移動平均給与をsalary昇順で取得してください",
        hint: "ROUND(AVG(salary) OVER (ORDER BY salary ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)) AS 移動平均給与",
        answer: "SELECT name, salary, ROUND(AVG(salary) OVER (ORDER BY salary ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)) AS 移動平均給与 FROM employees ORDER BY salary",
        expectedColumns: ["name", "salary", "移動平均給与"],
      },
      {
        id: "pi-wadv-5",
        question: "SUM OVER を使い、employeesのname・salary・salary昇順での累計給与を「累計給与」としてsalary昇順で取得してください",
        hint: "SUM(salary) OVER (ORDER BY salary ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS 累計給与",
        answer: "SELECT name, salary, SUM(salary) OVER (ORDER BY salary ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS 累計給与 FROM employees ORDER BY salary",
        expectedColumns: ["name", "salary", "累計給与"],
      },
    ],
  },
];

export function getPremiumLessonBySlug(slug: string): Lesson | undefined {
  return PREMIUM_LESSONS.find((l) => l.slug === slug);
}

export function getPremiumLessonsByLevel(level: "beginner" | "intermediate"): Lesson[] {
  return PREMIUM_LESSONS.filter((l) => l.level === level).sort((a, b) => a.order - b.order);
}
