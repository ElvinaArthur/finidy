import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth/config'
import { prisma } from '@/lib/prisma'

export default async function ColloquesAdminPage() {
  const session = await auth(); if ((session?.user as { role?: string } | undefined)?.role !== 'ADMIN') redirect('/dashboard')
  const colloques = await prisma.colloque.findMany({ orderBy: { dateDebut: 'desc' }, include: { _count: { select: { communications: true, sessions: true } } } })
  return <div className="max-w-5xl mx-auto px-4 py-10"><span className="eyebrow">Administration</span><h1 className="font-display text-3xl font-bold mb-6">Colloques</h1><div className="space-y-3">{colloques.map((item) => <div key={item.id} className="card p-5"><h2 className="font-semibold">{item.titre}</h2><p className="text-sm text-nihary-gris">{item.statut} · {item.dateDebut.toLocaleDateString('fr-FR')} · {item._count.sessions} sessions · {item._count.communications} communications</p></div>)}</div></div>
}
