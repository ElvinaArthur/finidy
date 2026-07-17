import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { disciplineValue, languageValue, pageValue } from '@/lib/api-validation'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const disciplineParam = searchParams.get('discipline')
    const langueParam = searchParams.get('langue')
    const discipline = disciplineParam ? disciplineValue(disciplineParam) : null
    const langue = langueParam ? languageValue(langueParam) : null
    if ((disciplineParam && !discipline) || (langueParam && !langue)) return NextResponse.json({ error: 'Filtre invalide' }, { status: 400 })
    const page = pageValue(searchParams.get('page'))
    const limit = 12
    const where: any = { statut: 'PUBLIE' }
    if (discipline) where.discipline = discipline
    if (langue) where.langue = langue
    const [articles, total] = await Promise.all([
      prisma.articleRevue.findMany({
        where,
        include: { auteur: { select: { name: true, institution: true } } },
        orderBy: { createdAt: 'desc' },
        take: limit, skip: (page - 1) * limit,
      }),
      prisma.articleRevue.count({ where }),
    ])
    return NextResponse.json({ articles, total, page, pages: Math.ceil(total / limit) })
  } catch (error) {
    console.error('GET /api/revue', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
