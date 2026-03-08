import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const isAdmin = await requireAdmin();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(announcements);
}

export async function POST(req: NextRequest) {
  const isAdmin = await requireAdmin();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, content, isPublished } = await req.json();
  const announcement = await prisma.announcement.create({
    data: { title, content, isPublished: isPublished ?? false },
  });
  return NextResponse.json(announcement);
}

export async function PUT(req: NextRequest) {
  const isAdmin = await requireAdmin();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, title, content, isPublished } = await req.json();
  const announcement = await prisma.announcement.update({
    where: { id },
    data: { title, content, isPublished },
  });
  return NextResponse.json(announcement);
}

export async function DELETE(req: NextRequest) {
  const isAdmin = await requireAdmin();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await prisma.announcement.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
