export interface MembreCommunaute {
  id: string
  nom: string
  photo: string
  titre: string
  institution: string
  pays: string
  specialisations: string[]
  disciplines: string[]
  biographie: string
  parcours: {
    annee: string
    poste: string
    institution: string
  }[]
  formation: {
    annee: string
    diplome: string
    institution: string
  }[]
  publications: {
    annee: string
    titre: string
    revue: string
    doi?: string
  }[]
  articlesValides: number
  orcid?: string
  email?: string
}

export const MEMBRES_COMMUNAUTE: MembreCommunaute[] = [
  {
    id: 'rakoto-andriamasy',
    nom: 'Dr. Hery Rakoto-Andriamasy',
    photo: 'https://picsum.photos/seed/hery-rakoto/400/400',
    titre: 'Maître de conférences en Sociologie',
    institution: 'Université d\'Antananarivo',
    pays: 'Madagascar',
    specialisations: ['Sociologie urbaine', 'Migrations internes', 'Inégalités sociales'],
    disciplines: ['Sociologie', 'Démographie'],
    biographie:
      'Hery Rakoto-Andriamasy est maître de conférences en sociologie à l\'Université d\'Antananarivo. Ses recherches portent sur les dynamiques migratoires internes à Madagascar et leurs effets sur les transformations urbaines à Antananarivo. Il est membre du Laboratoire de Recherches en Sciences Humaines (LARSH) et dirige plusieurs projets de recherche financés par l\'IRD.',
    parcours: [
      { annee: '2018–présent', poste: 'Maître de conférences en Sociologie', institution: 'Université d\'Antananarivo' },
      { annee: '2015–2018', poste: 'Chercheur associé', institution: 'Institut de Recherche pour le Développement (IRD), Madagascar' },
      { annee: '2012–2015', poste: 'Chargé de cours', institution: 'Université de Mahajanga' },
    ],
    formation: [
      { annee: '2014', diplome: 'Doctorat en Sociologie', institution: 'Université Paris-Sorbonne' },
      { annee: '2009', diplome: 'Master 2 en Sciences Sociales', institution: 'Université d\'Antananarivo' },
      { annee: '2007', diplome: 'Licence en Sociologie', institution: 'Université d\'Antananarivo' },
    ],
    publications: [
      { annee: '2023', titre: 'Migrations rurales-urbaines et restructuration des quartiers périphériques d\'Antananarivo', revue: 'Revue Tiers Monde', doi: '10.3917/rtm.253.0041' },
      { annee: '2021', titre: 'Inégalités de revenus et ségrégation spatiale dans les villes malgaches', revue: 'Espaces et Sociétés', doi: '10.3917/esp.184.0089' },
      { annee: '2020', titre: 'Les migrations de crise : déplacements internes lors de la sécheresse du Grand Sud (2019)', revue: 'Population', doi: '10.3917/popu.2002.0221' },
    ],
    articlesValides: 14,
    orcid: '0000-0001-2345-6789',
  },
  {
    id: 'rasoanandrasana-voahangy',
    nom: 'Pr. Voahangy Rasoanandrasana',
    photo: 'https://picsum.photos/seed/voahangy/400/400',
    titre: 'Professeure en Anthropologie sociale',
    institution: 'Université de Toamasina',
    pays: 'Madagascar',
    specialisations: ['Anthropologie de la parenté', 'Rituels funéraires', 'Identité malgache'],
    disciplines: ['Anthropologie', 'Études malgaches'],
    biographie:
      'Voahangy Rasoanandrasana est professeure titulaire d\'anthropologie sociale à l\'Université de Toamasina. Spécialiste des pratiques rituelles et des systèmes de parenté malgaches, elle est l\'auteure de plusieurs ouvrages sur le famadihana et les structures sociales des hauts plateaux. Elle a été directrice du Département des Sciences Humaines de l\'Université de Toamasina de 2016 à 2022.',
    parcours: [
      { annee: '2016–présent', poste: 'Professeure titulaire en Anthropologie', institution: 'Université de Toamasina' },
      { annee: '2010–2016', poste: 'Maître de conférences', institution: 'Université de Toamasina' },
      { annee: '2006–2010', poste: 'Chercheure postdoctorale', institution: 'CNRS – Laboratoire d\'Ethnologie et de Sociologie Comparative, Paris' },
    ],
    formation: [
      { annee: '2005', diplome: 'Doctorat en Anthropologie sociale', institution: 'Université Paris-Nanterre' },
      { annee: '2001', diplome: 'DEA en Sciences Sociales', institution: 'Université Paris-Nanterre' },
      { annee: '1999', diplome: 'Maîtrise en Lettres et Sciences Humaines', institution: 'Université d\'Antananarivo' },
    ],
    publications: [
      { annee: '2022', titre: 'Le famadihana : entre mémoire ancestrale et modernité à Madagascar', revue: 'Journal des Africanistes', doi: '10.4000/africanistes.10287' },
      { annee: '2019', titre: 'Structures de parenté et foncier dans les Hautes Terres malgaches', revue: 'L\'Homme', doi: '10.4000/lhomme.32489' },
      { annee: '2017', titre: 'Rituels et identité nationale : le cas malgache', revue: 'Anthropologie et Sociétés', doi: '10.7202/1040455ar' },
      { annee: '2014', titre: 'Systèmes classificatoires de parenté Merina', revue: 'Africa', doi: '10.1017/S0001972013000715' },
    ],
    articlesValides: 22,
    orcid: '0000-0002-3456-7890',
  },
  {
    id: 'razafindrabe-jean-claude',
    nom: 'Dr. Jean-Claude Razafindrabe',
    photo: 'https://picsum.photos/seed/jcraz/400/400',
    titre: 'Chercheur en Économie du développement',
    institution: 'Institut National de la Statistique (INSTAT)',
    pays: 'Madagascar',
    specialisations: ['Économie rurale', 'Pauvreté et développement', 'Politiques publiques'],
    disciplines: ['Économie', 'Démographie'],
    biographie:
      'Jean-Claude Razafindrabe est chercheur senior à l\'INSTAT Madagascar et consultant pour la Banque mondiale. Ses travaux portent sur la mesure de la pauvreté multidimensionnelle, les transferts sociaux et les politiques de développement rural. Il est membre du Réseau Francophone de l\'Évaluation des Politiques Publiques (RFEPP).',
    parcours: [
      { annee: '2019–présent', poste: 'Chercheur senior en Économie du développement', institution: 'INSTAT Madagascar' },
      { annee: '2014–2019', poste: 'Économiste', institution: 'Programme des Nations Unies pour le Développement (PNUD), Antananarivo' },
      { annee: '2010–2014', poste: 'Analyste statisticien', institution: 'Ministère des Finances, Madagascar' },
    ],
    formation: [
      { annee: '2013', diplome: 'Doctorat en Économie', institution: 'Université d\'Auvergne, Clermont-Ferrand' },
      { annee: '2009', diplome: 'Master en Économétrie', institution: 'CERDI – Centre d\'Études et de Recherches sur le Développement International' },
      { annee: '2007', diplome: 'Licence en Économie', institution: 'Université d\'Antananarivo' },
    ],
    publications: [
      { annee: '2023', titre: 'Mesure de la pauvreté multidimensionnelle à Madagascar : 2012–2022', revue: 'Revue d\'Économie du Développement', doi: '10.3917/edd.372.0025' },
      { annee: '2021', titre: 'Transferts sociaux et résilience des ménages ruraux en période de crise', revue: 'Monde en Développement', doi: '10.3917/med.196.0067' },
      { annee: '2018', titre: 'Impact des investissements dans les routes rurales sur la croissance agricole', revue: 'Journal of African Economies', doi: '10.1093/jae/ejx042' },
    ],
    articlesValides: 11,
    orcid: '0000-0003-4567-8901',
  },
  {
    id: 'randriamaro-sahondra',
    nom: 'Dr. Sahondra Randriamaro',
    photo: 'https://picsum.photos/seed/sahondra/400/400',
    titre: 'Chargée de recherche en Études de genre',
    institution: 'Centre de Recherche Genre et Développement (CRGD)',
    pays: 'Madagascar',
    specialisations: ['Genre et développement', 'Droits des femmes', 'Féminismes africains'],
    disciplines: ['Études de genre', 'Sociologie', 'Droit'],
    biographie:
      'Sahondra Randriamaro est chargée de recherche au Centre de Recherche Genre et Développement de Madagascar. Ses travaux examinent les inégalités de genre dans l\'accès aux ressources foncières, à l\'éducation et aux soins de santé. Elle est co-fondatrice du réseau Genre et Recherche Madagascar (GReM) et membre du comité consultatif de la CEDAW pour la région Afrique australe.',
    parcours: [
      { annee: '2017–présent', poste: 'Chargée de recherche principale', institution: 'Centre de Recherche Genre et Développement (CRGD)' },
      { annee: '2013–2017', poste: 'Chercheuse associée', institution: 'Université Cheikh Anta Diop, Dakar' },
      { annee: '2011–2013', poste: 'Coordinatrice de programmes', institution: 'ONU Femmes, Madagascar' },
    ],
    formation: [
      { annee: '2012', diplome: 'Doctorat en Études féministes et de genre', institution: 'Université du Cap, Afrique du Sud' },
      { annee: '2008', diplome: 'Master en Genre et Développement', institution: 'Institute of Development Studies, Brighton' },
      { annee: '2006', diplome: 'Licence en Droit', institution: 'Université d\'Antananarivo' },
    ],
    publications: [
      { annee: '2024', titre: 'Genre et foncier à Madagascar : persistance des inégalités héréditaires', revue: 'Politique Africaine', doi: '10.3917/polaf.173.0051' },
      { annee: '2022', titre: 'Féminismes africains et savoirs situés : perspectives malgaches', revue: 'Feminist Africa', doi: '10.14296/fa.v23i1.2918' },
      { annee: '2020', titre: 'Violence conjugale et accès à la justice à Madagascar', revue: 'Droit et Société', doi: '10.3917/drs1.104.0453' },
    ],
    articlesValides: 9,
    orcid: '0000-0004-5678-9012',
  },
  {
    id: 'andriantsoa-pascal',
    nom: 'Pr. Pascal Andriantsoa',
    photo: 'https://picsum.photos/seed/pascal-a/400/400',
    titre: 'Professeur en Histoire contemporaine',
    institution: 'Université d\'Antananarivo',
    pays: 'Madagascar',
    specialisations: ['Histoire coloniale Madagascar', 'Décolonisation', 'Mémoire et identité nationale'],
    disciplines: ['Histoire', 'Science politique'],
    biographie:
      'Pascal Andriantsoa est professeur d\'histoire contemporaine à l\'Université d\'Antananarivo et directeur de l\'École Doctorale Sciences de l\'Homme et de la Société. Il est l\'un des principaux spécialistes de l\'histoire coloniale de Madagascar et de la période de décolonisation. Ses recherches récentes portent sur les politiques de mémoire et la construction de l\'identité nationale post-coloniale.',
    parcours: [
      { annee: '2012–présent', poste: 'Professeur titulaire en Histoire', institution: 'Université d\'Antananarivo' },
      { annee: '2020–présent', poste: 'Directeur de l\'École Doctorale SHS', institution: 'Université d\'Antananarivo' },
      { annee: '2007–2012', poste: 'Maître de conférences', institution: 'Université de Fianarantsoa' },
    ],
    formation: [
      { annee: '2006', diplome: 'Doctorat d\'État en Histoire', institution: 'Université d\'Antananarivo / cotutelle Université d\'Aix-Marseille' },
      { annee: '2001', diplome: 'DEA en Histoire', institution: 'Université d\'Aix-Marseille' },
      { annee: '1999', diplome: 'Maîtrise en Histoire', institution: 'Université d\'Antananarivo' },
    ],
    publications: [
      { annee: '2023', titre: 'L\'insurrection de 1947 : nouvelles lectures historiographiques', revue: 'Vingtième Siècle. Revue d\'histoire', doi: '10.3917/ving.158.0059' },
      { annee: '2021', titre: 'Décolonisation et construction nationale à Madagascar (1960–1975)', revue: 'Cahiers d\'Études Africaines', doi: '10.4000/etudesafricaines.27841' },
      { annee: '2019', titre: 'Mémoire coloniale et politiques de réconciliation à Madagascar', revue: 'Revue d\'Histoire Moderne et Contemporaine', doi: '10.3917/rhmc.663.0069' },
      { annee: '2016', titre: 'Les archives malgaches de la colonisation française', revue: 'Archives', doi: '10.3917/arch.162.0045' },
    ],
    articlesValides: 18,
    orcid: '0000-0005-6789-0123',
  },
  {
    id: 'rabemanantsoa-claire',
    nom: 'Dr. Claire Rabemanantsoa',
    photo: 'https://picsum.photos/seed/claire-r/400/400',
    titre: 'Maître de conférences en Linguistique',
    institution: 'Université de Fianarantsoa',
    pays: 'Madagascar',
    specialisations: ['Sociolinguistique malgache', 'Langues menacées', 'Plurilinguisme'],
    disciplines: ['Linguistique', 'Communication'],
    biographie:
      'Claire Rabemanantsoa est maître de conférences en linguistique à l\'Université de Fianarantsoa. Ses recherches portent sur la sociolinguistique des langues de Madagascar, en particulier la documentation et la revitalisation des langues dialectales menacées. Elle coordonne le projet DIALMA (Dialectes de Madagascar) financé par l\'ANR.',
    parcours: [
      { annee: '2016–présent', poste: 'Maître de conférences en Linguistique', institution: 'Université de Fianarantsoa' },
      { annee: '2013–2016', poste: 'ATER (Attachée Temporaire d\'Enseignement et de Recherche)', institution: 'Université Sorbonne Nouvelle' },
      { annee: '2012–2013', poste: 'Coordinatrice linguistique', institution: 'SIL International, Madagascar' },
    ],
    formation: [
      { annee: '2015', diplome: 'Doctorat en Sciences du langage', institution: 'Université Sorbonne Nouvelle – Paris 3' },
      { annee: '2010', diplome: 'Master 2 en Linguistique descriptive', institution: 'Université Sorbonne Nouvelle' },
      { annee: '2008', diplome: 'Licence en Lettres et Langues', institution: 'Université d\'Antananarivo' },
    ],
    publications: [
      { annee: '2023', titre: 'Variation dialectale et standardisation du malgache officiel', revue: 'Langage et Société', doi: '10.3917/ls.183.0041' },
      { annee: '2021', titre: 'Les langues malgaches menacées : état des lieux et perspectives de revitalisation', revue: 'Revue de Linguistique et de Didactique des Langues', doi: '10.4000/lidil.8742' },
      { annee: '2019', titre: 'Code-switching malgache-français dans les pratiques commerciales à Antananarivo', revue: 'GLOTTOPOL', doi: '10.4000/glottopol.1218' },
    ],
    articlesValides: 8,
    orcid: '0000-0006-7890-1234',
  },
  {
    id: 'rakotovao-marie-france',
    nom: 'Pr. Marie-France Rakotovao',
    photo: 'https://picsum.photos/seed/mf-rakoto/400/400',
    titre: 'Professeure en Sciences de l\'éducation',
    institution: 'École Normale Supérieure (ENS) d\'Antananarivo',
    pays: 'Madagascar',
    specialisations: ['Éducation et inégalités', 'Pédagogie critique', 'Systèmes éducatifs africains'],
    disciplines: ['Sciences de l\'éducation', 'Sociologie'],
    biographie:
      'Marie-France Rakotovao est professeure en sciences de l\'éducation à l\'ENS d\'Antananarivo et directrice de la Revue Malgache des Sciences de l\'Éducation. Elle s\'intéresse aux inégalités scolaires, aux réformes éducatives post-coloniales et aux pédagogies adaptées aux contextes africains. Elle a été consultante pour l\'UNESCO et l\'UNICEF sur les politiques éducatives à Madagascar.',
    parcours: [
      { annee: '2010–présent', poste: 'Professeure en Sciences de l\'éducation', institution: 'ENS d\'Antananarivo' },
      { annee: '2015–2020', poste: 'Directrice de la Revue Malgache des Sciences de l\'Éducation', institution: 'ENS d\'Antananarivo' },
      { annee: '2005–2010', poste: 'Maître de conférences', institution: 'Université d\'Antananarivo' },
    ],
    formation: [
      { annee: '2004', diplome: 'Doctorat en Sciences de l\'éducation', institution: 'Université Paris 8' },
      { annee: '2000', diplome: 'DEA en Sciences de l\'éducation', institution: 'Université Paris 8' },
      { annee: '1998', diplome: 'Maîtrise en Psychologie', institution: 'Université d\'Antananarivo' },
    ],
    publications: [
      { annee: '2022', titre: 'Réformes éducatives et reproduction des inégalités à Madagascar', revue: 'Revue Française de Pédagogie', doi: '10.4000/rfp.11327' },
      { annee: '2020', titre: 'Pédagogies critiques en Afrique subsaharienne : entre importation et adaptation', revue: 'Éducation et Sociétés', doi: '10.3917/es.045.0041' },
      { annee: '2018', titre: 'Langue d\'enseignement et réussite scolaire : le dilemme malgache', revue: 'Spirale – Revue de Recherches en Éducation', doi: '10.3406/spira.2018.1182' },
    ],
    articlesValides: 16,
    orcid: '0000-0007-8901-2345',
  },
  {
    id: 'andriamahefarivo-ndriana',
    nom: 'Dr. Ndriana Andriamahefarivo',
    photo: 'https://picsum.photos/seed/ndriana/400/400',
    titre: 'Chercheur en Géographie humaine',
    institution: 'Institut Géographique et Hydrographique National (FTM)',
    pays: 'Madagascar',
    specialisations: ['Géographie rurale', 'Foncier tropical', 'Cartographie participative'],
    disciplines: ['Géographie humaine', 'Démographie'],
    biographie:
      'Ndriana Andriamahefarivo est chercheur en géographie humaine au FTM et enseignant vacataire à l\'Université d\'Antananarivo. Ses recherches portent sur les dynamiques foncières dans les zones rurales de Madagascar, la cartographie participative et les conflits d\'usage des terres. Il collabore avec plusieurs ONG de terrain sur les questions de sécurisation foncière.',
    parcours: [
      { annee: '2018–présent', poste: 'Chercheur en Géographie humaine', institution: 'FTM – Institut Géographique et Hydrographique' },
      { annee: '2015–2018', poste: 'Consultant foncier', institution: 'Comité Technique Foncier et Développement (CTFD), Antananarivo' },
      { annee: '2013–2015', poste: 'Chargé d\'études', institution: 'ONG Agronomes et Vétérinaires Sans Frontières (AVSF), Madagascar' },
    ],
    formation: [
      { annee: '2016', diplome: 'Doctorat en Géographie', institution: 'Université Bordeaux Montaigne' },
      { annee: '2012', diplome: 'Master en Géographie et Aménagement', institution: 'Université d\'Antananarivo / Université Bordeaux' },
      { annee: '2010', diplome: 'Licence en Géographie', institution: 'Université d\'Antananarivo' },
    ],
    publications: [
      { annee: '2023', titre: 'Sécurisation foncière et développement rural : le certificat foncier malgache en question', revue: 'Autrepart', doi: '10.3917/autr.090.0079' },
      { annee: '2021', titre: 'Cartographie participative et droits coutumiers dans le Menabe', revue: 'Espace géographique', doi: '10.3917/eg.504.0319' },
      { annee: '2019', titre: 'Dynamiques foncières postcoloniales dans les Hautes Terres malgaches', revue: 'Annales de Géographie', doi: '10.3917/ag.726.0048' },
    ],
    articlesValides: 7,
    orcid: '0000-0008-9012-3456',
  },
  {
    id: 'raharimanana-zo',
    nom: 'Dr. Zo Raharimanana',
    photo: 'https://picsum.photos/seed/zo-raha/400/400',
    titre: 'Maître de conférences en Science politique',
    institution: 'Université de Toliara',
    pays: 'Madagascar',
    specialisations: ['Gouvernance africaine', 'Mouvements sociaux', 'Transitions politiques'],
    disciplines: ['Science politique', 'Relations internationales'],
    biographie:
      'Zo Raharimanana est maître de conférences en science politique à l\'Université de Toliara. Ses recherches examinent les processus de démocratisation à Madagascar, les crises politiques et les mouvements sociaux dans l\'Océan Indien. Il est membre de l\'Observatoire Politique de Madagascar (OPM) et collabore avec le Centre for Democracy and Development (CDD).',
    parcours: [
      { annee: '2017–présent', poste: 'Maître de conférences en Science politique', institution: 'Université de Toliara' },
      { annee: '2014–2017', poste: 'Chercheur postdoctoral', institution: 'Centre d\'Études Africaines, Sciences Po Paris' },
      { annee: '2012–2014', poste: 'Chargé de mission', institution: 'NDI (National Democratic Institute), Madagascar' },
    ],
    formation: [
      { annee: '2013', diplome: 'Doctorat en Science politique', institution: 'Sciences Po Bordeaux' },
      { annee: '2009', diplome: 'Master en Science politique comparée', institution: 'Sciences Po Bordeaux' },
      { annee: '2007', diplome: 'Licence en Droit public', institution: 'Université d\'Antananarivo' },
    ],
    publications: [
      { annee: '2024', titre: 'Crises politiques et sorties de crise à Madagascar : le rôle des médiations régionales', revue: 'Politique Africaine', doi: '10.3917/polaf.174.0029' },
      { annee: '2022', titre: 'Mouvements sociaux et réseaux numériques : les mobilisations malgaches de 2018–2020', revue: 'Politix', doi: '10.3917/pox.139.0101' },
      { annee: '2019', titre: 'Décentralisation et gouvernance locale à Madagascar', revue: 'Revue Internationale de Politique Comparée', doi: '10.3917/ripc.263.0057' },
    ],
    articlesValides: 12,
    orcid: '0000-0009-0123-4567',
  },
  {
    id: 'rasamimanana-fara',
    nom: 'Dr. Fara Rasamimanana',
    photo: 'https://picsum.photos/seed/fara-rasami/400/400',
    titre: 'Chercheuse en Psychologie sociale',
    institution: 'Université d\'Antananarivo / Réseaux Francophones de Psychologie',
    pays: 'Madagascar',
    specialisations: ['Psychologie interculturelle', 'Bien-être et développement', 'Représentations sociales'],
    disciplines: ['Psychologie sociale', 'Sciences de l\'éducation'],
    biographie:
      'Fara Rasamimanana est chercheuse en psychologie sociale à l\'Université d\'Antananarivo. Elle est spécialisée dans les représentations sociales de la santé mentale, le bien-être psychologique dans les contextes de précarité et la psychologie interculturelle. Elle coordonne le Réseau Francophone de Psychologie et Développement (RFPD) pour la zone Océan Indien.',
    parcours: [
      { annee: '2019–présent', poste: 'Chercheuse en Psychologie sociale', institution: 'Université d\'Antananarivo' },
      { annee: '2016–2019', poste: 'Psychologue clinicienne et chercheuse', institution: 'OCHA Madagascar' },
      { annee: '2014–2016', poste: 'Assistante de recherche', institution: 'Laboratoire de Psychologie Sociale, Université Aix-Marseille' },
    ],
    formation: [
      { annee: '2018', diplome: 'Doctorat en Psychologie sociale', institution: 'Université d\'Antananarivo / cotutelle Université Aix-Marseille' },
      { annee: '2013', diplome: 'Master 2 en Psychologie sociale et interculturelle', institution: 'Université Aix-Marseille' },
      { annee: '2011', diplome: 'Licence en Psychologie', institution: 'Université d\'Antananarivo' },
    ],
    publications: [
      { annee: '2023', titre: 'Représentations sociales de la maladie mentale à Madagascar : stigmate et recours aux soins', revue: 'Santé mentale au Québec', doi: '10.7202/1104587ar' },
      { annee: '2021', titre: 'Résilience psychologique et capital social en milieu rural malgache', revue: 'Revue Européenne de Psychologie Appliquée', doi: '10.1016/j.erap.2021.100658' },
      { annee: '2019', titre: 'Bien-être subjectif et identité culturelle chez les jeunes malgaches', revue: 'International Journal of Psychology', doi: '10.1002/ijop.12573' },
    ],
    articlesValides: 6,
    orcid: '0000-0010-1234-5678',
  },
]
