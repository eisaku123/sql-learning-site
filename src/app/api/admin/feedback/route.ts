import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const isAdmin = await requireAdmin();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [feedbacks, setting] = await Promise.all([
    prisma.feedback.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.siteSetting.findUnique({ where: { key: "feedback_button_enabled" } }),
  ]);

  return NextResponse.json({
    feedbacks,
    buttonEnabled: setting?.value !== "false",
  });
}

export async function POST(req: NextRequest) {
  const isAdmin = await requireAdmin();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  if ("buttonEnabled" in body) {
    await prisma.siteSetting.upsert({
      where: { key: "feedback_button_enabled" },
      update: { value: String(body.buttonEnabled) },
      create: { key: "feedback_button_enabled", value: String(body.buttonEnabled) },
    });
  }

  if ("id" in body && "isRead" in body) {
    await prisma.feedback.update({
      where: { id: body.id },
      data: { isRead: body.isRead },
    });
  }

  return NextResponse.json({ ok: true });
}
