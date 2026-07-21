import { NextRequest, NextResponse } from "next/server";
import { StatutRevue } from "@prisma/client";

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
    const [articlesRevue, articlesMagazine, entretiens, livres, cours, communications] = await Promise.all([
      prisma.articleRevue.findMany({
        where: {
          statut: StatutRevue.EN_ATTENTE,
        },
        include: {
          auteur: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      }),

      prisma.article.findMany({
        where: {
          statut: "EN_ATTENTE",
        },
        include: {
          auteur: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      }),

      prisma.entretien.findMany({
        where: {
          statut: "EN_ATTENTE",
        },
        include: {
          auteur: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      }),
      prisma.livre.findMany({ where: { statut: "EN_ATTENTE" }, include: { auteur: { select: { name: true, email: true } } }, orderBy: { createdAt: "asc" } }),
      prisma.cours.findMany({ where: { statut: "EN_ATTENTE" }, include: { formateur: { select: { name: true, email: true } } }, orderBy: { createdAt: "asc" } }),
      prisma.communication.findMany({ where: { statut: "EN_ATTENTE" }, include: { colloque: { select: { titre: true } } }, orderBy: { createdAt: "asc" } }),
    ]);

    return NextResponse.json({
      articlesRevue,
      articlesMagazine,
      entretiens,
      livres,
      cours,
      communications,
    });
  } catch (error) {
    console.error("Erreur GET /api/admin/moderation :", error);

    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

const VALID_TYPES = ["articleRevue", "article", "entretien", "livre", "cours", "communication"] as const;

type ContentType = (typeof VALID_TYPES)[number];

interface ModerationRequestBody {
  type?: unknown;
  id?: unknown;
  statut?: unknown;
  message?: unknown;
}

function isContentType(value: unknown): value is ContentType {
  return (
    typeof value === "string" && VALID_TYPES.includes(value as ContentType)
  );
}

function isStatutRevue(value: unknown): value is StatutRevue {
  return (
    typeof value === "string" &&
    Object.values(StatutRevue).includes(value as StatutRevue)
  );
}

const VALID_ARTICLE_STATUTS = ["BROUILLON", "EN_ATTENTE", "PUBLIE"] as const;

type ArticleStatut = (typeof VALID_ARTICLE_STATUTS)[number];

function isArticleStatut(value: unknown): value is ArticleStatut {
  return (
    typeof value === "string" &&
    VALID_ARTICLE_STATUTS.includes(value as ArticleStatut)
  );
}

export async function PATCH(req: NextRequest) {
  const session = await requireAdmin();

  if (!session) {
    return NextResponse.json(
      { error: "Accès réservé aux administrateurs" },
      { status: 403 },
    );
  }

  try {
    const body = (await req.json()) as ModerationRequestBody;

    const { type, id, statut, message } = body;

    if (!isContentType(type)) {
      return NextResponse.json(
        { error: "Type de contenu invalide" },
        { status: 400 },
      );
    }

    if (typeof id !== "string" || id.trim() === "") {
      return NextResponse.json(
        { error: "Identifiant invalide" },
        { status: 400 },
      );
    }

    /*
     * MODÉRATION D'UN ARTICLE DE REVUE
     */
    if (type === "articleRevue") {
      if (!isStatutRevue(statut)) {
        return NextResponse.json(
          { error: "Statut de revue invalide" },
          { status: 400 },
        );
      }
      if (statut === StatutRevue.EN_REVISION && (typeof message !== "string" || !message.trim())) {
        return NextResponse.json({ error: "Les corrections attendues doivent être précisées" }, { status: 400 });
      }

      const updated = await prisma.articleRevue.update({
        where: {
          id,
        },
        data: {
          statut,
        },
      });
      if (statut === StatutRevue.EN_REVISION) {
        await prisma.notification.create({ data: { userId: updated.auteurId, titre: "Révision demandée", message: `${updated.titre} : ${(message as string).trim()}`, lien: "/dashboard" } });
      }

      return NextResponse.json({
        success: true,
        item: updated,
      });
    }

    /*
     * MODÉRATION D'UN ARTICLE DE MAGAZINE
     */
    if (type === "article") {
      if (!isArticleStatut(statut)) {
        return NextResponse.json(
          { error: "Statut d'article invalide" },
          { status: 400 },
        );
      }

      const updateData: {
        statut: ArticleStatut;
        publishedAt?: Date;
      } = {
        statut,
      };

      if (statut === "PUBLIE") {
        updateData.publishedAt = new Date();
      }

      const updated = await prisma.article.update({
        where: {
          id,
        },
        data: updateData,
      });

      return NextResponse.json({
        success: true,
        item: updated,
      });
    }

    /*
     * MODÉRATION D'UN ENTRETIEN
     */
    if (type === "entretien") {
      if (!isArticleStatut(statut)) {
        return NextResponse.json(
          { error: "Statut d'entretien invalide" },
          { status: 400 },
        );
      }

      const updateData: {
        statut: ArticleStatut;
        publishedAt?: Date;
      } = {
        statut,
      };

      if (statut === "PUBLIE") {
        updateData.publishedAt = new Date();
      }

      const updated = await prisma.entretien.update({
        where: {
          id,
        },
        data: updateData,
      });

      return NextResponse.json({
        success: true,
        item: updated,
      });
    }

    if (type === "livre") {
      if (statut !== "EN_ATTENTE" && statut !== "PUBLIE" && statut !== "REJETE") return NextResponse.json({ error: "Statut de livre invalide" }, { status: 400 });
      const updated = await prisma.livre.update({ where: { id }, data: { statut } });
      return NextResponse.json({ success: true, item: updated });
    }

    if (type === "cours") {
      if (!isArticleStatut(statut)) return NextResponse.json({ error: "Statut de cours invalide" }, { status: 400 });
      const updated = await prisma.cours.update({ where: { id }, data: { statut } });
      return NextResponse.json({ success: true, item: updated });
    }

    if (type === "communication") {
      if (!isStatutRevue(statut)) return NextResponse.json({ error: "Statut de communication invalide" }, { status: 400 });
      const updated = await prisma.communication.update({ where: { id }, data: { statut } });
      return NextResponse.json({ success: true, item: updated });
    }

    return NextResponse.json(
      { error: "Type de contenu non géré" },
      { status: 400 },
    );
  } catch (error) {
    console.error("Erreur PATCH /api/admin/moderation :", error);

    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
