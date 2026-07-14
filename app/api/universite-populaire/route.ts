import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const niveau = searchParams.get("niveau");
    const discipline = searchParams.get("discipline");
    const page = parseInt(searchParams.get("page") || "1");
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
  } catch {
    return NextResponse.json({ cours: [], total: 0, page: 1, pages: 0 });
  }
}
