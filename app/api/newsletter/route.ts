import { NextResponse } from 'next/server'
import { isEmail, isRecord } from '@/lib/api-validation'
import { sendNewsletterConfirmation } from '@/lib/email'
import { prisma } from '@/lib/prisma'
import { rateLimit, requestFingerprint } from '@/lib/security'

export async function POST(request: Request) {
  const limited = await rateLimit('newsletter.subscribe', requestFingerprint(request), 5, 60 * 60)
  if (limited) return NextResponse.json({ error: 'Trop de tentatives. Réessayez plus tard.' }, { status: 429 })

  try {
    const body: unknown = await request.json()
    if (!isRecord(body) || !isEmail(body.email) || body.consent !== true) {
      return NextResponse.json({ error: 'Adresse e-mail ou consentement invalide.' }, { status: 400 })
    }

    const email = body.email.trim().toLowerCase()
    const source = body.source === 'footer' ? 'footer' : 'popup'
    const subscriber = await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { consentAt: new Date(), source },
      create: { email, consentAt: new Date(), source },
    })

    if (!subscriber.confirmedAt) await sendNewsletterConfirmation(email)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('POST newsletter', error)
    return NextResponse.json({ error: "L'inscription est momentanément indisponible." }, { status: 503 })
  }
}
