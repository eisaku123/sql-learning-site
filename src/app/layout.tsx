import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { jwtVerify } from "jose";
import { version } from "../../package.json";

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
      <body>
        <SessionProvider>
          {children}
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
