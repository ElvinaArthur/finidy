import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [
      articlesRevue,
      articlesMagazine,
      entretiens,
      livres,
      colloques,
      cours,
      experts,
      utilisateurs,
    ] = await Promise.all([
      prisma.articleRevue.count({ where: { statut: 'PUBLIE' } }),
      prisma.article.count({ where: { statut: 'PUBLIE' } }),
      prisma.entretien.count({ where: { statut: 'PUBLIE' } }),
      prisma.livre.count({ where: { statut: 'PUBLIE' } }),
      prisma.colloque.count(),
      prisma.cours.count({ where: { statut: 'PUBLIE' } }),
      prisma.expertProfile.count({ where: { disponible: true } }),
      prisma.user.count(),
    ])

    return NextResponse.json({
      articlesRevue,
      articlesMagazine,
      entretiens,
      livres,
      colloques,
      cours,
      experts,
      utilisateurs,
    })
  } catch (error) {
    // Si la DB n'est pas encore connectée, retourner des zéros
    return NextResponse.json({
      articlesRevue: 0,
      articlesMagazine: 0,
      entretiens: 0,
      livres: 0,
      colloques: 0,
      cours: 0,
      experts: 0,
      utilisateurs: 0,
    })
  }
}
