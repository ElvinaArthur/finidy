import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth/config'
import { prisma } from '@/lib/prisma'

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/connexion?callbackUrl=/dashboard/profil')
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { name: true, email: true, institution: true, discipline: true, bio: true, role: true } })
  if (!user) redirect('/auth/connexion')
  return <div className="max-w-2xl mx-auto px-4 py-10">
    <span className="eyebrow">Mon espace</span><h1 className="font-display text-3xl font-bold text-nihary-ambre-fonce mb-6">Mon profil</h1>
    <dl className="card p-6 grid gap-4">{Object.entries(user).map(([key, value]) => <div key={key}><dt className="text-xs uppercase text-nihary-gris">{key}</dt><dd className="text-nihary-brun">{value || 'Non renseigné'}</dd></div>)}</dl>
  </div>
}
