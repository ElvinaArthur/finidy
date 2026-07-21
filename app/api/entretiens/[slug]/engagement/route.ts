import { NextRequest, NextResponse } from "next/server";
import { TypeReaction } from "@prisma/client";
import { auth } from "@/lib/auth/config";
import { cleanString, enumValue, isRecord } from "@/lib/api-validation";
import { prisma } from "@/lib/prisma";

async function findEntretien(slug: string) {
  return prisma.entretien.findUnique({ where: { slug, statut: "PUBLIE" }, select: { id: true } });
}

async function viewer() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, emailVerified: true, suspended: true },
  });
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const entretien = await findEntretien(slug);
    if (!entretien) return NextResponse.json({ error: "Entretien introuvable" }, { status: 404 });

    const currentUser = await viewer();
    const [comments, grouped, ownReaction] = await Promise.all([
      prisma.entretienComment.findMany({
        where: { entretienId: entretien.id },
        include: { user: { select: { name: true, image: true, institution: true } } },
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
      prisma.entretienReaction.groupBy({ by: ["type"], where: { entretienId: entretien.id }, _count: { _all: true } }),
      currentUser ? prisma.entretienReaction.findUnique({ where: { entretienId_userId: { entretienId: entretien.id, userId: currentUser.id } }, select: { type: true } }) : null,
    ]);

    const reactions = Object.fromEntries(Object.values(TypeReaction).map((type) => [type, grouped.find((item) => item.type === type)?._count._all || 0]));
    return NextResponse.json({
      comments: comments.map((comment) => ({ ...comment, createdAt: comment.createdAt.toISOString(), updatedAt: comment.updatedAt.toISOString() })),
      reactions,
      ownReaction: ownReaction?.type || null,
      authenticated: Boolean(currentUser),
      canComment: Boolean(currentUser?.emailVerified && !currentUser.suspended),
    });
  } catch (error) {
    console.error("GET entretien engagement", error);
    return NextResponse.json({ error: "Interactions indisponibles" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const [entretien, currentUser] = await Promise.all([findEntretien(slug), viewer()]);
    if (!entretien) return NextResponse.json({ error: "Entretien introuvable" }, { status: 404 });
    if (!currentUser) return NextResponse.json({ error: "Connexion requise" }, { status: 401 });
    if (currentUser.suspended) return NextResponse.json({ error: "Compte suspendu" }, { status: 403 });

    const body: unknown = await request.json();
    if (!isRecord(body)) return NextResponse.json({ error: "Requête invalide" }, { status: 400 });

    if (body.action === "comment") {
      if (!currentUser.emailVerified) return NextResponse.json({ error: "Vérifiez votre adresse e-mail pour commenter" }, { status: 403 });
      const contenu = cleanString(body.contenu, 1500);
      if (!contenu) return NextResponse.json({ error: "Le commentaire doit contenir entre 1 et 1 500 caractères" }, { status: 400 });
      const comment = await prisma.entretienComment.create({
        data: { entretienId: entretien.id, userId: currentUser.id, contenu },
        include: { user: { select: { name: true, image: true, institution: true } } },
      });
      return NextResponse.json({ comment: { ...comment, createdAt: comment.createdAt.toISOString(), updatedAt: comment.updatedAt.toISOString() } }, { status: 201 });
    }

    if (body.action === "reaction") {
      const type = enumValue(TypeReaction, body.type);
      if (!type) return NextResponse.json({ error: "Réaction invalide" }, { status: 400 });
      const existing = await prisma.entretienReaction.findUnique({ where: { entretienId_userId: { entretienId: entretien.id, userId: currentUser.id } } });
      if (existing?.type === type) {
        await prisma.entretienReaction.delete({ where: { id: existing.id } });
        return NextResponse.json({ ownReaction: null });
      }
      const reaction = await prisma.entretienReaction.upsert({
        where: { entretienId_userId: { entretienId: entretien.id, userId: currentUser.id } },
        update: { type },
        create: { entretienId: entretien.id, userId: currentUser.id, type },
      });
      return NextResponse.json({ ownReaction: reaction.type });
    }

    return NextResponse.json({ error: "Action invalide" }, { status: 400 });
  } catch (error) {
    console.error("POST entretien engagement", error);
    return NextResponse.json({ error: "Interaction impossible" }, { status: 500 });
  }
}
