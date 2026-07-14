import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

// Sert un PDF en mode lecture seule (inline, pas attachment)
// Seuls les PDFs dans public/uploads/articles-pdf/ sont autorisés
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params

  // Sécurité : interdire tout path traversal (../ etc.)
  const joined = slug.join('/')
  if (joined.includes('..') || joined.includes('//')) {
    return new NextResponse('Accès refusé', { status: 403 })
  }

  // Seul le dossier articles-pdf est servi via cette route
  if (!joined.startsWith('articles-pdf/')) {
    return new NextResponse('Accès refusé', { status: 403 })
  }

  const filePath = path.join(process.cwd(), 'public', 'uploads', joined)

  if (!fs.existsSync(filePath) || !filePath.endsWith('.pdf')) {
    return new NextResponse('Document introuvable', { status: 404 })
  }

  const buffer = fs.readFileSync(filePath)

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
