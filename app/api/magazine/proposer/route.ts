import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/config";
import { slugifyUnique } from "@/lib/slugify";
import { hasCompleteProfile, incompleteProfileResponse } from "@/lib/auth/profile-completeness";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Connexion requise" }, { status: 401 });
    }

    if (!await hasCompleteProfile(session.user.id)) return NextResponse.json(incompleteProfileResponse, { status: 403 });
    const body = await req.json();
    const { titre, chapeau, contenu, discipline, tags } = body;

    if (!titre || !chapeau || !contenu || !discipline) {
      return NextResponse.json(
        { error: "Titre, chapeau, contenu et discipline sont requis" },
        { status: 400 },
      );
    }

    const article = await prisma.article.create({
      data: {
        titre,
        slug: slugifyUnique(titre),
        chapeau,
        contenu,
        discipline,
        tags: tags || [],
        statut: "EN_ATTENTE",
        auteurId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      id: article.id,
      slug: article.slug,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
