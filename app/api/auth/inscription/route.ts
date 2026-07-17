import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { cleanString, isEmail, isRecord } from '@/lib/api-validation'

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json()
    if (!isRecord(body)) return NextResponse.json({ error: 'Requête invalide' }, { status: 400 })
    const name = cleanString(body.name, 120)
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const password = typeof body.password === 'string' ? body.password : ''
    const institution = body.institution ? cleanString(body.institution, 200) : null
    if (!name || !isEmail(email) || password.length < 8 || password.length > 128) {
      return NextResponse.json({ error: 'Nom, email valide et mot de passe de 8 à 128 caractères requis' }, { status: 400 })
    }
    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) {
      return NextResponse.json({ error: 'Cet email est déjà utilisé' }, { status: 409 })
    }
    const hashed = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: { name, email, password: hashed, institution, role: 'AUTEUR' },
    })
    return NextResponse.json({ success: true, id: user.id }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
