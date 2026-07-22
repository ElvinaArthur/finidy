import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/config";
import { cleanString, isEmail, isRecord } from "@/lib/api-validation";
import { rateLimit, requestFingerprint } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const limited = await rateLimit("contact.create", requestFingerprint(req), 5, 60 * 60);
    if (!limited.allowed) return NextResponse.json({ error: "Trop de messages envoyés. Réessayez plus tard." }, { status: 429, headers: { "Retry-After": String(limited.retryAfter) } });
    const body: unknown = await req.json();
    if (!isRecord(body)) return NextResponse.json({ error: "Requête invalide" }, { status: 400 });

    const nom = cleanString(body.nom, 120);
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const sujet = cleanString(body.sujet, 80);
    const message = cleanString(body.message, 10_000);
    if (!nom || !isEmail(email) || !sujet || !message) {
      return NextResponse.json({ error: "Nom, email, sujet et message valides sont requis" }, { status: 400 });
    }

    const session = await auth();
    const saved = await prisma.contactMessage.create({
      data: { nom, email, sujet, message, userId: session?.user?.id ?? null },
      select: { id: true },
    });
    return NextResponse.json({ success: true, id: saved.id }, { status: 201 });
  } catch (error) {
    console.error("POST /api/contact", error);
    return NextResponse.json({ error: "Impossible d’envoyer le message" }, { status: 500 });
  }
}
