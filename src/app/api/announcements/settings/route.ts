import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const setting = await prisma.siteSetting.findUnique({
    where: { key: "premium_signup_enabled" },
  });
  return NextResponse.json({ premiumSignupEnabled: setting?.value !== "false" });
}
