/**
 * Seed 05 — Édition (Pilier 5)
 * 7 ouvrages publiés couvrant les grandes disciplines SHS.
 */
import { prisma, slugify } from "./_client";

export async function seedEditions(auteurIds: Record<string, string>) {
  console.log("📚 Création des ouvrages (Édition)...");

  const livres = [
    {
      titre: "Sociologie du travail à Madagascar : précarité, informalité et résistances",
      slug: "sociologie-travail-madagascar-precarite-informalite-resistances",
      description: `Cet ouvrage constitue la première synthèse francophone consacrée à la sociologie du travail dans le contexte malgache. À partir d'enquêtes de terrain menées sur plus de cinq ans dans les marchés, usines franches et quartiers populaires d'Antananarivo, Jean-Louis Rakotomalala cartographie les transformations du monde du travail à Madagascar depuis l'indépendance.

L'ouvrage s'articule autour de trois grandes parties. La première analyse les structures de l'économie informelle et ses logiques internes. La deuxième examine les zones franches industrielles et leur impact sur les conditions de travail et les relations de genre. La troisième explore les formes de résistance collective — syndicats, associations de quartier, solidarités informelles — qui constituent autant de réponses à la précarité structurelle.

Un livre essentiel pour comprendre les dynamiques sociales et économiques de Madagascar contemporain.`,
      isbn: "978-2-9999-0001-4",
      couvertureUrl: "/uploads/couvertures/livre-sociologie-travail-mada.jpg",
      extraitUrl: "/uploads/extraits/extrait-sociologie-travail.pdf",
      lienAchat: null,
      collection: "Sciences de la société — FINIDY Éditions",
      discipline: "SOCIOLOGIE",
      annee: 2024,
      pages: 312,
      statut: "PUBLIE",
      auteurEmail: "jean.rakoto@univ-tana.mg",
    },
    {
      titre: "Les Menalamba : insurrection, mémoire et identité à Madagascar (1895-1920)",
      slug: "menalamba-insurrection-memoire-identite-madagascar",
      description: `La résistance Menalamba (littéralement : « ceux aux haillons rouges ») contre la colonisation française est l'un des épisodes les plus dramatiques et les moins connus de l'histoire malgache. Cet ouvrage, fruit de dix années de recherches dans les archives françaises et malgaches, propose la première histoire complète de ce mouvement.

Hanta Razafy montre comment les Menalamba n'étaient pas les «  sauvages » décrits par les colonisateurs, mais les porteurs d'un projet politique cohérent fondé sur la défense de la royauté merina et des valeurs ancestrales. Elle analyse également la construction mémorielle de cet épisode : comment il a été effacé, réinterprété, et comment il reste un enjeu d'identité nationale aujourd'hui.

Un travail d'histoire totale, entre politique, culture et mémoire.`,
      isbn: "978-2-9999-0002-1",
      couvertureUrl: "/uploads/couvertures/livre-menalamba-histoire.jpg",
      extraitUrl: "/uploads/extraits/extrait-menalamba.pdf",
      lienAchat: null,
      collection: "Histoire de l'Océan Indien — FINIDY Éditions",
      discipline: "HISTOIRE",
      annee: 2024,
      pages: 428,
      statut: "PUBLIE",
      auteurEmail: "hanta.razafy@ihm.mg",
    },
    {
      titre: "Capabilités et développement à Madagascar : repenser la pauvreté",
      slug: "capabilites-developpement-madagascar-repenser-pauvrete",
      description: `Comment mesure-t-on vraiment la pauvreté ? Cet ouvrage applique pour la première fois l'approche par les capabilités d'Amartya Sen à l'économie malgache, avec des données empiriques inédites issues d'un panel longitudinal de 1 200 ménages ruraux et urbains.

Fidy Andriantsoa montre que les indicateurs monétaires classiques (revenu par habitant, seuil de pauvreté) masquent des réalités très différentes selon les régions et les groupes sociaux. Des zones classées pauvres selon le revenu présentent des libertés substantielles élevées — accès aux ressources naturelles, autonomie alimentaire, liens sociaux forts — tandis que certains ménages urbains à revenus moyens vivent dans des formes de dénuement non monétaire sévères.

Un plaidoyer rigoureux pour une politique de développement centrée sur les êtres humains.`,
      isbn: "978-2-9999-0003-8",
      couvertureUrl: "/uploads/couvertures/livre-capabilites-developpement.jpg",
      extraitUrl: null,
      lienAchat: null,
      collection: "Économie et société — FINIDY Éditions",
      discipline: "ECONOMIE",
      annee: 2025,
      pages: 286,
      statut: "PUBLIE",
      auteurEmail: "fidy.andriantsoa@ird.mg",
    },
    {
      titre: "Dina : gouvernance communautaire et gestion des ressources naturelles à Madagascar",
      slug: "dina-gouvernance-communautaire-ressources-naturelles-madagascar",
      description: `Le dina — contrat social malgache de régulation communautaire — est l'une des institutions les plus originales et les moins étudiées de l'Afrique subsaharienne. Cet ouvrage propose la première analyse anthropologique systématique de son rôle dans la gouvernance des ressources naturelles.

À partir d'une enquête de terrain de 18 mois dans le Menabe, Voahirana Rakotondrabe montre comment le dina structure les droits fonciers, régule l'accès à la forêt et arbitre les conflits entre communautés. Elle analyse également ses transformations contemporaines face aux pressions des projets de conservation internationaux et des réformes juridiques nationales.

Une contribution essentielle à l'anthropologie du droit et à l'écologie politique africaine.`,
      isbn: "978-2-9999-0004-5",
      couvertureUrl: "/uploads/couvertures/livre-dina-gouvernance.jpg",
      extraitUrl: "/uploads/extraits/extrait-dina.pdf",
      lienAchat: null,
      collection: "Anthropologie — FINIDY Éditions",
      discipline: "ANTHROPOLOGIE",
      annee: 2025,
      pages: 354,
      statut: "PUBLIE",
      auteurEmail: "voahirana.rakotondrabe@cnre.mg",
    },
    {
      titre: "Madagascar politique : transitions, crises et consolidation démocratique (1990-2025)",
      slug: "madagascar-politique-transitions-crises-democratique",
      description: `De la Conférence nationale souveraine de 1993 aux élections de 2023, Madagascar a traversé plusieurs cycles de démocratisation et de ruptures constitutionnelles. Cet ouvrage propose la première synthèse politologique de trente-cinq ans de vie politique malgache.

Éric Ramaroson analyse les mécanismes qui ont conduit aux crises successives (1991, 2002, 2009, 2018), les facteurs explicatifs de la récurrence des ruptures institutionnelles, et les conditions d'une stabilisation durable. Il montre que le problème central de Madagascar n'est pas l'absence de démocratie formelle — les élections ont toujours lieu — mais la faiblesse des institutions et la permanence des logiques clientélistes.

Un manuel indispensable pour comprendre la politique malgache.`,
      isbn: "978-2-9999-0005-2",
      couvertureUrl: "/uploads/couvertures/livre-madagascar-politique.jpg",
      extraitUrl: null,
      lienAchat: null,
      collection: "Sciences politiques — FINIDY Éditions",
      discipline: "SCIENCE_POLITIQUE",
      annee: 2025,
      pages: 398,
      statut: "PUBLIE",
      auteurEmail: "eric.ramaroson@sciencespo-mg.mg",
    },
    {
      titre: "Apprendre en malgache : didactique du bilinguisme à l'école primaire",
      slug: "apprendre-malgache-didactique-bilinguisme-ecole-primaire",
      description: `Dans un pays où la langue d'enseignement fait l'objet de débats politiques permanents, cet ouvrage apporte une réponse scientifique : quels sont les effets réels du choix de la langue d'instruction sur les apprentissages des élèves malgaches ?

À partir d'une vaste étude comparative menée dans 40 écoles primaires de six régions, Célestine Ramanantsoa montre que les élèves instruits initialement en malgache acquièrent de meilleures bases en lecture, mathématiques et compréhension — et ce avantage se maintient quand on leur enseigne le français comme langue seconde à partir du CE2.

Un ouvrage qui devrait changer les pratiques éducatives à Madagascar.`,
      isbn: "978-2-9999-0006-9",
      couvertureUrl: "/uploads/couvertures/livre-apprendre-malgache.jpg",
      extraitUrl: "/uploads/extraits/extrait-apprendre-malgache.pdf",
      lienAchat: null,
      collection: "Sciences de l'éducation — FINIDY Éditions",
      discipline: "SCIENCES_EDUCATION",
      annee: 2025,
      pages: 244,
      statut: "PUBLIE",
      auteurEmail: "celestine.ramanantsoa@ulm.mg",
    },
    {
      titre: "Femmes et pouvoir à Madagascar : trajectoires historiques et enjeux contemporains",
      slug: "femmes-pouvoir-madagascar-trajectoires-historiques",
      description: `Des reines Merina aux militantes contemporaines, cet ouvrage retrace deux siècles de rapport entre les femmes et le pouvoir à Madagascar. Entre figure de la reine toute-puissante et réalité des inégalités quotidiennes, comment se construit la place des femmes dans l'espace politique et social malgache ?

Hanta Razafy croise archives historiques, traditions orales et enquêtes contemporaines pour produire une histoire longue de la condition féminine à Madagascar. Elle montre que les inégalités actuelles ne sont pas des données immuables de la culture malgache, mais le produit de constructions historiques — coloniales et postcoloniales — qu'il est possible de déconstruire.`,
      isbn: "978-2-9999-0007-6",
      couvertureUrl: "/uploads/couvertures/livre-femmes-pouvoir-mada.jpg",
      extraitUrl: null,
      lienAchat: null,
      collection: "Études de genre — FINIDY Éditions",
      discipline: "ETUDES_GENRE",
      annee: 2025,
      pages: 318,
      statut: "PUBLIE",
      auteurEmail: "hanta.razafy@ihm.mg",
    },
  ];

  let count = 0;
  for (const l of livres) {
    await prisma.livre.upsert({
      where: { slug: l.slug },
      update: {},
      create: {
        titre: l.titre,
        slug: l.slug,
        description: l.description,
        isbn: l.isbn,
        couvertureUrl: l.couvertureUrl,
        extraitUrl: l.extraitUrl,
        lienAchat: l.lienAchat,
        collection: l.collection,
        discipline: l.discipline as any,
        annee: l.annee,
        pages: l.pages,
        statut: l.statut as any,
        auteurId: auteurIds[l.auteurEmail],
      },
    });
    count++;
  }

  console.log(`   ✅ Ouvrages créés : ${count}`);
}
