import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/config";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Connexion requise" }, { status: 401 });
    }

    const existing = await prisma.expertProfile.findUnique({
      where: { userId: session.user.id },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Vous avez déjà un profil expert" },
        { status: 409 },
      );
    }

    const body = await req.json();
    const { titre, specialites, ville, tarifHeure, cvUrl } = body;

    if (!titre || !specialites || specialites.length === 0) {
      return NextResponse.json(
        { error: "Titre et au moins une spécialité sont requis" },
        { status: 400 },
      );
    }

    const profile = await prisma.expertProfile.create({
      data: {
        userId: session.user.id,
        titre,
        specialites,
        ville: ville || null,
        tarifHeure: tarifHeure ? parseFloat(tarifHeure) : null,
        cvUrl: cvUrl || null,
        disponible: true,
      },
    });

    return NextResponse.json({ success: true, id: profile.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
