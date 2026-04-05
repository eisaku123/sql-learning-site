import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const isAdmin = await requireAdmin();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [maintenance, premiumSignup, stripeMode] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { key: "maintenance_mode" } }),
    prisma.siteSetting.findUnique({ where: { key: "premium_signup_enabled" } }),
    prisma.siteSetting.findUnique({ where: { key: "stripe_mode" } }),
  ]);
  return NextResponse.json({
    enabled: maintenance?.value === "true",
    premiumSignupEnabled: premiumSignup?.value !== "false",
    stripeMode: stripeMode?.value === "live" ? "live" : "test",
  });
}

export async function POST(req: NextRequest) {
  const isAdmin = await requireAdmin();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  if ("enabled" in body) {
    await prisma.siteSetting.upsert({
      where: { key: "maintenance_mode" },
      update: { value: String(body.enabled) },
      create: { key: "maintenance_mode", value: String(body.enabled) },
    });
  }

  if ("premiumSignupEnabled" in body) {
    await prisma.siteSetting.upsert({
      where: { key: "premium_signup_enabled" },
      update: { value: String(body.premiumSignupEnabled) },
      create: { key: "premium_signup_enabled", value: String(body.premiumSignupEnabled) },
    });
  }

  if ("stripeMode" in body && (body.stripeMode === "test" || body.stripeMode === "live")) {
    await prisma.siteSetting.upsert({
      where: { key: "stripe_mode" },
      update: { value: body.stripeMode },
      create: { key: "stripe_mode", value: body.stripeMode },
    });
  }

  return NextResponse.json({ ok: true });
}
