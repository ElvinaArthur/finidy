/**
 * Seed 00 — Utilisateurs
 * Crée l'admin, un testeur, et 6 auteurs fictifs avec des profils réalistes.
 */
import { prisma } from "./_client";
import bcrypt from "bcryptjs";

export async function seedUsers() {
  console.log("👤 Création des utilisateurs...");

  const hash = async (pw: string) => bcrypt.hash(pw, 12);

  // ── ADMIN ──────────────────────────────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: "admin@nihary.mg" },
    update: { emailVerified: new Date() },
    create: {
      email: "admin@nihary.mg",
      name: "Équipe FINIDY Research Center",
      password: await hash("NiharyAdmin2024!"),
      role: "ADMIN",
      emailVerified: new Date(),
      institution: "FINIDY Research Center — Plateforme SHS Madagascar",
      bio: "Équipe éditoriale et technique de la plateforme FINIDY Research Center.",
    },
  });

  // ── COMPTE TEST ────────────────────────────────────────────────────────────
  const testUser = await prisma.user.upsert({
    where: { email: "test@nihary.mg" },
    update: { emailVerified: new Date() },
    create: {
      email: "test@nihary.mg",
      name: "Compte Test",
      password: await hash("TestNihary2024!"),
      role: "AUTEUR",
      emailVerified: new Date(),
      institution: "Université d'Antananarivo",
      bio: "Compte de démonstration pour tester la plateforme FINIDY Research Center.",
      discipline: "SOCIOLOGIE",
    },
  });

  // ── AUTEURS FICTIFS ────────────────────────────────────────────────────────
  const auteurs = [
    {
      email: "jean.rakoto@univ-tana.mg",
      name: "Jean-Louis Rakotomalala",
      role: "AUTEUR" as const,
      institution: "Université d'Antananarivo — Département de Sociologie",
      discipline: "SOCIOLOGIE",
      image: "/uploads/avatars/jean-rakotomalala.jpg",
      bio: "Maître de conférences en sociologie du travail. Ses recherches portent sur les mutations du marché de l'emploi à Madagascar et dans la sous-région océan indien.",
    },
    {
      email: "hanta.razafy@ihm.mg",
      name: "Hanta Razafy",
      role: "AUTEUR" as const,
      institution: "Institut des Humanités de Madagascar",
      discipline: "HISTOIRE",
      image: "/uploads/avatars/hanta-razafy.jpg",
      bio: "Historienne spécialisée dans l'histoire coloniale et postcoloniale de Madagascar. Auteure de travaux sur les archives de la période Merina.",
    },
    {
      email: "fidy.andriantsoa@ird.mg",
      name: "Fidy Andriantsoa",
      role: "EXPERT" as const,
      institution: "IRD Madagascar — Institut de Recherche pour le Développement",
      discipline: "ECONOMIE",
      image: "/uploads/avatars/fidy-andriantsoa.jpg",
      bio: "Économiste du développement. Consultant senior pour plusieurs organisations internationales sur les questions de croissance inclusive et de pauvreté rurale à Madagascar.",
    },
    {
      email: "voahirana.rakotondrabe@cnre.mg",
      name: "Voahirana Rakotondrabe",
      role: "AUTEUR" as const,
      institution: "Centre National de Recherche sur l'Environnement — Madagascar",
      discipline: "ANTHROPOLOGIE",
      image: "/uploads/avatars/voahirana-rakotondrabe.jpg",
      bio: "Anthropologue de l'environnement. Travaux sur les représentations locales de la nature, les pratiques foncières traditionnelles (dina) et la cohabitation homme-forêt.",
    },
    {
      email: "eric.ramaroson@sciencespo-mg.mg",
      name: "Éric Ramaroson",
      role: "FORMATEUR" as const,
      institution: "École de Gouvernance de Madagascar",
      discipline: "SCIENCE_POLITIQUE",
      image: "/uploads/avatars/eric-ramaroson.jpg",
      bio: "Politologue. Enseigne les institutions politiques africaines et la théorie des transitions démocratiques. Formateur à l'Université Populaire FINIDY Research Center.",
    },
    {
      email: "celestine.ramanantsoa@ulm.mg",
      name: "Célestine Ramanantsoa",
      role: "AUTEUR" as const,
      institution: "Université de Libre de Madagascar",
      discipline: "SCIENCES_EDUCATION",
      image: "/uploads/avatars/celestine-ramanantsoa.jpg",
      bio: "Didacticienne et chercheuse en sciences de l'éducation. Travaille sur la question de l'éducation bilingue malgache-français et les méthodes d'apprentissage actif.",
    },
  ];

  const createdAuteurs: Record<string, any> = {};
  for (const a of auteurs) {
    const user = await prisma.user.upsert({
      where: { email: a.email },
      update: { image: a.image, emailVerified: new Date() },
      create: { ...a, emailVerified: new Date(), password: await hash("Nihary2024!") },
    });
    createdAuteurs[a.email] = user;
  }

  console.log(`   ✅ Admin          : ${admin.email}`);
  console.log(`   ✅ Compte test    : ${testUser.email} / TestNihary2024!`);
  console.log(`   ✅ Auteurs fictifs : ${Object.keys(createdAuteurs).length}`);

  return { admin, testUser, auteurs: createdAuteurs };
}
