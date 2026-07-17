import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { disciplineValue, pageValue } from "@/lib/api-validation";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const disciplineParam = searchParams.get("discipline");
    const discipline = disciplineParam ? disciplineValue(disciplineParam) : null;
    if (disciplineParam && !discipline) return NextResponse.json({ error: "Discipline invalide" }, { status: 400 });
    const page = pageValue(searchParams.get("page"));
    const limit = 12;

    const where: any = { statut: "PUBLIE" };
    if (discipline) where.discipline = discipline;

    const [livres, total] = await Promise.all([
      prisma.livre.findMany({
        where,
        include: { auteur: { select: { name: true, institution: true } } },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.livre.count({ where }),
    ]);

    return NextResponse.json({ livres, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("GET /api/editions", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
