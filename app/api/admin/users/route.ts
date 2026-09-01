import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { isRecord } from "@/lib/api-validation";
import { hasPermission, PERMISSIONS, resolvePermissions } from "@/lib/auth/permissions";

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || !await hasPermission(session.user.id, "MANAGE_USERS")) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  try {
    const body: unknown = await request.json();
    if (!isRecord(body) || typeof body.id !== "string") return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
    if (body.id === session.user.id && body.suspended === true) return NextResponse.json({ error: "Vous ne pouvez pas suspendre votre propre compte" }, { status: 400 });
    if (body.id === session.user.id && (body.role !== undefined || body.permissions !== undefined || body.deniedPermissions !== undefined)) return NextResponse.json({ error: "Vous ne pouvez pas modifier vos propres accès" }, { status: 400 });
    const role = typeof body.role === "string" && Object.values(Role).includes(body.role as Role) ? body.role as Role : undefined;
    const suspended = typeof body.suspended === "boolean" ? body.suspended : undefined;
    const permissions = validPermissions(body.permissions);
    const deniedPermissions = validPermissions(body.deniedPermissions);
    const verified = typeof body.verified === "boolean" ? body.verified : undefined;
    if (role === undefined && suspended === undefined && permissions === undefined && deniedPermissions === undefined && verified === undefined) return NextResponse.json({ error: "Aucune modification valide" }, { status: 400 });
    const target = await prisma.user.findUnique({ where: { id: body.id }, select: { role: true, suspended: true } });
    if (!target) return NextResponse.json({ error: "Compte introuvable" }, { status: 404 });
    if (target.role === "ADMIN" && !target.suspended && (role && role !== "ADMIN" || suspended === true)) { const admins = await prisma.user.count({ where: { role: "ADMIN", suspended: false } }); if (admins <= 1) return NextResponse.json({ error: "Le dernier administrateur actif doit être conservé" }, { status: 400 }); }
    const user = await prisma.user.update({ where: { id: body.id }, data: { ...(role ? { role } : {}), ...(suspended !== undefined ? { suspended } : {}), ...(permissions ? { permissions } : {}), ...(deniedPermissions ? { deniedPermissions } : {}), ...(verified !== undefined ? { emailVerified: verified ? new Date() : null } : {}) }, select: { id: true, role: true, suspended: true, permissions: true, deniedPermissions: true, emailVerified: true } });
    return NextResponse.json({ success: true, user: { ...user, effectivePermissions: resolvePermissions(user.role, user.permissions, user.deniedPermissions) } });
  } catch (error) { console.error("PATCH /api/admin/users", error); return NextResponse.json({ error: "Mise à jour impossible" }, { status: 500 }); }
}
function validPermissions(value: unknown) { return Array.isArray(value) && value.every((item) => typeof item === "string" && (PERMISSIONS as readonly string[]).includes(item)) ? value as string[] : undefined; }
