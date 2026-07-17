import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { disciplineValue, levelValue, pageValue } from "@/lib/api-validation";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const niveauParam = searchParams.get("niveau");
    const disciplineParam = searchParams.get("discipline");
    const niveau = niveauParam ? levelValue(niveauParam) : null;
    const discipline = disciplineParam ? disciplineValue(disciplineParam) : null;
    if ((niveauParam && !niveau) || (disciplineParam && !discipline)) return NextResponse.json({ error: "Filtre invalide" }, { status: 400 });
    const page = pageValue(searchParams.get("page"));
    const limit = 12;

    const where: any = { statut: "PUBLIE" };
    if (niveau) where.niveau = niveau;
    if (discipline) where.discipline = discipline;

    const [cours, total] = await Promise.all([
      prisma.cours.findMany({
        where,
        include: {
          formateur: { select: { name: true, institution: true } },
          _count: { select: { chapitres: true, inscriptions: true } },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.cours.count({ where }),
    ]);

    return NextResponse.json({ cours, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("GET /api/universite-populaire", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
