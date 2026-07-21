import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { requireAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";
import { isRecord } from "@/lib/api-validation";
import { PERMISSIONS, resolvePermissions } from "@/lib/auth/permissions";

export async function PATCH(request: NextRequest) {
  const session = await requireAdmin();
  if (!session?.user?.id) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  try {
    const body: unknown = await request.json();
    if (!isRecord(body) || typeof body.id !== "string") return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
    if (body.id === session.user.id && body.suspended === true) return NextResponse.json({ error: "Vous ne pouvez pas suspendre votre propre compte" }, { status: 400 });
    const role = typeof body.role === "string" && Object.values(Role).includes(body.role as Role) ? body.role as Role : undefined;
    const suspended = typeof body.suspended === "boolean" ? body.suspended : undefined;
    const permissions = validPermissions(body.permissions);
    const deniedPermissions = validPermissions(body.deniedPermissions);
    if (role === undefined && suspended === undefined && permissions === undefined && deniedPermissions === undefined) return NextResponse.json({ error: "Aucune modification valide" }, { status: 400 });
    const user = await prisma.user.update({ where: { id: body.id }, data: { ...(role ? { role } : {}), ...(suspended !== undefined ? { suspended } : {}), ...(permissions ? { permissions } : {}), ...(deniedPermissions ? { deniedPermissions } : {}) }, select: { id: true, role: true, suspended: true, permissions: true, deniedPermissions: true } });
    return NextResponse.json({ success: true, user: { ...user, effectivePermissions: resolvePermissions(user.role, user.permissions, user.deniedPermissions) } });
  } catch (error) { console.error("PATCH /api/admin/users", error); return NextResponse.json({ error: "Mise à jour impossible" }, { status: 500 }); }
}
function validPermissions(value: unknown) { return Array.isArray(value) && value.every((item) => typeof item === "string" && (PERMISSIONS as readonly string[]).includes(item)) ? value as string[] : undefined; }
