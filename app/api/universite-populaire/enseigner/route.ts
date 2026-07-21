import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/config";
import { slugifyUnique } from "@/lib/slugify";
import { hasCompleteProfile, incompleteProfileResponse } from "@/lib/auth/profile-completeness";
import { missingEvidenceResponse, submissionEvidence } from "@/lib/submission-evidence";
import { forbiddenPermissionResponse, hasPermission } from "@/lib/auth/permissions";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Connexion requise" }, { status: 401 });
    }

    if (!await hasCompleteProfile(session.user.id)) return NextResponse.json(incompleteProfileResponse, { status: 403 });
    if (!await hasPermission(session.user.id, "SUBMIT_COURS")) return NextResponse.json(forbiddenPermissionResponse, { status: 403 });
    const directPublish = await hasPermission(session.user.id, "PUBLISH_CONTENT");
    const body = await req.json();
    const evidence = submissionEvidence(body);
    if (!evidence) return NextResponse.json(missingEvidenceResponse, { status: 400 });
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
        statut: directPublish ? "PUBLIE" : "EN_ATTENTE",
        formateurId: session.user.id,
        imageUrl: evidence.thumbnailUrl,
        submissionMeta: evidence,
      },
    });

    return NextResponse.json({ success: true, id: cours.id, slug: cours.slug });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
