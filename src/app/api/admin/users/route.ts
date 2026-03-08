import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const isAdmin = await requireAdmin();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      subscription: {
        select: { status: true, currentPeriodEnd: true },
      },
      progress: {
        select: { lessonSlug: true, completed: true },
      },
      exercises: {
        select: { solved: true },
      },
    },
  });
  return NextResponse.json(users);
}
