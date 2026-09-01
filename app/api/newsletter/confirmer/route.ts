import { NextResponse } from 'next/server'
import { consumeAccountToken } from '@/lib/auth/account-tokens'
import { prisma } from '@/lib/prisma'
import { SITE_URL } from '@/lib/site'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')?.trim().toLowerCase()
  const token = searchParams.get('token')
  if (!email || !token || !(await consumeAccountToken('newsletter', email, token))) {
    return NextResponse.redirect(`${SITE_URL}/?newsletter=invalide`)
  }

  await prisma.newsletterSubscriber.updateMany({
    where: { email },
    data: { confirmedAt: new Date() },
  })
  return NextResponse.redirect(`${SITE_URL}/?newsletter=confirmee`)
}
