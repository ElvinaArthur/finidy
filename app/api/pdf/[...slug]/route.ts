import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const PDF_DIRECTORY = path.join(process.cwd(), 'public', 'uploads', 'articles-pdf')

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug: parts } = await params
  if (parts.length !== 1 || !parts[0].toLowerCase().endsWith('.pdf')) {
    return new NextResponse('Document introuvable', { status: 404 })
  }

  const filename = path.basename(parts[0])
  if (filename !== parts[0]) {
    return new NextResponse('Document introuvable', { status: 404 })
  }

  const fichierUrl = `/uploads/articles-pdf/${filename}`
  const article = await prisma.articleRevue.findFirst({
    where: { fichierUrl, statut: 'PUBLIE' },
    select: { id: true },
  })
  if (!article) {
    return new NextResponse('Document introuvable', { status: 404 })
  }

  try {
    const pdf = await readFile(path.join(PDF_DIRECTORY, filename))
    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename.replace(/["\\]/g, '')}"`,
        'Cache-Control': 'private, no-store, max-age=0',
        'X-Content-Type-Options': 'nosniff',
        'X-Robots-Tag': 'noindex, nofollow, noarchive',
        'Content-Security-Policy': "default-src 'none'; frame-ancestors 'self'",
      },
    })
  } catch {
    return new NextResponse('Document introuvable', { status: 404 })
  }
}
