import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const clamp = (value: string | null, fallback: number, min: number, max: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.min(Math.max(Math.trunc(parsed), min), max) : fallback;
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim().slice(0, 120) || "";
    const specialite = searchParams.get("specialite")?.trim().slice(0, 100) || "";
    const ville = searchParams.get("ville")?.trim().slice(0, 100) || "";
    const maxTarif = Number(searchParams.get("maxTarif"));
    const page = clamp(searchParams.get("page"), 1, 1, 10_000);
    const limit = clamp(searchParams.get("limit"), 24, 1, 60);
    const sort = searchParams.get("sort");

    const where: Prisma.ExpertProfileWhereInput = {
      disponible: true,
      ...(specialite ? { specialites: { has: specialite } } : {}),
      ...(ville ? { ville: { contains: ville, mode: "insensitive" } } : {}),
      ...(Number.isFinite(maxTarif) && maxTarif > 0 ? { tarifHeure: { lte: maxTarif } } : {}),
      ...(query ? {
        OR: [
          { titre: { contains: query, mode: "insensitive" } },
          { specialites: { has: query } },
          { ville: { contains: query, mode: "insensitive" } },
          { user: { is: { name: { contains: query, mode: "insensitive" } } } },
          { user: { is: { institution: { contains: query, mode: "insensitive" } } } },
          { user: { is: { bio: { contains: query, mode: "insensitive" } } } },
        ],
      } : {}),
    };

    const orderBy: Prisma.ExpertProfileOrderByWithRelationInput[] =
      sort === "tarif-asc" ? [{ tarifHeure: "asc" }] :
      sort === "tarif-desc" ? [{ tarifHeure: "desc" }] :
      sort === "nom" ? [{ user: { name: "asc" } }] :
      [{ createdAt: "desc" }];

    const [experts, total] = await Promise.all([
      prisma.expertProfile.findMany({
        where,
        include: { user: { select: { name: true, institution: true, image: true, bio: true } } },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.expertProfile.count({ where }),
    ]);

    return NextResponse.json({ experts, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("GET /api/consultance", error);
    return NextResponse.json({ experts: [], total: 0, page: 1, pages: 0 }, { status: 500 });
  }
}
