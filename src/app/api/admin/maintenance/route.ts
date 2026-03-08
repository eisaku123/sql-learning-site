import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const isAdmin = await requireAdmin();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const setting = await prisma.siteSetting.findUnique({ where: { key: "maintenance_mode" } });
  return NextResponse.json({ enabled: setting?.value === "true" });
}

export async function POST(req: NextRequest) {
  const isAdmin = await requireAdmin();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { enabled } = await req.json();
  await prisma.siteSetting.upsert({
    where: { key: "maintenance_mode" },
    update: { value: String(enabled) },
    create: { key: "maintenance_mode", value: String(enabled) },
  });
  return NextResponse.json({ ok: true });
}
