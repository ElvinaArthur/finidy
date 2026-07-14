import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/config";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Connexion requise" }, { status: 401 });
    }

    const body = await req.json();
    const { titre, auteurs, resume, discipline, colloqueId } = body;

    if (!titre || !auteurs || !resume || !discipline) {
      return NextResponse.json(
        { error: "Titre, auteurs, résumé et discipline sont requis" },
        { status: 400 },
      );
    }

    const communication = await prisma.communication.create({
      data: {
        titre,
        auteurs,
        resume,
        statut: "EN_ATTENTE",
        colloqueId: colloqueId || (await getDefaultColloqueId()),
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
