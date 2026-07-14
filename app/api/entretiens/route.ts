import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format");
    const discipline = searchParams.get("discipline");
    const page = parseInt(searchParams.get("page") || "1");
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
  } catch {
    return NextResponse.json({ entretiens: [], total: 0, page: 1, pages: 0 });
  }
}
