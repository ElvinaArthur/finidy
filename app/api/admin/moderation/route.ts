import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json(
      { error: "Accès réservé aux administrateurs" },
      { status: 403 },
    );
  }

  try {
    const [articlesRevue, articlesMagazine, entretiens] = await Promise.all([
      prisma.articleRevue.findMany({
        where: { statut: "EN_ATTENTE" },
        include: { auteur: { select: { name: true, email: true } } },
        orderBy: { createdAt: "asc" },
      }),
      prisma.article.findMany({
        where: { statut: "EN_ATTENTE" },
        include: { auteur: { select: { name: true, email: true } } },
        orderBy: { createdAt: "asc" },
      }),
      prisma.entretien.findMany({
        where: { statut: "EN_ATTENTE" },
        include: { auteur: { select: { name: true, email: true } } },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    return NextResponse.json({ articlesRevue, articlesMagazine, entretiens });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

const VALID_TYPES = ["articleRevue", "article", "entretien"] as const;
type ContentType = (typeof VALID_TYPES)[number];

export async function PATCH(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json(
      { error: "Accès réservé aux administrateurs" },
      { status: 403 },
    );
  }

  try {
    const { type, id, statut } = (await req.json()) as {
      type: ContentType;
      id: string;
      statut: string;
    };

    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json(
        { error: "Type de contenu invalide" },
        { status: 400 },
      );
    }

    if (type === "articleRevue") {
      const validStatuts = [
        "EN_ATTENTE",
        "EN_REVISION",
        "ACCEPTE",
        "PUBLIE",
        "REJETE",
      ];
      if (!validStatuts.includes(statut)) {
        return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
      }
      const updated = await prisma.articleRevue.update({
        where: { id },
        data: { statut },
      });
      return NextResponse.json({ success: true, item: updated });
    }

    if (type === "article") {
      const validStatuts = ["BROUILLON", "EN_ATTENTE", "PUBLIE"];
      if (!validStatuts.includes(statut)) {
        return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
      }
      const updateData: any = { statut };
      if (statut === "PUBLIE") updateData.publishedAt = new Date();
      const updated = await prisma.article.update({
        where: { id },
        data: updateData,
      });
      return NextResponse.json({ success: true, item: updated });
    }

    if (type === "entretien") {
      const validStatuts = ["BROUILLON", "EN_ATTENTE", "PUBLIE"];
      if (!validStatuts.includes(statut)) {
        return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
      }
      const updateData: any = { statut };
      if (statut === "PUBLIE") updateData.publishedAt = new Date();
      const updated = await prisma.entretien.update({
        where: { id },
        data: updateData,
      });
      return NextResponse.json({ success: true, item: updated });
    }

    return NextResponse.json({ error: "Type non géré" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
