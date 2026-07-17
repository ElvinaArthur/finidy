import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth/config'
import { prisma } from '@/lib/prisma'

export default async function UsersAdminPage() {
  const session = await auth(); if ((session?.user as { role?: string } | undefined)?.role !== 'ADMIN') redirect('/dashboard')
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 100, select: { id: true, name: true, email: true, role: true, institution: true, createdAt: true } })
  return <div className="max-w-5xl mx-auto px-4 py-10"><span className="eyebrow">Administration</span><h1 className="font-display text-3xl font-bold mb-6">Utilisateurs</h1><div className="card overflow-x-auto"><table className="w-full text-sm"><thead><tr><th className="p-3 text-left">Nom</th><th>Email</th><th>Rôle</th><th>Institution</th><th>Inscription</th></tr></thead><tbody>{users.map((user) => <tr key={user.id} className="border-t"><td className="p-3">{user.name}</td><td>{user.email}</td><td>{user.role}</td><td>{user.institution || '—'}</td><td>{user.createdAt.toLocaleDateString('fr-FR')}</td></tr>)}</tbody></table></div></div>
}
