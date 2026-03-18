import type { Metadata } from "next";
import { getLessonBySlug } from "@/lib/curriculum";
import LessonPageClient from "./LessonPageClient";

const lessonMeta: Record<string, { title: string; description: string }> = {
  intro: {
    title: "SQLとは？データベースの基礎",
    description: "SQLとデータベースの基本概念をブラウザで実際に動かしながら学習。SELECT文の書き方から丁寧に解説します。",
  },
  "select-basics": {
    title: "SELECT文の基礎",
    description: "データを取得するSELECT文の基本を学習。列の指定・全件取得・AS句による別名など、実践的なSQLをブラウザで練習できます。",
  },
  "where-clause": {
    title: "WHERE句で絞り込む",
    description: "WHERE句を使った条件指定によるデータ絞り込みを学習。比較演算子・LIKE・IN・BETWEEN・NULLの扱い方を練習問題で習得。",
  },
  "order-limit": {
    title: "ORDER BY・LIMITで並び替えと件数制限",
    description: "ORDER BYによるデータの昇順・降順ソートとLIMITによる件数制限を学習。ランキングや最新N件取得のSQLが書けるようになります。",
  },
  "insert-update-delete": {
    title: "INSERT・UPDATE・DELETE",
    description: "データの追加（INSERT）・更新（UPDATE）・削除（DELETE）の書き方を学習。SQLによるデータ操作の基本を練習問題で習得。",
  },
  joins: {
    title: "JOINでテーブルを結合する",
    description: "INNER JOIN・LEFT JOINを使って複数テーブルを結合する方法を学習。実務で頻出のJOIN構文をブラウザ上のSQLエディタで練習できます。",
  },
  "group-by": {
    title: "GROUP BY・HAVINGで集計する",
    description: "GROUP BYによるグループ集計とHAVINGによる絞り込みを学習。COUNT・SUM・AVGなどの集計関数を使ったSQLが書けるようになります。",
  },
  subquery: {
    title: "サブクエリ",
    description: "SELECT文の中にSELECT文を書くサブクエリを学習。相関サブクエリ・EXISTSなど実務で使う応用的なSQL構文を練習問題で習得。",
  },
  index: {
    title: "インデックスとパフォーマンス",
    description: "SQLのパフォーマンス最適化とインデックスの仕組みを学習。EXPLAINによる実行計画の読み方など、実務で役立つSQL最適化技術を解説。",
  },
};

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const meta = lessonMeta[slug];
  const lesson = getLessonBySlug(slug);

  const title = meta?.title ?? lesson?.title ?? "レッスン";
  const description = meta?.description ?? lesson?.description ?? "SQLLearnのレッスンページです。";

  return {
    title,
    description,
    alternates: { canonical: `/lessons/${slug}` },
    openGraph: {
      title: `${title} | SQLLearn`,
      description,
      url: `https://www.sql-learning.net/lessons/${slug}`,
    },
  };
}

export default function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  return <LessonPageClient params={params} />;
}
