import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/config";
import { slugifyUnique } from "@/lib/slugify";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Connexion requise" }, { status: 401 });
    }

    const body = await req.json();
    const { titre, description, discipline, niveau, dureeHeures, gratuit } = body;

    if (!titre || !description || !discipline || !niveau) {
      return NextResponse.json(
        { error: "Titre, description, discipline et niveau sont requis" },
        { status: 400 },
      );
    }

    const cours = await prisma.cours.create({
      data: {
        titre,
        slug: slugifyUnique(titre),
        description,
        discipline,
        niveau,
        dureeHeures: dureeHeures || null,
        gratuit: gratuit ?? true,
        statut: "BROUILLON",
        formateurId: session.user.id,
      },
    });

    return NextResponse.json({ success: true, id: cours.id, slug: cours.slug });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
