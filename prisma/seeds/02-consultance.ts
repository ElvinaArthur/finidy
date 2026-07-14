/**
 * Seed 02 — Consultance (Pilier 2)
 * 5 profils d'experts + quelques demandes de consultation.
 */
import { prisma } from "./_client";

export async function seedConsultance(auteurIds: Record<string, string>) {
  console.log("🤝 Création des profils experts et demandes...");

  const experts = [
    {
      email: "fidy.andriantsoa@ird.mg",
      titre: "Économiste du développement — Évaluation de politiques publiques",
      specialites: [
        "Évaluation d'impact", "Économie rurale", "Politiques sociales",
        "Analyse coût-bénéfice", "Développement durable",
      ],
      tarifHeure: 85,
      disponible: true,
      ville: "Antananarivo",
      cvUrl: "/uploads/cv/cv-andriantsoa.pdf",
    },
    {
      email: "jean.rakoto@univ-tana.mg",
      titre: "Sociologue — Études organisationnelles et ressources humaines",
      specialites: [
        "Sociologie des organisations", "Gestion des conflits", "Audit social",
        "Formation", "Enquêtes qualitatives",
      ],
      tarifHeure: 60,
      disponible: true,
      ville: "Antananarivo",
    },
    {
      email: "eric.ramaroson@sciencespo-mg.mg",
      titre: "Politologue — Gouvernance, décentralisation et réformes institutionnelles",
      specialites: [
        "Gouvernance locale", "Décentralisation", "Réformes électorales",
        "Médiation politique", "Formation civique",
      ],
      tarifHeure: 75,
      disponible: true,
      ville: "Antananarivo",
    },
    {
      email: "voahirana.rakotondrabe@cnre.mg",
      titre: "Anthropologue — Études d'impact social et participation communautaire",
      specialites: [
        "Études d'impact social", "Participation communautaire", "Droits fonciers",
        "Gestion des ressources naturelles", "Médiation culturelle",
      ],
      tarifHeure: 70,
      disponible: false,
      ville: "Fianarantsoa",
    },
    {
      email: "hanta.razafy@ihm.mg",
      titre: "Historienne — Conseil en patrimoine et mémoire institutionnelle",
      specialites: [
        "Valorisation du patrimoine", "Archives institutionnelles", "Histoire orale",
        "Tourisme culturel", "Rédaction historique",
      ],
      tarifHeure: 55,
      disponible: true,
      ville: "Antananarivo",
    },
  ];

  const expertIds: Record<string, string> = {};

  for (const e of experts) {
    const userId = auteurIds[e.email];
    if (!userId) continue;

    const profile = await prisma.expertProfile.upsert({
      where: { userId },
      update: {},
      create: {
        userId,
        titre: e.titre,
        specialites: e.specialites,
        tarifHeure: e.tarifHeure,
        disponible: e.disponible,
        ville: e.ville,
        cvUrl: (e as any).cvUrl ?? null,
      },
    });
    expertIds[e.email] = profile.id;
  }

  // Quelques demandes de consultation
  const demandes = [
    {
      expertEmail: "fidy.andriantsoa@ird.mg",
      nomClient: "ONG Développement Rural Mada",
      emailClient: "contact@drm.mg",
      sujet: "Évaluation d'impact d'un programme d'appui aux coopératives agricoles",
      description: "Nous cherchons un économiste pour évaluer l'impact de notre programme d'appui aux coopératives de riz dans la région Vakinankaratra. Le projet a duré 3 ans et touche 450 ménages.",
      budget: 4500,
      delai: "2 mois",
      statut: "EN_COURS",
    },
    {
      expertEmail: "jean.rakoto@univ-tana.mg",
      nomClient: "Société Sucrière de Madagascar",
      emailClient: "drh@ssm.mg",
      sujet: "Audit social et diagnostic organisationnel",
      description: "Contexte de restructuration interne. Nous souhaitons un diagnostic sociologique de notre organisation pour identifier les tensions et améliorer le dialogue social.",
      budget: 3000,
      delai: "6 semaines",
      statut: "EN_ATTENTE",
    },
    {
      expertEmail: "voahirana.rakotondrabe@cnre.mg",
      nomClient: "Projet REDD+ Corridor Fandriana",
      emailClient: "redd@fandriana.mg",
      sujet: "Étude d'impact social du projet de conservation",
      description: "Notre projet de conservation forestière dans le corridor Fandriana-Vondrozo nécessite une étude d'impact social conforme aux standards de la Banque mondiale (ESP).",
      budget: 8000,
      delai: "3 mois",
      statut: "EN_ATTENTE",
    },
  ];

  let countDemandes = 0;
  for (const d of demandes) {
    const expertId = expertIds[d.expertEmail];
    if (!expertId) continue;
    await prisma.demandeConsultance.create({
      data: {
        expertId,
        nomClient: d.nomClient,
        emailClient: d.emailClient,
        sujet: d.sujet,
        description: d.description,
        budget: d.budget,
        delai: d.delai,
        statut: d.statut as any,
      },
    });
    countDemandes++;
  }

  console.log(`   ✅ Profils experts créés : ${Object.keys(expertIds).length}`);
  console.log(`   ✅ Demandes consultation : ${countDemandes}`);
}
