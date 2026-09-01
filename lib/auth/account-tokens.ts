import { createHash, randomBytes } from 'crypto'
import { prisma } from '@/lib/prisma'

export type AccountTokenKind = 'verify' | 'reset' | 'newsletter'
const digest = (token: string) => createHash('sha256').update(token).digest('hex')

export async function issueAccountToken(kind: AccountTokenKind, email: string, lifetimeMinutes: number) {
  const identifier = `${kind}:${email.toLowerCase()}`
  const token = randomBytes(32).toString('base64url')
  await prisma.verificationToken.deleteMany({ where: { identifier } })
  await prisma.verificationToken.create({ data: { identifier, token: digest(token), expires: new Date(Date.now() + lifetimeMinutes * 60_000) } })
  return token
}

export async function consumeAccountToken(kind: AccountTokenKind, email: string, token: string) {
  const identifier = `${kind}:${email.toLowerCase()}`
  const stored = await prisma.verificationToken.findUnique({ where: { identifier_token: { identifier, token: digest(token) } } })
  if (!stored || stored.expires <= new Date()) { await prisma.verificationToken.deleteMany({ where: { identifier } }); return false }
  await prisma.verificationToken.delete({ where: { token: stored.token } })
  return true
}
