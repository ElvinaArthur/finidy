import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { consumeAccountToken } from '@/lib/auth/account-tokens'
import { isEmail, isRecord } from '@/lib/api-validation'
import { prisma } from '@/lib/prisma'
import { audit } from '@/lib/security'

export async function POST(request: NextRequest) {
  const body: unknown = await request.json()
  if (!isRecord(body) || !isEmail(body.email) || typeof body.token !== 'string' || typeof body.password !== 'string' || body.password.length < 10 || body.password.length > 128) return NextResponse.json({ error: 'Lien ou mot de passe invalide' }, { status: 400 })
  const email = String(body.email).trim().toLowerCase()
  if (!await consumeAccountToken('reset', email, body.token)) return NextResponse.json({ error: 'Ce lien est invalide ou expiré' }, { status: 400 })
  const user = await prisma.user.update({ where: { email }, data: { password: await bcrypt.hash(body.password, 12) }, select: { id: true } }).catch(() => null)
  if (!user) return NextResponse.json({ error: 'Ce lien est invalide ou expiré' }, { status: 400 })
  await audit('PASSWORD_RESET', user.id, user.id)
  return NextResponse.json({ success: true })
}
