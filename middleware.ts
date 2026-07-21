import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Les PDF des articles restent sur disque dans public/uploads pour alimenter
 * les seeds, mais ne sont servis au navigateur que par /api/pdf en inline.
 */
export function middleware(_request: NextRequest) {
  return new NextResponse('Document accessible uniquement depuis le lecteur', {
    status: 404,
    headers: { 'X-Robots-Tag': 'noindex, nofollow' },
  })
}

export const config = {
  matcher: '/uploads/articles-pdf/:path*',
}
