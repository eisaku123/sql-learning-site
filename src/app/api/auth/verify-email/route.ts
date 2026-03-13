import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/auth/verify-email?error=invalid", req.url));
  }

  const record = await prisma.emailVerificationToken.findUnique({ where: { token } });

  if (!record) {
    return NextResponse.redirect(new URL("/auth/verify-email?error=invalid", req.url));
  }

  if (record.expiresAt < new Date()) {
    await prisma.emailVerificationToken.delete({ where: { token } });
    return NextResponse.redirect(new URL("/auth/verify-email?error=expired", req.url));
  }

  await prisma.user.update({
    where: { id: record.userId },
    data: { emailVerified: true },
  });
  await prisma.emailVerificationToken.delete({ where: { token } });

  return NextResponse.redirect(new URL("/auth/verify-email?success=1", req.url));
}
