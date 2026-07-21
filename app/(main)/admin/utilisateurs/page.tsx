import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { resolvePermissions } from "@/lib/auth/permissions";
import UsersTable from "@/components/admin/UsersTable";

export default async function UsersAdminPage() {
  const session = await auth(); if ((session?.user as { role?: string } | undefined)?.role !== "ADMIN") redirect("/dashboard");
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 250, select: { id: true, name: true, email: true, role: true, suspended: true, institution: true, permissions: true, deniedPermissions: true, createdAt: true } });
  return <main className="mx-auto max-w-7xl px-4 py-10"><span className="eyebrow">Administration</span><h1 className="mb-2 font-display text-3xl font-bold">Utilisateurs & autorisations</h1><p className="mb-6 max-w-3xl text-sm leading-6 text-nihary-gris">Le rôle fournit un socle cohérent; les permissions individuelles permettent ensuite d’accorder ou retirer une action précise sans changer tout le profil.</p><UsersTable initialUsers={users.map((user) => ({ ...user, effectivePermissions: resolvePermissions(user.role, user.permissions, user.deniedPermissions), createdAt: user.createdAt.toISOString() }))} currentUserId={session.user.id} /></main>;
}
