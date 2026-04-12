import type { Metadata } from "next";
import { getLessonBySlug } from "@/lib/curriculum";
import LessonPageClient from "./LessonPageClient";

const lessonMeta: Record<string, { title: string; description: string }> = {
  intro: {
    title: "SQLとは？データベースの基礎【初心者向け入門】",
    description: "SQL初心者向け入門レッスン。SQLとデータベースの基本概念をブラウザで実際に動かしながら学習。SELECT文の書き方から丁寧に解説。無料で練習問題に挑戦できます。",
  },
  "select-basics": {
    title: "SELECT文の使い方・書き方【SQL練習問題】",
    description: "SQLのSELECT文を練習問題で学習。列の指定・全件取得・AS句による別名など、実践的なSQLをブラウザ上で書いて実行できます。初心者向けSQL練習サイト。",
  },
  "where-clause": {
    title: "WHERE句の使い方・条件指定【SQL練習問題】",
    description: "SQLのWHERE句を使った条件指定・データ絞り込みを練習問題で習得。比較演算子・LIKE・IN・BETWEEN・NULLの扱い方をブラウザ上で実際に書いて学習。",
  },
  "order-limit": {
    title: "ORDER BY・LIMITの使い方【SQL練習問題】",
    description: "SQLのORDER BYによる並び替えとLIMITによる件数制限を練習問題で学習。昇順・降順ソートやランキング取得のSQL文をブラウザ上で実行できます。",
  },
  "insert-update-delete": {
    title: "INSERT・UPDATE・DELETEの使い方【SQL練習問題】",
    description: "SQLのデータ追加（INSERT）・更新（UPDATE）・削除（DELETE）を練習問題で習得。データ操作の基本SQL文をブラウザ上で書いて学習できます。",
  },
  joins: {
    title: "SQL JOINの使い方・テーブル結合【練習問題】",
    description: "SQLのJOIN（テーブル結合）を練習問題で学習。INNER JOIN・LEFT JOINの違いや書き方を実務レベルで習得。ブラウザ上のSQLエディタで実際に動かして確認できます。",
  },
  "group-by": {
    title: "GROUP BY・HAVINGの使い方・集計【SQL練習問題】",
    description: "SQLのGROUP BYによるグループ集計とHAVINGによる絞り込みを練習問題で学習。COUNT・SUM・AVG・MAX・MINなど集計関数の使い方をブラウザ上で習得。",
  },
  subquery: {
    title: "サブクエリの使い方【SQL練習問題・応用】",
    description: "SQLのサブクエリ（副問い合わせ）を練習問題で習得。相関サブクエリ・EXISTSなど実務で頻出の応用SQL構文をブラウザ上で書いて学習できます。",
  },
  "junction-table": {
    title: "中間テーブル・多対多リレーション【SQL練習問題】",
    description: "SQLの中間テーブルを使った多対多リレーションを練習問題で学習。JOINを組み合わせた実践的なデータ取得SQLをブラウザ上で書いて習得できます。",
  },
};

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const meta = lessonMeta[slug];
  const lesson = getLessonBySlug(slug);

  const title = meta?.title ?? lesson?.title ?? "SQLレッスン";
  const description = meta?.description ?? lesson?.description ?? "SQL練習問題サイト SQLLearnのレッスンページです。";

  return {
    title,
    description,
    keywords: ["SQL練習問題", "SQL学習", title, "SQL初心者", "SQLLearn"],
    alternates: { canonical: `/lessons/${slug}` },
    openGraph: {
      title: `${title} | SQL練習問題 - SQLLearn`,
      description,
      url: `https://www.sql-learning.net/lessons/${slug}`,
    },
  };
}

export default function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  return <LessonPageClient params={params} />;
}
