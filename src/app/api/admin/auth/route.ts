import { NextRequest, NextResponse } from "next/server";
import { signAdminToken } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const { id, password } = await req.json();

  if (
    id !== process.env.ADMIN_ID ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return NextResponse.json({ error: "IDまたはパスワードが違います" }, { status: 401 });
  }

  const token = await signAdminToken();

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7日
    path: "/",
  });
  return res;
}
