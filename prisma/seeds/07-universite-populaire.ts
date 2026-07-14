/**
 * Seed 07 — Université Populaire (Pilier 7)
 * 4 cours publiés avec chapitres détaillés + inscriptions fictives.
 */
import { prisma } from "./_client";

export async function seedUniversitePopulaire(
  auteurIds: Record<string, string>,
  testUserId: string,
) {
  console.log("🎓 Création des cours (Université Populaire)...");

  const cours = [
    {
      titre: "Introduction à la sociologie pour non-spécialistes",
      slug: "introduction-sociologie-non-specialistes",
      description: `Ce cours s'adresse à toute personne curieuse qui souhaite comprendre la société dans laquelle elle vit sans nécessairement avoir de formation académique préalable.

En huit chapitres progressifs, vous découvrirez les concepts fondamentaux de la sociologie (fait social, habitus, champ, capital, structure et agency), les grandes théories sociologiques (Durkheim, Weber, Marx, Bourdieu, Goffman) et les méthodes de la sociologie empirique.

Des exemples tirés du contexte malgache et de l'Océan Indien illustrent chaque notion pour ancrer la réflexion dans notre réalité quotidienne.

**Ce que vous apprendrez :**
— Comprendre ce qu'est un fait social et pourquoi la société n'est pas la somme des individus
— Identifier les mécanismes de reproduction sociale et d'inégalités
— Lire et analyser un texte sociologique
— Appliquer des concepts sociologiques à des situations de la vie quotidienne`,
      imageUrl: "/uploads/cours/cours-intro-sociologie.jpg",
      niveau: "DEBUTANT",
      discipline: "SOCIOLOGIE",
      dureeHeures: 12,
      gratuit: true,
      statut: "PUBLIE",
      formateurEmail: "jean.rakoto@univ-tana.mg",
      chapitres: [
        { titre: "Qu'est-ce que la sociologie ? Naissance d'une science de la société", ordre: 1, dureeMin: 45, videoUrl: "https://www.youtube.com/embed/nDCNVsTkDiA", contenu: "La sociologie est née au XIXe siècle avec Auguste Comte, qui a inventé le terme. Mais c'est Émile Durkheim qui lui a donné ses fondements scientifiques. Dans ce premier chapitre, nous explorons les questions que pose la sociologie et pourquoi elles sont différentes de celles de la psychologie ou de l'économie." },
        { titre: "Le fait social selon Durkheim : quand la société s'impose à l'individu", ordre: 2, dureeMin: 38, videoUrl: null, contenu: "Un fait social est une manière de faire, de penser ou de sentir qui est extérieure à l'individu et qui s'impose à lui. C'est la définition fondatrice de Durkheim. Nous l'illustrons avec des exemples concrets : pourquoi mange-t-on avec des couverts ? Pourquoi porte-t-on le deuil ? Pourquoi se marie-t-on ?" },
        { titre: "Weber et le sens de l'action sociale : comprendre sans expliquer", ordre: 3, dureeMin: 42, videoUrl: null, contenu: "Max Weber propose une sociologie compréhensive : il ne s'agit pas seulement d'expliquer les comportements par des causes, mais de comprendre le sens que les acteurs y donnent. Ce chapitre présente les types d'action sociale (traditionnelle, affective, en valeur, rationnelle) et le concept d'idéal-type." },
        { titre: "Bourdieu : champ, habitus, capital", ordre: 4, dureeMin: 55, videoUrl: "https://www.youtube.com/embed/nDCNVsTkDiA", contenu: "Pierre Bourdieu est le sociologue français le plus influent du XXe siècle. Ses concepts de champ (espace social structuré), d'habitus (dispositions incorporées) et de capital (économique, culturel, social, symbolique) constituent une théorie cohérente de la reproduction sociale. Ce chapitre en propose une introduction accessible." },
        { titre: "Méthodes qualitatives : l'entretien et l'observation", ordre: 5, dureeMin: 40, videoUrl: null, contenu: "Comment les sociologues recueillent-ils leurs données ? Ce chapitre présente les deux grandes méthodes qualitatives : l'entretien semi-directif et l'observation participante. Avec des exemples tirés de recherches conduites à Madagascar." },
        { titre: "Méthodes quantitatives : le questionnaire et les statistiques sociales", ordre: 6, dureeMin: 35, videoUrl: null, contenu: "Le questionnaire permet de toucher des populations larges et de quantifier des phénomènes. Ce chapitre présente les bases de la construction d'un questionnaire sociologique et de l'interprétation des données statistiques." },
        { titre: "Sociologie à Madagascar : enjeux et traditions de recherche", ordre: 7, dureeMin: 48, videoUrl: null, contenu: "La sociologie malgache a ses propres traditions et ses propres objets. Ce chapitre présente les grands thèmes de la recherche sociologique à Madagascar et dans l'Océan Indien : travail, famille, religion, politique, identité." },
        { titre: "Travail final : analyser un phénomène social de votre quotidien", ordre: 8, dureeMin: 30, videoUrl: null, contenu: "Pour ce dernier chapitre, nous vous proposons un exercice pratique : choisir un phénomène social de votre quotidien (une pratique alimentaire, une coutume, une inégalité observée) et l'analyser avec les outils conceptuels vus dans le cours." },
      ],
    },
    {
      titre: "Histoire de Madagascar : des origines à l'indépendance",
      slug: "histoire-madagascar-origines-independance",
      description: `De l'arrivée des premiers habitants (ve-xe siècle) à l'indépendance de 1960, ce cours retrace l'histoire longue de Madagascar à travers ses grandes périodes : le peuplement austronésien et bantou, la formation des royaumes, l'unification merina, la colonisation française et la résistance malgache.

Ce cours est conçu pour le grand public mais s'appuie sur les dernières recherches en histoire, anthropologie et archéologie. Il corrige de nombreux mythes et idées reçues sur l'histoire malgache.

**Ce que vous apprendrez :**
— Comprendre les origines du peuplement de Madagascar (Austronésiens, Bantous)
— Connaître les grandes dynasties et royaumes malgaches
— Analyser la colonisation française et ses effets durables
— Saisir les conditions de l'indépendance et ses premiers pas`,
      imageUrl: "/uploads/cours/cours-histoire-madagascar.jpg",
      niveau: "DEBUTANT",
      discipline: "HISTOIRE",
      dureeHeures: 10,
      gratuit: true,
      statut: "PUBLIE",
      formateurEmail: "hanta.razafy@ihm.mg",
      chapitres: [
        { titre: "Le peuplement de Madagascar : une île, deux mondes", ordre: 1, dureeMin: 50, videoUrl: null, contenu: "Madagascar est peuplée depuis environ 1 500 ans, par des migrants venus d'Asie du Sud-Est (Austronésiens, ancêtres des Malgaches actuels) et d'Afrique de l'Est (Bantous). Ce double héritage explique la singularité de la culture malgache." },
        { titre: "Les royaumes malgaches (XVe-XVIIIe siècles)", ordre: 2, dureeMin: 45, videoUrl: null, contenu: "Avant l'unification merina, Madagascar était divisée en de nombreux royaumes indépendants : Merina, Sakalava, Betsimisaraka, Betsileo... Chacun avait ses institutions, sa culture, ses alliances." },
        { titre: "L'unification merina et la reine Ranavalona", ordre: 3, dureeMin: 48, videoUrl: null, contenu: "Au XIXe siècle, les souverains merina unifient progressivement Madagascar. La reine Ranavalona Ire (1828-1861) est l'une des figures les plus controversées de cette période : nationaliste pour les uns, cruelle pour les autres." },
        { titre: "La colonisation française (1896-1960)", ordre: 4, dureeMin: 55, videoUrl: null, contenu: "Madagascar est conquise par la France en 1895-1896. La colonisation française transforme profondément la société malgache : économie de plantation, travail forcé, politique d'assimilation culturelle." },
        { titre: "Les résistances : Menalamba, VVS, insurrection de 1947", ordre: 5, dureeMin: 52, videoUrl: null, contenu: "La résistance à la colonisation prend plusieurs formes : insurrection armée (Menalamba, 1895-1897), mouvement nationaliste clandestin (VVS, années 1910), et l'insurrection de mars 1947, réprimée dans un bain de sang." },
        { titre: "L'indépendance de 1960 : espoirs et limites", ordre: 6, dureeMin: 40, videoUrl: null, contenu: "Le 26 juin 1960, Madagascar proclame son indépendance sous la présidence de Philibert Tsiranana. Mais cette indépendance est-elle complète ? Ce dernier chapitre analyse les continuités et ruptures avec la période coloniale." },
      ],
    },
    {
      titre: "Méthodes de recherche en sciences sociales : guide pratique",
      slug: "methodes-recherche-sciences-sociales-guide-pratique",
      description: `Ce cours pratique s'adresse aux étudiants en licence et master en SHS qui souhaitent renforcer leurs compétences méthodologiques, ainsi qu'aux praticiens (ONG, institutions publiques) qui conduisent des études de terrain.

Vous apprendrez à concevoir un protocole de recherche, à choisir vos méthodes (qualitatives/quantitatives/mixtes), à collecter des données de façon rigoureuse, à les analyser et à présenter vos résultats de façon convaincante.

**Prérequis :** Notions de base en SHS (L1 ou équivalent)`,
      imageUrl: "/uploads/cours/cours-methodes-recherche.jpg",
      niveau: "INTERMEDIAIRE",
      discipline: "SOCIOLOGIE",
      dureeHeures: 15,
      gratuit: true,
      statut: "PUBLIE",
      formateurEmail: "jean.rakoto@univ-tana.mg",
      chapitres: [
        { titre: "Construire une question de recherche : de l'intuition au problème scientifique", ordre: 1, dureeMin: 45, videoUrl: null, contenu: "La première étape de toute recherche est de formuler une question précise et pertinente. Ce chapitre présente les critères d'une bonne question de recherche et les pièges à éviter." },
        { titre: "Revue de littérature : cartographier l'état des savoirs", ordre: 2, dureeMin: 40, videoUrl: null, contenu: "Avant de commencer votre recherche, vous devez savoir ce qui a déjà été fait. Ce chapitre présente les outils et les méthodes pour construire une revue de littérature efficace." },
        { titre: "Méthodes qualitatives I : l'entretien semi-directif", ordre: 3, dureeMin: 55, videoUrl: null, contenu: "L'entretien est l'outil central de la recherche qualitative. Ce chapitre présente les différents types d'entretiens, comment construire un guide d'entretien et comment mener un entretien dans les meilleures conditions." },
        { titre: "Méthodes qualitatives II : observation et ethnographie", ordre: 4, dureeMin: 50, videoUrl: null, contenu: "L'observation participante est la méthode phare de l'anthropologie et de la sociologie urbaine. Ce chapitre présente ses avantages, ses limites et les questions éthiques qu'elle soulève." },
        { titre: "Méthodes quantitatives : construction et administration d'un questionnaire", ordre: 5, dureeMin: 48, videoUrl: null, contenu: "Le questionnaire permet de collecter des données auprès de grands échantillons. Ce chapitre présente les règles de construction d'un questionnaire, les techniques d'échantillonnage et les modes d'administration." },
        { titre: "Analyse qualitative : codage et interprétation", ordre: 6, dureeMin: 52, videoUrl: null, contenu: "Comment analyser des entretiens ou des notes d'observation ? Ce chapitre présente les méthodes de codage thématique et d'analyse de contenu." },
        { titre: "Analyse quantitative : statistiques descriptives et bivariées", ordre: 7, dureeMin: 45, videoUrl: null, contenu: "Introduction aux statistiques descriptives (fréquences, moyennes, écart-types) et aux analyses bivariées (tableaux croisés, corrélations) pour les chercheurs en SHS." },
        { titre: "Rédiger et présenter ses résultats : du rapport académique à la communication publique", ordre: 8, dureeMin: 38, videoUrl: null, contenu: "Comment présenter ses résultats selon différents formats : article académique, rapport d'étude, présentation orale, note de politique ? Ce dernier chapitre présente les codes de chaque genre." },
      ],
    },
    {
      titre: "Gouvernance et institutions politiques en Afrique",
      slug: "gouvernance-institutions-politiques-afrique",
      description: `Ce cours de niveau avancé s'adresse aux étudiants en master et doctorat en science politique, aux fonctionnaires, aux acteurs de la société civile et à toute personne souhaitant comprendre les dynamiques politiques africaines.

Nous analysons les trajectoires des États africains depuis les indépendances, les mécanismes de gouvernance formelle et informelle, les dynamiques démocratiques et autoritaires, et les défis contemporains : corruption, conflits, décentralisation, citoyenneté.

**Prérequis :** Niveau L3/M1 en droit, science politique ou équivalent`,
      imageUrl: "/uploads/cours/cours-gouvernance-afrique.jpg",
      niveau: "AVANCE",
      discipline: "SCIENCE_POLITIQUE",
      dureeHeures: 20,
      gratuit: true,
      statut: "PUBLIE",
      formateurEmail: "eric.ramaroson@sciencespo-mg.mg",
      chapitres: [
        { titre: "Les États africains post-coloniaux : construction, fragilité, résilience", ordre: 1, dureeMin: 60, videoUrl: null, contenu: "La construction des États africains après les indépendances (1960s) est un processus inachevé. Ce chapitre analyse les facteurs de fragilité étatique et les mécanismes de résilience que les États africains ont développés." },
        { titre: "Démocratie en Afrique : vagues, reculs et consolidation", ordre: 2, dureeMin: 58, videoUrl: null, contenu: "La troisième vague de démocratisation (années 1990) a transformé le paysage politique africain. Ce chapitre retrace les trajectoires de démocratisation et les facteurs qui expliquent les succès et les reculs." },
        { titre: "Gouvernance informelle : réseaux, clientélisme, néo-patrimonialisme", ordre: 3, dureeMin: 55, videoUrl: null, contenu: "Les institutions formelles ne racontent pas toute l'histoire du pouvoir en Afrique. Ce chapitre présente les concepts de néo-patrimonialisme, de clientélisme et de gouvernance par les réseaux." },
        { titre: "Décentralisation et gouvernance locale", ordre: 4, dureeMin: 50, videoUrl: null, contenu: "La décentralisation est présentée comme une solution aux dysfonctionnements des États centraux. Ce chapitre évalue ses effets réels sur la gouvernance locale en Afrique." },
        { titre: "Corruption : définitions, mécanismes, lutte", ordre: 5, dureeMin: 52, videoUrl: null, contenu: "La corruption est omniprésente dans les débats sur la gouvernance africaine. Ce chapitre présente une analyse rigoureuse du phénomène : ses formes, ses causes structurelles et les politiques anti-corruption." },
        { titre: "Transitions politiques et médiation dans les crises", ordre: 6, dureeMin: 48, videoUrl: null, contenu: "Comment les crises politiques se résolvent-elles en Afrique ? Ce chapitre analyse les mécanismes de transition politique (dialogues nationaux, accords de paix) et le rôle des acteurs régionaux et internationaux." },
        { titre: "Cas d'étude : Madagascar — un laboratoire des transitions politiques", ordre: 7, dureeMin: 65, videoUrl: null, contenu: "Madagascar offre un cas d'étude fascinant : six crises constitutionnelles en soixante ans, des transitions répétées et une démocratie qui ne consolide pas. Ce chapitre analyse en détail les mécanismes politiques malgaches." },
        { titre: "Perspectives : citoyenneté, société civile et avenir de la gouvernance africaine", ordre: 8, dureeMin: 45, videoUrl: null, contenu: "Ce dernier chapitre ouvre sur les dynamiques nouvelles : la montée de la société civile, les mouvements citoyens, le rôle des diasporas et les promesses et limites de la technologie pour améliorer la gouvernance." },
      ],
    },
  ];

  let countCours = 0;
  let countChapitres = 0;

  for (const c of cours) {
    const formateurId = auteurIds[c.formateurEmail];
    if (!formateurId) continue;

    const coursRecord = await prisma.cours.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        titre: c.titre,
        slug: c.slug,
        description: c.description,
        imageUrl: c.imageUrl,
        niveau: c.niveau as any,
        discipline: c.discipline as any,
        dureeHeures: c.dureeHeures,
        gratuit: c.gratuit,
        statut: c.statut as any,
        formateurId,
      },
    });

    for (const ch of c.chapitres) {
      await prisma.chapitre.upsert({
        where: {
          id: `${coursRecord.id}-ch-${ch.ordre}`,
        },
        update: {},
        create: {
          id: `${coursRecord.id}-ch-${ch.ordre}`,
          coursId: coursRecord.id,
          titre: ch.titre,
          ordre: ch.ordre,
          videoUrl: ch.videoUrl,
          contenu: ch.contenu,
          dureeMin: ch.dureeMin,
        },
      });
      countChapitres++;
    }

    // Inscription fictive du compte test
    await prisma.inscription.upsert({
      where: { userId_coursId: { userId: testUserId, coursId: coursRecord.id } },
      update: {},
      create: { userId: testUserId, coursId: coursRecord.id },
    });

    countCours++;
  }

  console.log(`   ✅ Cours créés : ${countCours} (${countChapitres} chapitres)`);
  console.log(`   ✅ Inscriptions test : ${countCours}`);
}
