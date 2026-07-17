import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { colloqueStatusValue } from "@/lib/api-validation";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const statutParam = searchParams.get("statut");
    const statut = statutParam ? colloqueStatusValue(statutParam) : null;
    if (statutParam && !statut) return NextResponse.json({ error: "Statut invalide" }, { status: 400 });

    const colloques = await prisma.colloque.findMany({
      where: statut ? { statut } : undefined,
      orderBy: { dateDebut: "desc" },
      take: 20,
    });

    return NextResponse.json({ colloques });
  } catch (error) {
    console.error("GET /api/colloques", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
