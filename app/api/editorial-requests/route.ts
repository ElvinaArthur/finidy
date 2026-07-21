import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { prisma } from '@/lib/prisma'
import { cleanString, isRecord } from '@/lib/api-validation'

async function ownedContent(type: string, id: string, userId: string) {
  if (type === 'revue') return prisma.articleRevue.findFirst({ where: { id, auteurId: userId }, select: { id: true, titre: true } })
  if (type === 'magazine') return prisma.article.findFirst({ where: { id, auteurId: userId }, select: { id: true, titre: true } })
  if (type === 'entretien') return prisma.entretien.findFirst({ where: { id, auteurId: userId }, select: { id: true, titre: true } })
  if (type === 'livre') return prisma.livre.findFirst({ where: { id, auteurId: userId }, select: { id: true, titre: true } })
  if (type === 'cours') return prisma.cours.findFirst({ where: { id, formateurId: userId }, select: { id: true, titre: true } })
  return null
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Connexion requise' }, { status: 401 })
  try {
    const body: unknown = await req.json()
    if (!isRecord(body)) return NextResponse.json({ error: 'Requête invalide' }, { status: 400 })
    const contentType = cleanString(body.contentType, 30)
    const contentId = cleanString(body.contentId, 100)
    const message = cleanString(body.message, 3000)
    const kind = body.kind === 'RETRAIT' ? 'RETRAIT' : body.kind === 'QUESTION' ? 'QUESTION' : null
    if (!contentType || !contentId || !message || !kind) return NextResponse.json({ error: 'Demande incomplète' }, { status: 400 })
    const content = await ownedContent(contentType, contentId, session.user.id)
    if (!content) return NextResponse.json({ error: 'Contenu introuvable' }, { status: 404 })
    const existing = await prisma.editorialRequest.findFirst({ where: { userId: session.user.id, contentType, contentId, kind, statut: 'EN_ATTENTE' } })
    if (existing) return NextResponse.json({ error: 'Une demande similaire est déjà en attente' }, { status: 409 })
    const request = await prisma.editorialRequest.create({ data: { userId: session.user.id, contentType, contentId, contentTitle: content.titre, kind, message } })
    return NextResponse.json({ success: true, id: request.id }, { status: 201 })
  } catch (error) {
    console.error('POST /api/editorial-requests', error)
    return NextResponse.json({ error: 'Demande impossible' }, { status: 500 })
  }
}
