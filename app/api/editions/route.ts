import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const discipline = searchParams.get("discipline");
    const page = parseInt(searchParams.get("page") || "1");
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
  } catch {
    return NextResponse.json({ livres: [], total: 0, page: 1, pages: 0 });
  }
}
