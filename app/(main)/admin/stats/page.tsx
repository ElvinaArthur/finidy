import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth/config'
import { prisma } from '@/lib/prisma'

export default async function StatsAdminPage() {
  const session = await auth(); if ((session?.user as { role?: string } | undefined)?.role !== 'ADMIN') redirect('/dashboard')
  const since = new Date(); since.setDate(since.getDate() - 30)
  const [users, newUsers, publishedReview, pendingReview, magazine, interviews, books, courses, contacts, consulting, views] = await Promise.all([
    prisma.user.count(), prisma.user.count({ where: { createdAt: { gte: since } } }), prisma.articleRevue.count({ where: { statut: 'PUBLIE' } }), prisma.articleRevue.count({ where: { statut: 'EN_ATTENTE' } }), prisma.article.count({ where: { statut: 'PUBLIE' } }), prisma.entretien.count({ where: { statut: 'PUBLIE' } }), prisma.livre.count({ where: { statut: 'PUBLIE' } }), prisma.cours.count({ where: { statut: 'PUBLIE' } }), prisma.contactMessage.count({ where: { statut: { in: ['NOUVEAU', 'EN_COURS'] } } }), prisma.demandeConsultance.count({ where: { statut: { in: ['EN_ATTENTE', 'EN_COURS'] } } }), prisma.$queryRaw<Array<{ total: bigint }>>`SELECT COALESCE((SELECT SUM("vues") FROM "ArticleRevue"),0) + COALESCE((SELECT SUM("vues") FROM "Article"),0) + COALESCE((SELECT SUM("vues") FROM "Entretien"),0) AS total`,
  ])
  const acceptanceBase = publishedReview + pendingReview; const acceptance = acceptanceBase ? Math.round(publishedReview / acceptanceBase * 100) : 0
  const cards = [{label:'Membres',value:users,detail:`+${newUsers} sur 30 jours`},{label:'Vues cumulées',value:Number(views[0]?.total || 0),detail:'Revue, magazine et entretiens'},{label:'Taux de publication revue',value:`${acceptance}%`,detail:`${pendingReview} en attente`},{label:'CRM à traiter',value:contacts + consulting,detail:`${contacts} messages · ${consulting} expertises`},{label:'Articles revue publiés',value:publishedReview},{label:'Magazine',value:magazine},{label:'Entretiens',value:interviews},{label:'Livres',value:books},{label:'Cours',value:courses}]
  return <div className="max-w-6xl mx-auto px-4 py-10"><span className="eyebrow">Pilotage</span><h1 className="font-display text-3xl font-bold mb-2">KPI de la plateforme</h1><p className="text-sm text-nihary-gris mb-7">Indicateurs calculés en temps réel depuis Neon.</p><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{cards.map((card) => <div key={card.label} className="card p-5"><p className="text-xs uppercase tracking-wide text-nihary-gris">{card.label}</p><p className="text-3xl font-bold mt-2">{card.value}</p>{card.detail && <p className="text-xs text-nihary-gris mt-2">{card.detail}</p>}</div>)}</div></div>
}
