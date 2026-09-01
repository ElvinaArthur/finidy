import { config } from 'dotenv'
config({ path: '.env.local' })
config({ path: '.env' })
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL est absente')
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) })
  try {
    await prisma.$queryRaw`SELECT 1`
    const rights = await prisma.$queryRaw<Array<{ insert_ok: boolean; update_ok: boolean; delete_ok: boolean }>>`
      SELECT
        has_table_privilege(current_user, '"User"', 'INSERT') AS insert_ok,
        has_table_privilege(current_user, '"User"', 'UPDATE') AS update_ok,
        has_table_privilege(current_user, '"User"', 'DELETE') AS delete_ok
    `
    if (!rights[0]?.insert_ok || !rights[0]?.update_ok || !rights[0]?.delete_ok) throw new Error('La connexion PostgreSQL est en lecture seule ou ne possède pas les droits d’écriture sur User')
    console.log('Base PostgreSQL accessible en lecture et écriture')
  }
  finally { await prisma.$disconnect() }
}
main().catch((error) => { console.error('Échec du contrôle de la base:', error instanceof Error ? error.message : error); process.exit(1) })
