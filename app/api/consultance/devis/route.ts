import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      expertId,
      nomClient,
      emailClient,
      sujet,
      description,
      budget,
      delai,
    } = body;

    if (!expertId || !nomClient || !emailClient || !sujet || !description) {
      return NextResponse.json(
        { error: "Tous les champs requis ne sont pas remplis" },
        { status: 400 },
      );
    }

    const expert = await prisma.expertProfile.findUnique({
      where: { id: expertId },
    });
    if (!expert) {
      return NextResponse.json(
        { error: "Expert introuvable" },
        { status: 404 },
      );
    }

    const demande = await prisma.demandeConsultance.create({
      data: {
        expertId,
        nomClient,
        emailClient,
        sujet,
        description,
        budget: budget ? parseFloat(budget) : null,
        delai: delai || null,
        statut: "EN_ATTENTE",
      },
    });

    return NextResponse.json({ success: true, id: demande.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
