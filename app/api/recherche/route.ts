import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();

  if (!q) {
    return NextResponse.json({
      q: "",
      articlesRevue: [],
      articlesMagazine: [],
      entretiens: [],
      livres: [],
    });
  }

  try {
    const [articlesRevue, articlesMagazine, entretiens, livres] =
      await Promise.all([
        prisma.articleRevue.findMany({
          where: {
            statut: "PUBLIE",
            OR: [
              { titre: { contains: q, mode: "insensitive" } },
              { resume: { contains: q, mode: "insensitive" } },
            ],
          },
          include: { auteur: { select: { name: true } } },
          take: 10,
        }),
        prisma.article.findMany({
          where: {
            statut: "PUBLIE",
            OR: [
              { titre: { contains: q, mode: "insensitive" } },
              { chapeau: { contains: q, mode: "insensitive" } },
            ],
          },
          include: { auteur: { select: { name: true } } },
          take: 10,
        }),
        prisma.entretien.findMany({
          where: {
            statut: "PUBLIE",
            titre: { contains: q, mode: "insensitive" },
          },
          take: 10,
        }),
        prisma.livre.findMany({
          where: {
            statut: "PUBLIE",
            titre: { contains: q, mode: "insensitive" },
          },
          take: 10,
        }),
      ]);

    return NextResponse.json({
      q,
      articlesRevue,
      articlesMagazine,
      entretiens,
      livres,
    });
  } catch {
    return NextResponse.json({
      q,
      articlesRevue: [],
      articlesMagazine: [],
      entretiens: [],
      livres: [],
    });
  }
}
