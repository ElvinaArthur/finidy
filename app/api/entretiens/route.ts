import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { disciplineValue, formatValue, pageValue } from "@/lib/api-validation";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const formatParam = searchParams.get("format");
    const disciplineParam = searchParams.get("discipline");
    const format = formatParam ? formatValue(formatParam) : null;
    const discipline = disciplineParam ? disciplineValue(disciplineParam) : null;
    if ((formatParam && !format) || (disciplineParam && !discipline)) return NextResponse.json({ error: "Filtre invalide" }, { status: 400 });
    const page = pageValue(searchParams.get("page"));
    const limit = 12;

    const where: any = { statut: "PUBLIE" };
    if (format) where.format = format;
    if (discipline) where.discipline = discipline;

    const [entretiens, total] = await Promise.all([
      prisma.entretien.findMany({
        where,
        include: { auteur: { select: { name: true } } },
        orderBy: { publishedAt: "desc" },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.entretien.count({ where }),
    ]);

    return NextResponse.json({
      entretiens,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("GET /api/entretiens", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
