import { config } from 'dotenv'
config({ path: '.env.local' }); config({ path: '.env' })
import bcrypt from 'bcryptjs'

async function main() {
  const { prisma } = await import('../lib/prisma')
  await prisma.user.upsert({
    where: { email: 'test@nihary.mg' },
    update: {
      password: await bcrypt.hash('DemoFinidy2026!', 12),
      role: 'AUTEUR',
      emailVerified: new Date(),
      suspended: false,
    },
    create: {
      email: 'test@nihary.mg',
      name: 'Compte Démo FINIDY',
      password: await bcrypt.hash('DemoFinidy2026!', 12),
      role: 'AUTEUR',
      emailVerified: new Date(),
      institution: 'FINIDY Research Center',
    },
  })
  await prisma.$disconnect()
  console.log('Compte démo Auteur configuré')
}

main().catch((error) => { console.error(error); process.exit(1) })
