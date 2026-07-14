import { config } from 'dotenv'
import { defineConfig, env } from 'prisma/config'

// Next.js utilise .env.local pour le dev local — on le charge en priorité,
// puis on retombe sur .env si .env.local n'existe pas.
config({ path: '.env.local' })
config({ path: '.env' })

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
})
