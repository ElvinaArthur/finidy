/**
 * Seed 04 — Entretiens (Pilier 4)
 * 8 entretiens publiés : PODCAST, VIDEO, TEXTE
 *
 * Note sur les liens YouTube : les mediaUrl VIDEO pointent vers des vidéos
 * publiques existantes sur YouTube traitant de SHS. À remplacer par les URLs
 * de votre chaîne YouTube officielle en production.
 */
import { prisma, slugify } from "./_client";

export async function seedEntretiens(auteurIds: Record<string, string>) {
  console.log("🎙️  Création des entretiens...");

  // adminId sert d'auteur technique pour les entretiens dont l'invité est externe
  const adminId = auteurIds["admin@nihary.mg"];

  const entretiens = [
    // ── PODCASTS ──────────────────────────────────────────────────────────────
    {
      titre: "Travail informel et résilience urbaine à Madagascar — avec Jean-Louis Rakotomalala",
      slug: "travail-informel-resilience-urbaine-rakotomalala",
      description: "Le sociologue Jean-Louis Rakotomalala revient sur ses deux années d'enquête au cœur de l'économie informelle d'Antananarivo. Il nous parle des stratégies de survie des travailleurs de rue, de la pandémie de Covid-19 et de ce que ces trajectoires nous disent des inégalités malgaches.",
      format: "PODCAST",
      // Podcast audio : pas de lien vidéo YouTube, on simule un fichier audio hébergé
      mediaUrl: "https://www.youtube.com/watch?v=hQinJO64ahk",
      transcription: `FINIDY :Jean-Louis Rakotomalala, vous avez passé deux ans à suivre des travailleurs informels à Antananarivo. Qu'est-ce qui vous a le plus surpris ?

Jean-Louis Rakotomalala : Ce qui m'a frappé d'emblée, c'est l'extraordinaire degré d'organisation de ces travailleurs qu'on qualifie trop vite d'"informels". Il y a des règles, des territoires, des hiérarchies, des solidarités. L'informel est en réalité très structuré — juste différemment de l'économie formelle.

FINIDY :Et la question de la précarité ?

Jean-Louis Rakotomalala : Elle est réelle, évidemment. Un porteur qui se blesse n'a aucun filet de sécurité. Mais j'ai aussi observé une résilience remarquable. Ces personnes ont développé des compétences entrepreneuriales que beaucoup d'entreprises formelles leur envieraient.`,
      dureeMinutes: 42,
      imageUrl: "/uploads/entretiens/podcast-rakotomalala.jpg",
      discipline: "SOCIOLOGIE",
      statut: "PUBLIE",
      vues: 634,
      auteurEmail: "jean.rakoto@univ-tana.mg",
      publishedAt: new Date("2024-10-10"),
    },
    {
      titre: "Mémoire coloniale et réconciliation — avec Hanta Razafy",
      slug: "memoire-coloniale-reconciliation-razafy",
      description: "Peut-on écrire une histoire commune entre la France et Madagascar ? L'historienne Hanta Razafy explore les conditions d'un travail mémoriel honnête, entre archives coloniales biaisées et mémoires orales vivantes.",
      format: "PODCAST",
      mediaUrl: "https://www.youtube.com/watch?v=6Z57DUHjjoY",
      transcription: `FINIDY :Comment aborde-t-on les archives coloniales sans reproduire le regard colonial ?

Hanta Razafy : C'est la question centrale de mon travail. Les archives coloniales sont des documents de domination — elles ont été produites par des administrateurs qui avaient un agenda politique. Les lire naïvement, c'est risquer de reconduire ce regard. Il faut les déconstruire, les croiser avec les sources orales, les confronter à la mémoire populaire.`,
      dureeMinutes: 38,
      imageUrl: "/uploads/entretiens/podcast-razafy.jpg",
      discipline: "HISTOIRE",
      statut: "PUBLIE",
      vues: 412,
      auteurEmail: "hanta.razafy@ihm.mg",
      publishedAt: new Date("2024-11-02"),
    },
    {
      titre: "Anthropologie du foncier — avec Voahirana Rakotondrabe",
      slug: "anthropologie-foncier-rakotondrabe",
      description: "Terre, identité et conflit : comment les communautés rurales malgaches vivent-elles les réformes foncières ? Voahirana Rakotondrabe partage 18 mois d'observation participante dans le Menabe.",
      format: "PODCAST",
      mediaUrl: "https://www.youtube.com/watch?v=XScxY4D6jV4",
      transcription: `FINIDY :Le dina est souvent présenté comme un droit coutumier menacé par la modernisation. Vous avez une lecture différente ?

Voahirana Rakotondrabe : Oui. Le dina n'est pas un vestige du passé — c'est un système vivant qui s'adapte. Ce que j'ai observé dans le Menabe, c'est que les communautés utilisent le dina pour négocier avec les acteurs extérieurs — État, ONG, projets miniers. C'est une ressource stratégique, pas une survivance.`,
      dureeMinutes: 51,
      imageUrl: "/uploads/entretiens/podcast-rakotondrabe.jpg",
      discipline: "ANTHROPOLOGIE",
      statut: "PUBLIE",
      vues: 289,
      auteurEmail: "voahirana.rakotondrabe@cnre.mg",
      publishedAt: new Date("2024-12-05"),
    },

    // ── VIDEOS ────────────────────────────────────────────────────────────────
    {
      titre: "Introduction à la sociologie : concepts fondamentaux",
      slug: "introduction-sociologie-concepts-fondamentaux",
      description: "Leçon inaugurale filmée de Jean-Louis Rakotomalala à l'Université d'Antananarivo. En 45 minutes, une introduction claire aux concepts centraux de la sociologie : fait social, habitus, champ, capital. Accessible à tous.",
      format: "VIDEO",
      // Vidéo YouTube : "Introduction aux Sciences Humaines et Sociales en STAPS"
      // https://www.youtube.com/watch?v=nYEFussXqG0
      mediaUrl: "https://www.youtube.com/watch?v=ofqNQ9Au_Ds",
      transcription: null,
      dureeMinutes: 47,
      imageUrl: "/uploads/entretiens/video-intro-sociologie.jpg",
      discipline: "SOCIOLOGIE",
      statut: "PUBLIE",
      vues: 1847,
      auteurEmail: "jean.rakoto@univ-tana.mg",
      publishedAt: new Date("2024-09-20"),
    },
    {
      titre: "La démocratie en Afrique : entre importation et appropriation",
      slug: "democratie-afrique-importation-appropriation",
      description: "Conférence filmée d'Éric Ramaroson à l'École de Gouvernance de Madagascar. Il analyse les trajectoires des transitions démocratiques africaines depuis 1990 et les conditions d'une démocratie authentiquement africaine.",
      format: "VIDEO",
      // Vidéo YouTube : "Conférence économie africaine 2023 — grandes tendances macroéconomiques" (AFD)
      // https://www.youtube.com/watch?v=n-4Ne5xvs1M
      mediaUrl: "https://www.youtube.com/watch?v=SXPIqQC1jiI",
      transcription: null,
      dureeMinutes: 63,
      imageUrl: "/uploads/entretiens/video-democratie-afrique.jpg",
      discipline: "SCIENCE_POLITIQUE",
      statut: "PUBLIE",
      vues: 923,
      auteurEmail: "eric.ramaroson@sciencespo-mg.mg",
      publishedAt: new Date("2024-10-28"),
    },
    {
      titre: "Économie malgache : quel modèle de développement ?",
      slug: "economie-malgache-quel-modele-developpement",
      description: "Table ronde filmée réunissant des économistes et des acteurs du développement sur les modèles de croissance applicables à Madagascar. Quelles leçons tirer des success stories africaines comme le Rwanda ou le Botswana ?",
      format: "VIDEO",
      // Vidéo YouTube : "L'économie africaine 2023 vue par l'AFD" (Agence Française de Développement)
      // https://www.youtube.com/watch?v=gzPnfyeDP7o
      mediaUrl: "https://www.youtube.com/watch?v=MwGRCEBDBSM",
      transcription: null,
      dureeMinutes: 89,
      imageUrl: "/uploads/entretiens/video-economie-malgache.jpg",
      discipline: "ECONOMIE",
      statut: "PUBLIE",
      vues: 671,
      auteurEmail: "fidy.andriantsoa@ird.mg",
      publishedAt: new Date("2025-01-15"),
    },

    // ── TEXTES ────────────────────────────────────────────────────────────────
    {
      titre: "\"L'éducation est le seul ascenseur social qui fonctionne encore\" — entretien avec Célestine Ramanantsoa",
      slug: "entretien-celestine-ramanantsoa-education-ascenseur-social",
      description: "Rencontre avec Célestine Ramanantsoa, chercheuse en sciences de l'éducation. Elle revient sur les inégalités scolaires à Madagascar, le rôle des cours particuliers et la question de la langue d'enseignement.",
      format: "TEXTE",
      mediaUrl: null,
      transcription: `**FINIDY :** Vous affirmez que l'éducation est le seul ascenseur social qui fonctionne encore à Madagascar. Mais les inégalités scolaires ne reproduisent-elles pas les inégalités sociales ?

**Célestine Ramanantsoa :** C'est la tension fondamentale du système éducatif partout dans le monde — et à Madagascar de façon particulièrement aiguë. L'école est simultanément un vecteur de mobilité sociale et un mécanisme de reproduction des inégalités. Ce qu'elle permet à certains, elle le bloque pour d'autres.

Mais si je dis que c'est le seul ascenseur qui fonctionne, c'est parce que les autres ont tous des pannes majeures. La mobilité par le mariage est de moins en moins efficace. La mobilité par l'entrepreneuriat est réservée à ceux qui ont un capital de départ. Reste l'école.

**FINIDY :** Pourtant, un diplôme ne garantit plus l'emploi.

**Célestine Ramanantsoa :** C'est vrai, et c'est une source d'angoisse réelle pour les familles qui investissent massivement dans l'éducation de leurs enfants. Mais statistiquement, à Madagascar, un bachelier gagne encore significativement plus qu'un non-bachelier. Et un diplômé du supérieur a des chances d'insertion formelle bien supérieures. Le signal reste valide, même s'il s'est affaibli.

**FINIDY :** La langue d'enseignement est un sujet très politique à Madagascar. Votre position ?

**Célestine Ramanantsoa :** Je crois que le débat franco-malgache est un faux débat. La vraie question est : quelle est la meilleure façon d'apprendre ? Les recherches en didactique sont claires : les enfants apprennent mieux quand ils commencent dans leur langue maternelle. Un enfant malgachophone à qui on enseigne les mathématiques en français doit d'abord traduire mentalement la question avant de pouvoir la résoudre. C'est un effort cognitif supplémentaire qui pénalise les plus fragiles.`,
      dureeMinutes: null,
      imageUrl: "/uploads/entretiens/texte-ramanantsoa-education.jpg",
      discipline: "SCIENCES_EDUCATION",
      statut: "PUBLIE",
      vues: 503,
      auteurEmail: "celestine.ramanantsoa@ulm.mg",
      publishedAt: new Date("2025-02-03"),
    },
    {
      titre: "\"La forêt malgache n'a pas de prix, mais elle a une valeur\" — entretien avec Voahirana Rakotondrabe",
      slug: "entretien-rakotondrabe-foret-malgache-valeur",
      description: "L'anthropologue Voahirana Rakotondrabe questionne les approches économiques de la biodiversité. Peut-on mettre un prix sur une forêt ? Et si oui, qui en profite ?",
      format: "TEXTE",
      mediaUrl: null,
      transcription: `**FINIDY :** Les partisans des paiements pour services environnementaux (PSE) affirment que mettre un prix sur la forêt est le seul moyen de la protéger. Vous n'êtes pas convaincue.

**Voahirana Rakotondrabe :** Je suis convaincue que l'intention est bonne, mais je m'interroge sur les effets réels sur le terrain. Quand vous dites aux communautés forestières "votre forêt vaut tant de dollars en crédits carbone", vous transformez une relation culturelle et spirituelle complexe en transaction commerciale. Et en général, ce sont des intermédiaires qui captent la valeur, pas les communautés elles-mêmes.

**FINIDY :** Mais sans incitation économique, comment protéger la forêt ?

**Voahirana Rakotondrabe :** La protection de la forêt a fonctionné pendant des siècles avant que les économistes n'inventent les PSE. Elle fonctionnait parce que les communautés avaient des droits sur leurs ressources et des intérêts directs à les gérer durablement. Le dina était un mécanisme de gouvernance forestière très efficace. Le problème n'est pas l'absence d'incitations économiques — c'est la destruction des droits coutumiers par les politiques coloniales et postcoloniales.`,
      dureeMinutes: null,
      imageUrl: "/uploads/entretiens/texte-rakotondrabe-foret.jpg",
      discipline: "ANTHROPOLOGIE",
      statut: "PUBLIE",
      vues: 378,
      auteurEmail: "voahirana.rakotondrabe@cnre.mg",
      publishedAt: new Date("2025-02-20"),
    },
  ];

  let count = 0;
  for (const e of entretiens) {
    const auteurId = auteurIds[e.auteurEmail];
    if (!auteurId) continue;
    await prisma.entretien.upsert({
      where: { slug: e.slug },
      update: {
        mediaUrl: e.mediaUrl,
        imageUrl: e.imageUrl,
        dureeMinutes: e.dureeMinutes,
      },
      create: {
        titre: e.titre,
        slug: e.slug,
        description: e.description,
        format: e.format as any,
        mediaUrl: e.mediaUrl,
        transcription: e.transcription,
        dureeMinutes: e.dureeMinutes,
        imageUrl: e.imageUrl,
        discipline: e.discipline as any,
        statut: e.statut as any,
        vues: e.vues,
        auteurId,
        publishedAt: e.publishedAt,
      },
    });
    count++;
  }

  console.log(`   ✅ Entretiens créés : ${count} (${entretiens.filter(e => e.format === "PODCAST").length} podcasts · ${entretiens.filter(e => e.format === "VIDEO").length} vidéos · ${entretiens.filter(e => e.format === "TEXTE").length} textes)`);
}
