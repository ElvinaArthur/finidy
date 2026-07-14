import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const specialite = searchParams.get("specialite");
    const ville = searchParams.get("ville");

    const where: any = { disponible: true };
    if (specialite) where.specialites = { has: specialite };
    if (ville) where.ville = { contains: ville, mode: "insensitive" };

    const experts = await prisma.expertProfile.findMany({
      where,
      include: {
        user: { select: { name: true, institution: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ experts });
  } catch {
    return NextResponse.json({ experts: [] });
  }
}
