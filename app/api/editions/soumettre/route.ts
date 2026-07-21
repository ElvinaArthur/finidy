import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/config";
import { slugifyUnique } from "@/lib/slugify";
import { hasCompleteProfile, incompleteProfileResponse } from "@/lib/auth/profile-completeness";
import { missingEvidenceResponse, submissionEvidence } from "@/lib/submission-evidence";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Connexion requise" }, { status: 401 });
    }

    if (!await hasCompleteProfile(session.user.id)) return NextResponse.json(incompleteProfileResponse, { status: 403 });
    const body = await req.json();
    const evidence = submissionEvidence(body);
    if (!evidence) return NextResponse.json(missingEvidenceResponse, { status: 400 });
    const { titre, description, discipline, annee, collection, isbn } = body;

    if (!titre || !description || !discipline || !annee) {
      return NextResponse.json(
        { error: "Titre, description, discipline et année sont requis" },
        { status: 400 },
      );
    }

    const livre = await prisma.livre.create({
      data: {
        titre,
        slug: slugifyUnique(titre),
        description,
        discipline,
        annee: parseInt(annee),
        collection: collection || null,
        isbn: isbn || null,
        statut: "EN_ATTENTE",
        auteurId: session.user.id,
        couvertureUrl: evidence.thumbnailUrl,
        extraitUrl: evidence.contentUrl,
        submissionMeta: evidence,
      },
    });

    return NextResponse.json({ success: true, id: livre.id, slug: livre.slug });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
