import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth/config'
import { prisma } from '@/lib/prisma'
import ProfileForm from '@/components/dashboard/ProfileForm'

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/connexion?callbackUrl=/dashboard/profil')
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { name: true, email: true, institution: true, discipline: true, bio: true, orcid: true, website: true, image: true, role: true, titreProfil: true, telephone: true, villeProfil: true, pays: true, linkedin: true, langues: true, expertises: true, emailVerified: true } })
  if (!user) redirect('/auth/connexion')
  return <div className="max-w-6xl mx-auto px-4 py-10">
    <span className="eyebrow">Dossier professionnel</span><h1 className="font-display text-3xl font-bold text-nihary-ambre-fonce mb-2">Mon profil</h1><p className="mb-7 text-sm text-nihary-gris">Ces informations alimentent vos publications, candidatures, profils experts et le CRM scientifique.</p>
    <ProfileForm profile={user} />
  </div>
}
