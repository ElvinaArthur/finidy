import { NextRequest, NextResponse } from 'next/server'
import { consumeAccountToken } from '@/lib/auth/account-tokens'
import { prisma } from '@/lib/prisma'
import { SITE_URL } from '@/lib/site'
import { audit } from '@/lib/security'

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email')?.trim().toLowerCase() || ''
  const token = request.nextUrl.searchParams.get('token') || ''
  if (!email || !token || !await consumeAccountToken('verify', email, token)) return NextResponse.redirect(`${SITE_URL}/auth/connexion?verification=invalid`)
  const user = await prisma.user.update({ where: { email }, data: { emailVerified: new Date() }, select: { id: true } }).catch(() => null)
  if (!user) return NextResponse.redirect(`${SITE_URL}/auth/connexion?verification=invalid`)
  await audit('EMAIL_VERIFIED', user.id, user.id)
  return NextResponse.redirect(`${SITE_URL}/auth/connexion?verification=success`)
}
