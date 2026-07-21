import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { auth } from '@/lib/auth/config'
import { prisma } from '@/lib/prisma'
import { cleanString, isRecord, stringArray } from '@/lib/api-validation'

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Connexion requise' }, { status: 401 })
  try {
    const body: unknown = await req.json()
    if (!isRecord(body)) return NextResponse.json({ error: 'Requête invalide' }, { status: 400 })
    const name = cleanString(body.name, 120)
    const titreProfil = cleanString(body.titreProfil, 160), institution = cleanString(body.institution, 200), discipline = cleanString(body.discipline, 100), bio = cleanString(body.bio, 3000), telephone = cleanString(body.telephone, 50), villeProfil = cleanString(body.villeProfil, 120), pays = cleanString(body.pays, 120), langues = stringArray(body.langues, 12, 60), expertises = stringArray(body.expertises, 20, 100)
    if (!name || !titreProfil || !institution || !discipline || !bio || bio.length < 80 || !telephone || !villeProfil || !pays || !langues?.length || !expertises?.length) return NextResponse.json({ error: 'Complétez tous les champs professionnels obligatoires' }, { status: 400 })
    const image = body.image ? cleanString(body.image, 500) : null
    const website = body.website ? cleanString(body.website, 500) : null
    const linkedin = body.linkedin ? cleanString(body.linkedin, 500) : null
    for (const value of [image, website, linkedin]) {
      if (value) { try { const url = new URL(value); if (url.protocol !== 'https:') throw new Error() } catch { return NextResponse.json({ error: 'Les URL doivent être valides et sécurisées (https)' }, { status: 400 }) } }
    }
    const password = typeof body.password === 'string' && body.password ? body.password : null
    if (password && (password.length < 8 || password.length > 128)) return NextResponse.json({ error: 'Le mot de passe doit contenir 8 à 128 caractères' }, { status: 400 })
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        institution, discipline, bio, titreProfil, telephone, villeProfil, pays, linkedin, langues, expertises,
        orcid: body.orcid ? cleanString(body.orcid, 30) : null,
        website, image,
        ...(password ? { password: await bcrypt.hash(password, 12) } : {}),
      },
      select: { name: true, institution: true, discipline: true, bio: true, orcid: true, website: true, image: true, titreProfil: true, telephone: true, villeProfil: true, pays: true, linkedin: true, langues: true, expertises: true },
    })
    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error('PATCH /api/profil', error)
    return NextResponse.json({ error: 'Mise à jour impossible' }, { status: 500 })
  }
}
