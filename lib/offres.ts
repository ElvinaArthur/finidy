export type OffreType = "EMPLOI" | "STAGE" | "BOURSE" | "CONTRAT_DOCTORAL" | "MISSION_TERRAIN";

export type Offre = {
  slug: string;
  titre: string;
  organisation: string;
  type: OffreType;
  domaine: string;
  lieu: string;
  mode: "Présentiel" | "Hybride" | "À distance";
  datePublication: string;
  dateLimite: string;
  image: string;
  resume: string;
  description: string;
  missions: string[];
  profil: string[];
  competences: string[];
  contrat: string;
  duree: string;
  tempsTravail: string;
  remuneration: string;
  niveauEtudes: string;
  experience: string;
  financement: string;
  debut: string;
  langues: string;
  avantages: string[];
  candidature: string[];
  contact: string;
};

export const OFFRE_TYPE_LABELS: Record<OffreType, string> = {
  EMPLOI: "Emploi",
  STAGE: "Stage",
  BOURSE: "Bourse",
  CONTRAT_DOCTORAL: "Contrat doctoral",
  MISSION_TERRAIN: "Mission terrain",
};

export const offres: Offre[] = [
  {
    slug: "assistant-recherche-politiques-publiques",
    titre: "Assistant·e de recherche — politiques publiques",
    organisation: "FINIDY Research Center",
    type: "EMPLOI",
    domaine: "Science politique",
    lieu: "Antananarivo, Madagascar",
    mode: "Hybride",
    datePublication: "2026-07-18",
    dateLimite: "2026-08-28",
    image: "/uploads/magazine/magazine-economie-informelle.jpg",
    resume: "Appui à une étude sur l’accès aux services publics : revue documentaire, collecte qualitative et synthèse des résultats.",
    description: "L’équipe recherche un profil junior rigoureux pour contribuer à toutes les étapes d’une étude appliquée. La personne travaillera avec les chercheurs, partenaires institutionnels et équipes terrain afin de produire des données documentées et directement exploitables.",
    missions: ["Réaliser une revue de littérature et une veille documentaire", "Préparer les guides d’entretien et outils de collecte", "Conduire et retranscrire des entretiens semi-directifs", "Participer au codage, à l’analyse et à la rédaction des livrables"],
    profil: ["Master en science politique, sociologie, économie ou discipline proche", "Excellentes capacités rédactionnelles", "Intérêt démontré pour les politiques publiques malgaches"],
    competences: ["Recherche qualitative", "Analyse documentaire", "Rédaction scientifique", "Organisation"],
    contrat: "CDD",
    duree: "6 mois, renouvelable",
    tempsTravail: "Temps plein",
    remuneration: "Selon profil et grille du projet",
    niveauEtudes: "Master 2",
    experience: "0 à 2 ans",
    financement: "Projet de recherche institutionnel",
    debut: "Septembre 2026",
    langues: "Français et malagasy requis; anglais apprécié",
    avantages: ["Encadrement méthodologique", "Télétravail partiel", "Accès aux ressources documentaires FINIDY"],
    candidature: ["CV de deux pages maximum", "Lettre de motivation", "Court exemple de travail écrit"],
    contact: "recrutement@finidy.mg",
  },
  {
    slug: "stage-analyse-donnees-education",
    titre: "Stage — analyse de données sur l’éducation",
    organisation: "Observatoire de l’éducation de Madagascar",
    type: "STAGE",
    domaine: "Sciences de l’éducation",
    lieu: "Antananarivo, Madagascar",
    mode: "Présentiel",
    datePublication: "2026-07-14",
    dateLimite: "2026-09-05",
    image: "/uploads/magazine/magazine-education-fracture.jpg",
    resume: "Stage professionnalisant consacré au nettoyage, à l’analyse et à la visualisation de données scolaires.",
    description: "Ce stage permet de rejoindre une petite équipe pluridisciplinaire étudiant les parcours scolaires et les inégalités territoriales. La personne retenue contribuera à fiabiliser les bases, documenter les traitements et préparer des visualisations accessibles.",
    missions: ["Nettoyer et documenter des jeux de données", "Produire des tableaux de bord descriptifs", "Vérifier la cohérence des indicateurs", "Contribuer à une note de synthèse"],
    profil: ["Étudiant·e en master d’économie, statistique ou sciences sociales", "Bonne maîtrise d’Excel ou d’un logiciel statistique", "Autonomie et attention aux détails"],
    competences: ["Excel", "Statistiques descriptives", "Data visualisation", "Éducation"],
    contrat: "Convention de stage",
    duree: "4 mois",
    tempsTravail: "Temps plein",
    remuneration: "Indemnité mensuelle prévue",
    niveauEtudes: "Master 1 ou Master 2",
    experience: "Première expérience appréciée, non obligatoire",
    financement: "N/A",
    debut: "Octobre 2026",
    langues: "Français requis; malagasy apprécié",
    avantages: ["Tutorat hebdomadaire", "Attestation et recommandation selon résultats", "Participation aux séminaires internes"],
    candidature: ["CV", "Lettre de motivation", "Relevé de notes récent"],
    contact: "stages@finidy.mg",
  },
  {
    slug: "enqueteurs-collecte-donnees-menabe",
    titre: "Enquêteur·rice·s — collecte de données ménages",
    organisation: "Consortium Territoires & Résilience",
    type: "MISSION_TERRAIN",
    domaine: "Développement territorial",
    lieu: "Région Menabe, Madagascar",
    mode: "Présentiel",
    datePublication: "2026-07-20",
    dateLimite: "2026-08-12",
    image: "/uploads/magazine/magazine-deforestation.jpg",
    resume: "Mission courte de collecte quantitative auprès de ménages ruraux, précédée d’une formation obligatoire.",
    description: "Dans le cadre d’une enquête sur les stratégies d’adaptation des ménages, le consortium constitue plusieurs équipes locales. Les enquêteurs administreront un questionnaire numérique, documenteront les incidents de collecte et respecteront strictement le protocole éthique.",
    missions: ["Participer à la formation et au test pilote", "Administrer les questionnaires sur tablette", "Effectuer les contrôles quotidiens de complétude", "Signaler les refus, incidents et écarts au protocole"],
    profil: ["Bac+2 minimum ou expérience terrain équivalente", "Disponibilité pendant toute la mission", "Bonne connaissance du contexte local"],
    competences: ["Collecte mobile", "Enquête ménages", "Communication", "Éthique de la recherche"],
    contrat: "Contrat de prestation",
    duree: "24 jours, formation incluse",
    tempsTravail: "Temps plein pendant la mission",
    remuneration: "Forfait journalier + per diem",
    niveauEtudes: "Bac+2 minimum",
    experience: "Une mission de collecte souhaitée",
    financement: "Programme Résilience 2026",
    debut: "7 septembre 2026",
    langues: "Malagasy requis; français fonctionnel",
    avantages: ["Transport terrain pris en charge", "Hébergement selon affectation", "Certification de mission"],
    candidature: ["CV d’une page", "Liste de deux références", "Indication des communes connues"],
    contact: "terrain@finidy.mg",
  },
  {
    slug: "contrat-doctoral-gouvernance-fonciere",
    titre: "Contrat doctoral — gouvernance foncière et communs",
    organisation: "Université d’Antananarivo · École doctorale SHS",
    type: "CONTRAT_DOCTORAL",
    domaine: "Anthropologie",
    lieu: "Antananarivo et terrains régionaux",
    mode: "Hybride",
    datePublication: "2026-07-08",
    dateLimite: "2026-09-30",
    image: "/uploads/entretiens/podcast-rakotondrabe.jpg",
    resume: "Financement doctoral de trois ans sur les transformations des droits fonciers et les formes locales de gouvernance.",
    description: "Le projet doctoral documentera les arrangements institutionnels, pratiques locales et conflits liés à l’accès au foncier. Une démarche qualitative et comparative est attendue, articulant enquête ethnographique, archives et dialogue avec les acteurs publics.",
    missions: ["Élaborer et conduire le protocole doctoral", "Réaliser des terrains ethnographiques prolongés", "Présenter les résultats dans les séminaires du laboratoire", "Publier au moins un article scientifique"],
    profil: ["Master recherche en anthropologie, sociologie ou géographie", "Projet doctoral cohérent avec l’axe proposé", "Aptitude au travail de terrain de longue durée"],
    competences: ["Ethnographie", "Foncier", "Analyse institutionnelle", "Écriture académique"],
    contrat: "Contrat doctoral",
    duree: "36 mois",
    tempsTravail: "Temps plein",
    remuneration: "Allocation doctorale selon convention",
    niveauEtudes: "Master recherche",
    experience: "Expérience de mémoire ou terrain requise",
    financement: "Programme doctoral Gouvernance des communs",
    debut: "Janvier 2027",
    langues: "Français et malagasy; anglais scientifique souhaité",
    avantages: ["Encadrement en cotutelle", "Budget de terrain", "Soutien à la mobilité scientifique"],
    candidature: ["CV académique", "Projet de thèse de 5 pages", "Mémoire ou publication", "Deux lettres de recommandation"],
    contact: "doctorat@finidy.mg",
  },
  {
    slug: "bourse-master-mobilite-ocean-indien",
    titre: "Bourse de mobilité Master — Océan Indien",
    organisation: "Fondation Savoirs Insulaires",
    type: "BOURSE",
    domaine: "Sciences humaines et sociales",
    lieu: "Océan Indien",
    mode: "Présentiel",
    datePublication: "2026-07-02",
    dateLimite: "2026-10-15",
    image: "/uploads/colloques/colloque-shs-ocean-indien-2025.jpg",
    resume: "Soutien à une mobilité de recherche de deux à quatre mois pour les étudiant·e·s préparant un mémoire en SHS.",
    description: "Cette bourse finance une mobilité nécessaire à la réalisation d’un terrain, à la consultation d’archives ou à un séjour dans une institution partenaire de l’Océan Indien. Le projet doit démontrer la pertinence scientifique de la mobilité et présenter un calendrier réaliste.",
    missions: ["Réaliser le programme de mobilité validé", "Remettre un rapport scientifique et financier", "Présenter les résultats lors d’une restitution publique"],
    profil: ["Inscription en Master 1 ou 2 dans une institution reconnue", "Projet portant sur Madagascar ou l’Océan Indien", "Accord écrit de l’encadrant académique"],
    competences: ["Projet de recherche", "Mobilité", "Sciences sociales", "Restitution"],
    contrat: "N/A",
    duree: "2 à 4 mois",
    tempsTravail: "N/A",
    remuneration: "Jusqu’à 3 500 € selon destination",
    niveauEtudes: "Master",
    experience: "N/A",
    financement: "Transport, séjour et assurance dans la limite du forfait",
    debut: "Entre janvier et juin 2027",
    langues: "Selon le pays et le terrain d’accueil",
    avantages: ["Réseau de mentors", "Appui administratif à la mobilité", "Valorisation du mémoire"],
    candidature: ["Projet de mobilité de 3 pages", "Budget prévisionnel", "CV", "Lettre de l’encadrant"],
    contact: "bourses@finidy.mg",
  },
  {
    slug: "charge-suivi-evaluation-programme-rural",
    titre: "Chargé·e de suivi-évaluation — programme rural",
    organisation: "Initiative Développement & Territoires",
    type: "EMPLOI",
    domaine: "Suivi-évaluation",
    lieu: "Fianarantsoa, Madagascar",
    mode: "Hybride",
    datePublication: "2026-07-11",
    dateLimite: "2026-08-22",
    image: "/uploads/magazine/magazine-pauvrete-madagascar.jpg",
    resume: "Pilotage du dispositif de suivi-évaluation, qualité des données et apprentissage d’un programme de développement rural.",
    description: "La personne recrutée structurera le cadre de résultats, accompagnera les équipes opérationnelles et transformera les données de suivi en recommandations utiles. Le poste demande autant de rigueur technique que de pédagogie auprès de partenaires variés.",
    missions: ["Actualiser le cadre logique et les indicateurs", "Organiser les contrôles qualité et missions de suivi", "Administrer les bases de données du programme", "Produire les rapports et animer les revues d’apprentissage"],
    profil: ["Master en économie, développement, statistique ou sciences sociales", "Maîtrise des méthodes quantitatives et qualitatives", "Capacité à former des équipes non spécialistes"],
    competences: ["MEAL", "Gestion de données", "Indicateurs", "Facilitation"],
    contrat: "CDD",
    duree: "12 mois, renouvelable",
    tempsTravail: "Temps plein",
    remuneration: "Selon expérience",
    niveauEtudes: "Master",
    experience: "3 ans minimum",
    financement: "Programme pluriannuel de développement rural",
    debut: "Octobre 2026",
    langues: "Français et malagasy requis",
    avantages: ["Assurance santé", "Moyens de communication", "Déplacements pris en charge"],
    candidature: ["CV", "Lettre de motivation", "Prétentions salariales", "Trois références"],
    contact: "emplois@finidy.mg",
  },
];

export function getOffre(slug: string) { return offres.find((offre) => offre.slug === slug); }
