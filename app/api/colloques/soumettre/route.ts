import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/config";
import { cleanString, disciplineValue, isRecord } from "@/lib/api-validation";
import { hasCompleteProfile, incompleteProfileResponse } from "@/lib/auth/profile-completeness";
import { missingEvidenceResponse, submissionEvidence } from "@/lib/submission-evidence";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Connexion requise" }, { status: 401 });
    }

    if (!await hasCompleteProfile(session.user.id)) return NextResponse.json(incompleteProfileResponse, { status: 403 });
    const body: unknown = await req.json();
    const evidence = submissionEvidence(body);
    if (!evidence) return NextResponse.json(missingEvidenceResponse, { status: 400 });
    if (!isRecord(body)) return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
    const titre = cleanString(body.titre, 300);
    const auteurs = cleanString(body.auteurs, 500);
    const resume = cleanString(body.resume, 20_000);
    const discipline = disciplineValue(body.discipline);
    const colloqueId = cleanString(body.colloqueId, 100);

    if (!titre || !auteurs || !resume || !discipline) {
      return NextResponse.json(
        { error: "Titre, auteurs, résumé et discipline sont requis" },
        { status: 400 },
      );
    }

    const targetId = colloqueId || (await getDefaultColloqueId());
    const colloque = await prisma.colloque.findFirst({
      where: {
        id: targetId,
        statut: { in: ["OUVERT", "A_VENIR"] },
        OR: [{ dateLimit: null }, { dateLimit: { gte: new Date() } }],
      },
      select: { id: true },
    });
    if (!colloque) return NextResponse.json({ error: "Colloque fermé ou introuvable" }, { status: 400 });

    const communication = await prisma.communication.create({
      data: {
        titre,
        auteurs,
        resume,
        discipline,
        statut: "EN_ATTENTE",
        colloqueId: colloque.id,
        fichierUrl: evidence.contentUrl,
        submissionMeta: evidence,
      },
    });

    return NextResponse.json({ success: true, id: communication.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

async function getDefaultColloqueId(): Promise<string> {
  const colloque = await prisma.colloque.findFirst({
    where: { statut: { in: ["OUVERT", "A_VENIR"] } },
    orderBy: { dateDebut: "asc" },
  });
  if (!colloque) throw new Error("Aucun colloque ouvert");
  return colloque.id;
}
