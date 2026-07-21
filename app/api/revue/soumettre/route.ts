import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth/config'
import { hasCompleteProfile, incompleteProfileResponse } from '@/lib/auth/profile-completeness'
import { missingEvidenceResponse, submissionEvidence } from '@/lib/submission-evidence'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Connexion requise' }, { status: 401 })
    }
    if (!await hasCompleteProfile(session.user.id)) return NextResponse.json(incompleteProfileResponse, { status: 403 })
    const body = await req.json()
    const evidence = submissionEvidence(body)
    if (!evidence) return NextResponse.json(missingEvidenceResponse, { status: 400 })
    const { titre, resume, motsClés, discipline, langue, accesLibre } = body
    if (!titre || !resume || !discipline) {
      return NextResponse.json({ error: 'Titre, résumé et discipline sont requis' }, { status: 400 })
    }
    const article = await prisma.articleRevue.create({
      data: {
        titre, resume, motsClés: motsClés || [], discipline,
        langue: langue || 'FR', accesLibre: accesLibre || false,
        statut: 'EN_ATTENTE', auteurId: session.user.id,
        fichierUrl: evidence.contentUrl, submissionMeta: evidence,
      },
    })
    return NextResponse.json({ success: true, id: article.id })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
