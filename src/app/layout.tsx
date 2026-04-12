import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import NavigationSpinner from "@/components/NavigationSpinner";
import FeedbackButton from "@/components/FeedbackButton";
import Script from "next/script";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { jwtVerify } from "jose";
import { version } from "../../package.json";

export const metadata: Metadata = {
  title: {
    default: "SQL練習問題・学習サイト【無料】| ブラウザで学ぶSQL入門 - SQLLearn",
    template: "%s | SQL練習問題 - SQLLearn",
  },
  description: "ブラウザ上でSQLを実行しながら学べる無料の練習問題サイト。SELECT・WHERE・JOIN・GROUP BY・サブクエリまで初級から中級まで全9レッスン・27問収録。インストール不要でSQL初心者でも今すぐ始められます。",
  keywords: [
    "SQL", "SQL練習問題", "SQL問題集", "SQL学習", "SQL入門", "SQL初心者",
    "SQL勉強", "SQL勉強サイト", "SQL練習サイト", "SQLオンライン",
    "SELECT文", "WHERE句", "JOIN", "GROUP BY", "サブクエリ",
    "データベース", "データベース入門", "データベース学習",
    "SQL無料", "SQL無料学習", "プログラミング学習",
  ],
  metadataBase: new URL("https://www.sql-learning.net"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://www.sql-learning.net",
    siteName: "SQLLearn",
    title: "SQL練習問題・学習サイト【無料】| ブラウザで学ぶSQL入門 - SQLLearn",
    description: "ブラウザ上でSQLを実行しながら学べる無料の練習問題サイト。SELECT・WHERE・JOIN・GROUP BYを初級から中級まで全9レッスンで学習。",
  },
  twitter: {
    card: "summary_large_image",
    title: "SQL練習問題・学習サイト【無料】| ブラウザで学ぶSQL入門 - SQLLearn",
    description: "ブラウザ上でSQLを実行しながら学べる無料の練習問題サイト。SELECT・WHERE・JOIN・GROUP BYを初級から中級まで全9レッスンで学習。",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "TVHjQhIfkJhN5TkzpQIzs7FCguhaksMZh_fizcPpEx8",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";

  // /admin, /maintenance, /api は除外
  const skipMaintenance =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/maintenance") ||
    pathname.startsWith("/api");

  if (!skipMaintenance) {
    // 管理者クッキーチェック
    const cookieHeader = headersList.get("cookie") ?? "";
    const adminToken = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("admin_token="))
      ?.split("=")[1];

    let isAdmin = false;
    if (adminToken) {
      try {
        const secret = new TextEncoder().encode(process.env.ADMIN_SECRET ?? "fallback-secret");
        await jwtVerify(adminToken, secret);
        isAdmin = true;
      } catch {}
    }

    if (!isAdmin) {
      const setting = await prisma.siteSetting.findUnique({
        where: { key: "maintenance_mode" },
      });
      if (setting?.value === "true") {
        redirect("/maintenance");
      }
    }
  }

  return (
    <html lang="ja">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Course",
              "name": "SQLLearn - SQL練習問題・学習コース",
              "description": "ブラウザ上でSQLを実行しながら学べる無料の練習問題サイト。SELECT・WHERE・JOIN・GROUP BY・サブクエリまで初級から中級まで全9レッスン・27問収録。",
              "url": "https://www.sql-learning.net",
              "inLanguage": "ja",
              "isAccessibleForFree": true,
              "provider": {
                "@type": "Organization",
                "name": "SQLLearn",
                "url": "https://www.sql-learning.net",
              },
              "teaches": ["SQL", "SELECT文", "WHERE句", "JOIN", "GROUP BY", "サブクエリ", "データベース"],
              "educationalLevel": "初心者〜中級者",
              "hasCourseInstance": {
                "@type": "CourseInstance",
                "courseMode": "online",
                "inLanguage": "ja",
              },
            }),
          }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-38B8WTM9E7"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-38B8WTM9E7');
        `}</Script>
      </head>
      <body>
        <SessionProvider>
          <NavigationSpinner />
          {children}
          <FeedbackButton />
          <footer
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              padding: "1.5rem 2rem",
              textAlign: "center",
              color: "#8888aa",
              fontSize: "0.82rem",
            }}
          >
            <Link
              href="/tokutei"
              style={{ color: "#8888aa", textDecoration: "none", marginRight: "1.5rem" }}
            >
              特定商取引法に基づく表記
            </Link>
            <span>© 2026 SQLLearn</span>
            <span style={{ marginLeft: "1.5rem", opacity: 0.5 }}>v{version}</span>
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}
