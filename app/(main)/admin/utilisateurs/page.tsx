import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth/config'
import { prisma } from '@/lib/prisma'
import UsersTable from '@/components/admin/UsersTable'

export default async function UsersAdminPage() {
  const session = await auth(); if ((session?.user as { role?: string } | undefined)?.role !== 'ADMIN') redirect('/dashboard')
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 250, select: { id: true, name: true, email: true, role: true, suspended: true, institution: true, createdAt: true } })
  return <div className="max-w-6xl mx-auto px-4 py-10"><span className="eyebrow">Administration</span><h1 className="font-display text-3xl font-bold mb-2">Utilisateurs</h1><p className="text-sm text-nihary-gris mb-6">Gérez les rôles et les accès. Les comptes suspendus ne peuvent plus se connecter.</p><UsersTable initialUsers={users.map((user) => ({ ...user, createdAt: user.createdAt.toISOString() }))} currentUserId={session.user.id} /></div>
}
