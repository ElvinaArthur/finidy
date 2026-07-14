/**
 * Seed principal — FINIDY Research Center
 * Lance tous les seeds dans l'ordre. Chaque module est indépendant.
 *
 * Usage :
 *   npm run db:seed
 *
 * Comptes créés :
 *   Admin    → admin@nihary.mg        / NiharyAdmin2024!
 *   Test     → test@nihary.mg         / TestNihary2024!
 *   Auteurs  → *@*                    / Nihary2024!
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import { seedUsers } from "./seeds/00-users";
import { seedRevue } from "./seeds/01-revue";
import { seedConsultance } from "./seeds/02-consultance";
import { seedMagazine } from "./seeds/03-magazine";
import { seedEntretiens } from "./seeds/04-entretiens";
import { seedEditions } from "./seeds/05-editions";
import { seedColloques } from "./seeds/06-colloques";
import { seedUniversitePopulaire } from "./seeds/07-universite-populaire";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("╔══════════════════════════════════════════╗");
  console.log("║   🌱  FINIDY Research Center — Database Seed   ║");
  console.log("╚══════════════════════════════════════════╝\n");

  // 00 — Utilisateurs (retourne les IDs nécessaires aux autres seeds)
  const { admin, testUser, auteurs } = await seedUsers();

  // Map email → id pour tous les auteurs
  const auteurIds: Record<string, string> = {
    "admin@nihary.mg": admin.id,
    "test@nihary.mg": testUser.id,
  };
  for (const [email, user] of Object.entries(auteurs)) {
    auteurIds[email] = (user as any).id;
  }

  // 01 — Revue scientifique
  await seedRevue(auteurIds);

  // 02 — Consultance
  await seedConsultance(auteurIds);

  // 03 — Magazine
  await seedMagazine(auteurIds);

  // 04 — Entretiens
  await seedEntretiens(auteurIds);

  // 05 — Édition
  await seedEditions(auteurIds);

  // 06 — Colloques
  await seedColloques();

  // 07 — Université Populaire
  await seedUniversitePopulaire(auteurIds, testUser.id);

  console.log("\n╔══════════════════════════════════════════╗");
  console.log("║        ✅  Seed terminé avec succès !    ║");
  console.log("╚══════════════════════════════════════════╝");
  console.log("\n📋 Comptes de test :");
  console.log("   Admin  → admin@nihary.mg      | NiharyAdmin2024!");
  console.log("   Test   → test@nihary.mg       | TestNihary2024!");
  console.log("   Auteur → jean.rakoto@...      | Nihary2024!");
  console.log("\n🚀 Lancez le serveur : npm run dev\n");
}

main()
  .catch((e) => {
    console.error("\n❌ Erreur pendant le seed :", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
