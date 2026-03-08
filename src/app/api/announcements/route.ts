import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const announcements = await prisma.announcement.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, content: true, createdAt: true },
  });
  return NextResponse.json(announcements);
}
