import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

function getAdminSecret() {
  return new TextEncoder().encode(process.env.ADMIN_SECRET ?? "fallback-secret");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // x-pathname ヘッダーをすべてのリクエストに付与（layout.tsxで利用）
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  // /admin/* の認証チェック
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return NextResponse.next({ request: { headers: requestHeaders } });
    }

    const token = request.cookies.get("admin_token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      await jwtVerify(token, getAdminSecret());
    } catch {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sql-wasm.wasm).*)"],
};
