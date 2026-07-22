import { createHash } from 'crypto'
import { prisma } from '@/lib/prisma'

function hash(value: string) {
  const salt = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'finidy-local-development'
  return createHash('sha256').update(`${salt}:${value}`).digest('hex')
}

export function requestFingerprint(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const ip = forwarded || request.headers.get('x-real-ip') || 'unknown'
  return hash(`${ip}:${request.headers.get('user-agent') || 'unknown'}`)
}

export async function rateLimit(action: string, rawKey: string, limit: number, windowSeconds: number) {
  const keyHash = /^[a-f0-9]{64}$/.test(rawKey) ? rawKey : hash(rawKey)
  const cutoff = new Date(Date.now() - windowSeconds * 1000)
  const [, count] = await prisma.$transaction([
    prisma.securityEvent.deleteMany({ where: { action, keyHash, createdAt: { lt: cutoff } } }),
    prisma.securityEvent.count({ where: { action, keyHash, createdAt: { gte: cutoff } } }),
  ])
  if (count >= limit) return { allowed: false, retryAfter: windowSeconds }
  await prisma.securityEvent.create({ data: { action, keyHash } })
  return { allowed: true, retryAfter: 0 }
}

export async function audit(action: string, actorId?: string | null, target?: string | null, metadata?: Record<string, string | number | boolean | null>) {
  await prisma.auditLog.create({ data: { action, actorId: actorId || null, target: target || null, metadata: metadata || undefined } })
}
