/**
 * Seed 06 — Colloques (Pilier 6)
 * 3 colloques : 1 ouvert (appel en cours), 1 à venir, 1 archivé avec actes.
 */
import { prisma, slugify } from "./_client";

export async function seedColloques() {
  console.log("🎓 Création des colloques...");

  // ── COLLOQUE 1 : OUVERT — appel à communications en cours ─────────────────
  const c1 = await prisma.colloque.upsert({
    where: { slug: "shs-ocean-indien-2025" },
    update: {},
    create: {
      titre: "5e Colloque International SHS Océan Indien — Sociétés en transition",
      slug: "shs-ocean-indien-2025",
      description: `Ce colloque international, organisé par la plateforme FINIDY Research Center en partenariat avec l'Université d'Antananarivo, l'Université de La Réunion et l'Université des Comores, réunit des chercheurs en Sciences Humaines et Sociales de l'Océan Indien autour de la thématique « Sociétés en transition ».

**Thématiques principales**

— Transitions politiques et démocratiques dans l'Océan Indien
— Transformations économiques : informalité, tourisme, économie numérique
— Transitions environnementales : adaptation au changement climatique, déforestation, gestion des ressources
— Recompositions identitaires et culturelles : langue, genre, religion, diaspora
— Éducation et formation dans les contextes insulaires et côtiers

**Format**

Le colloque se tient sur trois jours (séances plénières + ateliers thématiques). Les communications peuvent être présentées en français, malgache ou anglais.

**Publication**

Les communications sélectionnées feront l'objet d'une publication dans un numéro spécial de la Revue FINIDY Research Center (processus de révision par les pairs).`,
      lieu: "Université d'Antananarivo — Amphi central",
      dateDebut: new Date("2025-10-15"),
      dateFin: new Date("2025-10-17"),
      dateLimit: new Date("2025-07-31"),
      statut: "OUVERT",
      imageUrl: "/uploads/colloques/colloque-shs-ocean-indien-2025.jpg",
      programmeUrl: null,
      actesUrl: null,
      discipline: ["SOCIOLOGIE", "ANTHROPOLOGIE", "HISTOIRE", "SCIENCE_POLITIQUE", "ECONOMIE", "ETUDES_GENRE"],
    },
  });

  // Sessions du colloque 1
  await prisma.session_.createMany({
    data: [
      {
        colloqueId: c1.id,
        titre: "Séance plénière d'ouverture — Penser les transitions en SHS",
        horaire: new Date("2025-10-15T09:00:00"),
        lieu: "Amphi central",
        animateur: "Équipe FINIDY",
      },
      {
        colloqueId: c1.id,
        titre: "Atelier A — Transitions politiques dans l'Océan Indien",
        horaire: new Date("2025-10-15T14:00:00"),
        lieu: "Salle A-12",
        animateur: "Éric Ramaroson",
      },
      {
        colloqueId: c1.id,
        titre: "Atelier B — Environnement, foncier et communautés",
        horaire: new Date("2025-10-15T14:00:00"),
        lieu: "Salle A-15",
        animateur: "Voahirana Rakotondrabe",
      },
      {
        colloqueId: c1.id,
        titre: "Atelier C — Genre, travail et mobilités sociales",
        horaire: new Date("2025-10-16T09:00:00"),
        lieu: "Salle B-08",
        animateur: "Hanta Razafy",
      },
      {
        colloqueId: c1.id,
        titre: "Table ronde de clôture — Perspectives de recherche SHS dans l'Océan Indien",
        horaire: new Date("2025-10-17T15:00:00"),
        lieu: "Amphi central",
        animateur: "Équipe FINIDY",
      },
    ],
    skipDuplicates: true,
  });

  // ── COLLOQUE 2 : À VENIR ───────────────────────────────────────────────────
  const c2 = await prisma.colloque.upsert({
    where: { slug: "colloque-education-bilingue-oi-2026" },
    update: {},
    create: {
      titre: "Colloque International — Éducation bilingue et plurilingue dans l'Océan Indien",
      slug: "colloque-education-bilingue-oi-2026",
      description: `Organisé en partenariat avec l'Agence Universitaire de la Francophonie et l'Université des Mascareignes, ce colloque rassemble des didacticiens, linguistes et acteurs de l'éducation pour explorer les enjeux du bilinguisme scolaire dans les contextes insulaires de l'Océan Indien.

**Axes thématiques**

— Politique linguistique et choix de la langue d'instruction
— Didactique du français langue seconde en milieu malgachophone
— Plurilinguisme et construction identitaire chez les jeunes apprenants
— Innovations pédagogiques et apprentissage des langues
— Évaluation des acquis dans les systèmes bilingues

L'appel à communications sera ouvert en septembre 2025.`,
      lieu: "Université des Mascareignes — Île Maurice",
      dateDebut: new Date("2026-03-10"),
      dateFin: new Date("2026-03-12"),
      dateLimit: new Date("2025-11-30"),
      statut: "A_VENIR",
      imageUrl: "/uploads/colloques/colloque-education-bilingue-2026.jpg",
      programmeUrl: null,
      actesUrl: null,
      discipline: ["LINGUISTIQUE", "SCIENCES_EDUCATION", "COMMUNICATION"],
    },
  });

  // ── COLLOQUE 3 : ARCHIVÉ — avec actes disponibles ─────────────────────────
  const c3 = await prisma.colloque.upsert({
    where: { slug: "shs-ocean-indien-2024" },
    update: {},
    create: {
      titre: "4e Colloque International SHS Océan Indien — Inégalités et développement",
      slug: "shs-ocean-indien-2024",
      description: `La 4e édition du Colloque International SHS Océan Indien s'est tenue à Antananarivo en octobre 2024 sur le thème « Inégalités et développement ». Elle a réuni 87 chercheurs venus de Madagascar, La Réunion, Mayotte, Maurice, Comores et d'Europe.

Les communications ont porté sur les inégalités sociales, économiques et de genre dans la région, les politiques publiques de redistribution, les dynamiques migratoires et les formes de résistance et d'innovation sociale face aux inégalités structurelles.

Les actes complets sont disponibles en téléchargement libre.`,
      lieu: "Campus de l'Université d'Antananarivo",
      dateDebut: new Date("2024-10-16"),
      dateFin: new Date("2024-10-18"),
      dateLimit: null,
      statut: "ARCHIVE",
      imageUrl: "/uploads/colloques/colloque-shs-ocean-indien-2024.jpg",
      programmeUrl: "/uploads/colloques/programme-shs-oi-2024.pdf",
      actesUrl: "/uploads/colloques/actes-shs-oi-2024.pdf",
      discipline: ["SOCIOLOGIE", "ECONOMIE", "ETUDES_GENRE", "SCIENCE_POLITIQUE", "ANTHROPOLOGIE"],
    },
  });

  // Communications acceptées du colloque archivé
  await prisma.communication.createMany({
    data: [
      {
        colloqueId: c3.id,
        titre: "Inégalités de revenus et mobilité sociale intergénérationnelle à Antananarivo",
        auteurs: "Jean-Louis Rakotomalala (Univ. d'Antananarivo)",
        resume: "Communication analysant les trajectoires de mobilité sociale à Antananarivo sur trois générations, à partir d'une enquête biographique auprès de 150 familles.",
        statut: "ACCEPTE",
      },
      {
        colloqueId: c3.id,
        titre: "Genre et accès au crédit dans les zones rurales de Madagascar",
        auteurs: "Hanta Razafy (IHM), Fidy Andriantsoa (IRD)",
        resume: "Analyse des obstacles formels et informels à l'accès des femmes rurales au crédit bancaire et aux dispositifs de microfinance à Madagascar.",
        statut: "ACCEPTE",
      },
      {
        colloqueId: c3.id,
        titre: "Migrations climat et inégalités dans le sud de Madagascar",
        auteurs: "Voahirana Rakotondrabe (CNRE)",
        resume: "Étude des dynamiques migratoires liées à la sécheresse dans la région du Grand Sud malgache et leurs effets sur les inégalités entre zones d'émigration et d'immigration.",
        statut: "ACCEPTE",
      },
      {
        colloqueId: c3.id,
        titre: "Inégalités scolaires et stratégies familiales à Fianarantsoa",
        auteurs: "Célestine Ramanantsoa (ULM)",
        resume: "Analyse comparative des stratégies éducatives des ménages selon leur niveau socio-économique dans la deuxième ville de Madagascar.",
        statut: "ACCEPTE",
      },
      {
        colloqueId: c3.id,
        titre: "Clientélisme et inégalités de représentation politique à Madagascar",
        auteurs: "Éric Ramaroson (École de Gouvernance)",
        resume: "Comment les pratiques clientélistes structurent l'accès au pouvoir politique et reproduisent les inégalités de représentation dans le système partisan malgache.",
        statut: "ACCEPTE",
      },
    ],
    skipDuplicates: true,
  });

  console.log(`   ✅ Colloques créés : 3 (1 ouvert · 1 à venir · 1 archivé avec actes)`);
}
