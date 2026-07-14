import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const statut = searchParams.get("statut");

    const colloques = await prisma.colloque.findMany({
      where: statut ? { statut: statut as any } : undefined,
      orderBy: { dateDebut: "desc" },
      take: 20,
    });

    return NextResponse.json({ colloques });
  } catch {
    return NextResponse.json({ colloques: [] });
  }
}
