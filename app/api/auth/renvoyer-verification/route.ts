import { NextRequest, NextResponse } from 'next/server'
import { isEmail, isRecord } from '@/lib/api-validation'
import { prisma } from '@/lib/prisma'
import { sendVerificationEmail } from '@/lib/email'
import { rateLimit, requestFingerprint } from '@/lib/security'

export async function POST(request: NextRequest) {
  const limited = await rateLimit('auth.verify.resend', requestFingerprint(request), 3, 60 * 60)
  if (!limited.allowed) return NextResponse.json({ error: 'Trop de demandes' }, { status: 429 })
  const body: unknown = await request.json()
  if (!isRecord(body) || !isEmail(body.email)) return NextResponse.json({ error: 'Adresse invalide' }, { status: 400 })
  const email = String(body.email).trim().toLowerCase()
  const user = await prisma.user.findUnique({ where: { email }, select: { emailVerified: true } })
  if (user && !user.emailVerified) await sendVerificationEmail(email)
  return NextResponse.json({ success: true })
}
