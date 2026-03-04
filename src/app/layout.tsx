import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: {
    default: "SQLLearn - ブラウザで学ぶSQL入門",
    template: "%s | SQLLearn",
  },
  description: "インストール不要。ブラウザ上でSQLを実行しながら学べる無料の学習プラットフォーム。初級から中級まで全9レッスン・27問の練習問題を収録。",
  keywords: ["SQL", "SQL学習", "SQL入門", "データベース", "プログラミング学習", "ブラウザ", "無料"],
  metadataBase: new URL("https://www.sql-learning.net"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://www.sql-learning.net",
    siteName: "SQLLearn",
    title: "SQLLearn - ブラウザで学ぶSQL入門",
    description: "インストール不要。ブラウザ上でSQLを実行しながら学べる無料の学習プラットフォーム。",
  },
  twitter: {
    card: "summary_large_image",
    title: "SQLLearn - ブラウザで学ぶSQL入門",
    description: "インストール不要。ブラウザ上でSQLを実行しながら学べる無料の学習プラットフォーム。",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "TVHjQhIfkJhN5TkzpQIzs7FCguhaksMZh_fizcPpEx8",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
