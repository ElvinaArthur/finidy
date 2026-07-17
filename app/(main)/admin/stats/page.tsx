import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth/config'
import { prisma } from '@/lib/prisma'

export default async function StatsAdminPage() {
  const session = await auth(); if ((session?.user as { role?: string } | undefined)?.role !== 'ADMIN') redirect('/dashboard')
  const values = await Promise.all([prisma.user.count(), prisma.articleRevue.count(), prisma.article.count(), prisma.entretien.count(), prisma.livre.count(), prisma.cours.count(), prisma.colloque.count()])
  const labels = ['Utilisateurs', 'Articles revue', 'Magazine', 'Entretiens', 'Livres', 'Cours', 'Colloques']
  return <div className="max-w-5xl mx-auto px-4 py-10"><span className="eyebrow">Administration</span><h1 className="font-display text-3xl font-bold mb-6">Statistiques</h1><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{labels.map((label, index) => <div key={label} className="card p-5"><p className="text-sm text-nihary-gris">{label}</p><p className="text-3xl font-bold">{values[index]}</p></div>)}</div></div>
}
