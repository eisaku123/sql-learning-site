import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const setting = await prisma.siteSetting.findUnique({
    where: { key: "feedback_button_enabled" },
  });
  return NextResponse.json({ enabled: setting?.value !== "false" });
}
