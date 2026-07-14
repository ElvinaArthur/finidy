import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const discipline = searchParams.get('discipline')
    const langue = searchParams.get('langue')
    const page = parseInt(searchParams.get('page') || '1')
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
  } catch {
    return NextResponse.json({ articles: [], total: 0, page: 1, pages: 0 })
  }
}
