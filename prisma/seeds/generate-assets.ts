/**
 * generate-assets.ts
 * Télécharge les images Unsplash (libre de droit) et génère les PDFs des résumés.
 * Exécuter avec : npx tsx prisma/seeds/generate-assets.ts
 */

import fs from "fs";
import https from "https";
import http from "http";
import path from "path";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const ROOT = path.resolve(__dirname, "../../public");

// ─── Helpers ────────────────────────────────────────────────────────────────

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) {
      console.log(`   ⏭  Déjà présent : ${path.basename(dest)}`);
      return resolve();
    }
    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith("https") ? https : http;
    const options = {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; FINIDY-Research-Center/1.0)",
        "Accept": "image/jpeg,image/png,image/*",
      },
    };
    protocol
      .get(url, options, (res) => {
        // Suivre les redirects (302)
        if (res.statusCode === 301 || res.statusCode === 302) {
          file.close();
          fs.unlinkSync(dest);
          downloadFile(res.headers.location!, dest).then(resolve).catch(reject);
          return;
        }
        if (res.statusCode !== 200) {
          file.close();
          fs.unlinkSync(dest);
          reject(new Error(`HTTP ${res.statusCode} pour ${url}`));
          return;
        }
        res.pipe(file);
        file.on("finish", () => { file.close(); resolve(); });
      })
      .on("error", (err) => {
        if (fs.existsSync(dest)) fs.unlinkSync(dest);
        reject(err);
      });
  });
}

// Lorem Picsum — photos libres de droit, stables par seed (CC0 / Unsplash License)
// https://picsum.photos/seed/{seed}/{width}/{height}
const picsumUrl = (seed: string, w = 800, h = 600) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

// ─── Mapping images ──────────────────────────────────────────────────────────

// seed → image stable (picsum.photos choisit toujours la même photo pour un seed donné)
const IMAGES: Array<{ dest: string; seed: string; label: string }> = [
  // ── Entretiens ────────────────────────────────────────────────────────────
  { dest: "uploads/entretiens/podcast-rakotomalala.jpg",  seed: "microphone1",   label: "Podcast Rakotomalala" },
  { dest: "uploads/entretiens/podcast-razafy.jpg",        seed: "microphone2",   label: "Podcast Razafy" },
  { dest: "uploads/entretiens/podcast-rakotondrabe.jpg",  seed: "microphone3",   label: "Podcast Rakotondrabe" },
  { dest: "uploads/entretiens/video-intro-sociologie.jpg", seed: "lecture1",     label: "Vidéo sociologie" },
  { dest: "uploads/entretiens/video-democratie-afrique.jpg", seed: "conference1",label: "Vidéo démocratie Afrique" },
  { dest: "uploads/entretiens/video-economie-malgache.jpg",  seed: "africa1",    label: "Vidéo économie malgache" },
  { dest: "uploads/entretiens/texte-ramanantsoa-education.jpg", seed: "school1", label: "Texte éducation" },
  { dest: "uploads/entretiens/texte-rakotondrabe-foret.jpg", seed: "nature1",    label: "Texte forêt" },

  // ── Avatars auteurs (portraits, format carré) ────────────────────────────
  { dest: "uploads/avatars/jean-rakotomalala.jpg",   seed: "man-africa-1",  label: "Avatar Jean-Louis Rakotomalala" },
  { dest: "uploads/avatars/hanta-razafy.jpg",        seed: "woman-1",       label: "Avatar Hanta Razafy" },
  { dest: "uploads/avatars/fidy-andriantsoa.jpg",    seed: "man-africa-2",  label: "Avatar Fidy Andriantsoa" },
  { dest: "uploads/avatars/voahirana-rakotondrabe.jpg", seed: "woman-2",    label: "Avatar Voahirana Rakotondrabe" },
  { dest: "uploads/avatars/eric-ramaroson.jpg",      seed: "man-africa-3",  label: "Avatar Éric Ramaroson" },
  { dest: "uploads/avatars/celestine-ramanantsoa.jpg", seed: "woman-3",     label: "Avatar Célestine Ramanantsoa" },

  // ── Couvertures livres ────────────────────────────────────────────────────
  { dest: "uploads/couvertures/livre-sociologie-travail-mada.jpg", seed: "market1",    label: "Couverture Sociologie travail" },
  { dest: "uploads/couvertures/livre-menalamba-histoire.jpg",      seed: "archive1",   label: "Couverture Menalamba" },
  { dest: "uploads/couvertures/livre-capabilites-developpement.jpg", seed: "economy1", label: "Couverture Capabilités" },
  { dest: "uploads/couvertures/livre-dina-gouvernance.jpg",         seed: "forest1",   label: "Couverture Dina" },
  { dest: "uploads/couvertures/livre-madagascar-politique.jpg",     seed: "politics1", label: "Couverture Madagascar politique" },
  { dest: "uploads/couvertures/livre-apprendre-malgache.jpg",       seed: "classroom1",label: "Couverture Apprendre malgache" },
  { dest: "uploads/couvertures/livre-femmes-pouvoir-mada.jpg",      seed: "portrait1", label: "Couverture Femmes et pouvoir" },

  // Cours (thumbnails 16:9)
  { dest: "uploads/cours/cours-intro-sociologie.jpg", seed: "social-network", label: "Cours introduction à la sociologie" },
  { dest: "uploads/cours/cours-histoire-madagascar.jpg", seed: "madagascar-history", label: "Cours histoire de Madagascar" },
  { dest: "uploads/cours/cours-methodes-recherche.jpg", seed: "research-methods", label: "Cours méthodes de recherche" },
  { dest: "uploads/cours/cours-gouvernance-afrique.jpg", seed: "africa-governance", label: "Cours gouvernance en Afrique" },

  // Colloques (bannières 16:9)
  { dest: "uploads/colloques/colloque-shs-ocean-indien-2025.jpg", seed: "indian-ocean-conference-2025", label: "Colloque SHS 2025" },
  { dest: "uploads/colloques/colloque-education-bilingue-2026.jpg", seed: "bilingual-education-2026", label: "Colloque éducation bilingue 2026" },
  { dest: "uploads/colloques/colloque-shs-ocean-indien-2024.jpg", seed: "indian-ocean-conference-2024", label: "Colloque SHS 2024" },
];

// ─── PDFs ────────────────────────────────────────────────────────────────────

interface PdfSpec {
  dest: string;
  titre: string;
  auteur: string;
  revue?: string;
  annee?: number;
  doi?: string;
  resume: string;
}

const PDFS: PdfSpec[] = [
  // ── Revue articles ────────────────────────────────────────────────────────
  {
    dest: "uploads/articles-pdf/article-marche-travail-informel.pdf",
    titre: "Transformations du marché du travail informel à Antananarivo",
    auteur: "Jean-Louis Rakotomalala",
    revue: "SAONTSY — Revue FINIDY Research Center",
    annee: 2024,
    doi: "10.1234/nihary.transformations-du-march",
    resume:
      "Cet article analyse les mutations récentes du secteur informel dans la capitale malgache à partir d'une enquête longitudinale menée auprès de 200 travailleurs informels entre 2019 et 2023. En mobilisant la sociologie des parcours de vie, nous montrons comment la pandémie de Covid-19 a accéléré des dynamiques de précarisation déjà à l'œuvre, tout en révélant des stratégies de résilience spécifiques aux contextes urbains d'Afrique subsaharienne.",
  },
  {
    dest: "uploads/articles-pdf/article-archives-coloniales-menalamba.pdf",
    titre: "Archives coloniales et mémoire populaire : la construction narrative de la résistance Menalamba (1895-1897)",
    auteur: "Hanta Razafy",
    revue: "SAONTSY — Revue FINIDY Research Center",
    annee: 2024,
    doi: "10.1234/nihary.archives-coloniales-et-me",
    resume:
      "À partir d'un croisement entre archives coloniales françaises et sources orales collectées dans les hautes terres malgaches, cet article revisite l'insurrection Menalamba. Nous montrons que la mémoire collective locale construit une représentation de cet épisode largement en décalage avec le récit colonial, révélant ainsi les enjeux identitaires et politiques d'une mémoire vivante.",
  },
  {
    dest: "uploads/articles-pdf/article-pauvrete-capabilites.pdf",
    titre: "Pauvreté multidimensionnelle et capabilités en zone rurale malgache",
    auteur: "Fidy Andriantsoa",
    revue: "SAONTSY — Revue FINIDY Research Center",
    annee: 2024,
    doi: "10.1234/nihary.pauvrete-multidimensionne",
    resume:
      "En appliquant l'approche par les capabilités d'Amartya Sen à un panel de 1 200 ménages ruraux malgaches (2018-2022), cet article propose un indice composite de bien-être qui dépasse les mesures monétaires classiques. Les résultats montrent que des régions classées pauvres selon le critère revenu présentent des niveaux de liberté substantielle significativement supérieurs à la moyenne nationale.",
  },
  {
    dest: "uploads/articles-pdf/article-dina-foncier-menabe.pdf",
    titre: "Le dina comme institution de gouvernance foncière dans les zones forestières du Menabe",
    auteur: "Voahirana Rakotondrabe",
    revue: "SAONTSY — Revue FINIDY Research Center",
    annee: 2024,
    doi: "10.1234/nihary.le-dina-comme-institution",
    resume:
      "Le dina, contrat social malgache de régulation communautaire, constitue une institution de gouvernance foncière parallèle aux structures étatiques dans les zones forestières du Menabe. Cet article, fondé sur 18 mois d'observation participante, analyse les mécanismes par lesquels le dina s'articule avec les dispositifs légaux nationaux et les politiques de conservation internationale.",
  },
  {
    dest: "uploads/articles-pdf/article-democratie-madagascar-2023.pdf",
    titre: "Transition démocratique à Madagascar : les élections de 2023",
    auteur: "Éric Ramaroson",
    revue: "SAONTSY — Revue FINIDY Research Center",
    annee: 2024,
    doi: "10.1234/nihary.transition-democratique-a",
    resume:
      "Cet article analyse les élections présidentielle et législatives malgaches de 2023 sous l'angle de la consolidation démocratique. Croisant analyse de données électorales et entretiens avec des acteurs politiques locaux, nous montrons la coexistence paradoxale d'une infrastructure institutionnelle formelle progressivement consolidée et de pratiques clientélistes structurelles qui limitent la représentativité du système.",
  },
  {
    dest: "uploads/articles-pdf/article-bilinguisme-antananarivo.pdf",
    titre: "Bilinguisme et construction identitaire chez les élèves du secondaire à Antananarivo",
    auteur: "Célestine Ramanantsoa",
    revue: "SAONTSY — Revue FINIDY Research Center",
    annee: 2024,
    doi: "10.1234/nihary.bilinguisme-et-constructio",
    resume:
      "À partir d'une enquête sociolinguistique conduite dans huit établissements secondaires de la capitale, cet article explore les représentations que les élèves ont de leurs deux langues de scolarisation — le malgache et le français. Les résultats révèlent une tension entre une valorisation instrumentale du français et une identification affective forte au malgache, avec des variations significatives selon le milieu socio-économique.",
  },
  {
    dest: "uploads/articles-pdf/article-famadihana-modernite.pdf",
    titre: "Famadihana et modernité : recomposition des rites funéraires malgaches en contexte urbain",
    auteur: "Voahirana Rakotondrabe",
    revue: "SAONTSY — Revue FINIDY Research Center",
    annee: 2025,
    doi: "10.1234/nihary.famadihana-et-modernite-r",
    resume:
      "Le famadihana, rituel du retournement des morts, fait l'objet de recompositions profondes dans les espaces urbains d'Antananarivo. Cet article analyse, à partir d'une enquête ethnographique de deux ans, comment les contraintes économiques, les migrations et la diversification religieuse modifient les formes et les significations de ce rituel central de la société malgache.",
  },
  {
    dest: "uploads/articles-pdf/article-strategies-educatives-fianarantsoa.pdf",
    titre: "Les stratégies éducatives des ménages défavorisés de Fianarantsoa",
    auteur: "Célestine Ramanantsoa",
    revue: "SAONTSY — Revue FINIDY Research Center",
    annee: 2025,
    doi: "10.1234/nihary.les-strategies-educatives-",
    resume:
      "Cet article examine, à partir d'une étude de cas approfondie conduite à Fianarantsoa, les stratégies éducatives des ménages à faibles revenus. En articulant sociologie de l'éducation et économie du ménage, nous montrons comment les familles arbitrent entre scolarisation des enfants, travail domestique et pression économique immédiate, et comment ces arbitrages reproduisent ou non les inégalités intergénérationnelles.",
  },
  {
    dest: "uploads/articles-pdf/article-genre-ressources-alaotra.pdf",
    titre: "Genre et accès aux ressources naturelles dans les communautés paysannes du lac Alaotra",
    auteur: "Hanta Razafy",
    revue: "SAONTSY — Revue FINIDY Research Center",
    annee: 2025,
    doi: "10.1234/nihary.genre-et-acces-aux-ressou",
    resume:
      "Cette recherche analyse les inégalités de genre dans l'accès et le contrôle des ressources naturelles — eau, terre, forêt — dans les communautés rurales riveraines du lac Alaotra. À partir d'une enquête mixte (questionnaires et entretiens semi-directifs), elle révèle que les femmes, bien que principales usagères des ressources, sont systématiquement exclues des instances de décision locales sur leur gestion.",
  },

  // ── Extraits livres ───────────────────────────────────────────────────────
  {
    dest: "uploads/extraits/extrait-sociologie-travail.pdf",
    titre: "Extrait — Sociologie du travail à Madagascar",
    auteur: "Jean-Louis Rakotomalala",
    annee: 2024,
    resume:
      "Cet ouvrage constitue la première synthèse francophone consacrée à la sociologie du travail dans le contexte malgache. À partir d'enquêtes de terrain menées sur plus de cinq ans dans les marchés, usines franches et quartiers populaires d'Antananarivo, Jean-Louis Rakotomalala cartographie les transformations du monde du travail à Madagascar depuis l'indépendance.\n\nL'ouvrage s'articule autour de trois grandes parties. La première analyse les structures de l'économie informelle et ses logiques internes. La deuxième examine les zones franches industrielles et leur impact sur les conditions de travail et les relations de genre. La troisième explore les formes de résistance collective — syndicats, associations de quartier, solidarités informelles.\n\nCollection : Sciences de la société — FINIDY Éditions · 312 pages · ISBN 978-2-9999-0001-4",
  },
  {
    dest: "uploads/extraits/extrait-menalamba.pdf",
    titre: "Extrait — Les Menalamba : insurrection, mémoire et identité à Madagascar",
    auteur: "Hanta Razafy",
    annee: 2024,
    resume:
      "La résistance Menalamba contre la colonisation française est l'un des épisodes les plus dramatiques et les moins connus de l'histoire malgache. Cet ouvrage, fruit de dix années de recherches dans les archives françaises et malgaches, propose la première histoire complète de ce mouvement.\n\nHanta Razafy montre comment les Menalamba n'étaient pas les « sauvages » décrits par les colonisateurs, mais les porteurs d'un projet politique cohérent fondé sur la défense de la royauté merina et des valeurs ancestrales.\n\nCollection : Histoire de l'Océan Indien — FINIDY Éditions · 428 pages · ISBN 978-2-9999-0002-1",
  },
  {
    dest: "uploads/extraits/extrait-dina.pdf",
    titre: "Extrait — Dina : gouvernance communautaire et gestion des ressources naturelles",
    auteur: "Voahirana Rakotondrabe",
    annee: 2025,
    resume:
      "Le dina — contrat social malgache de régulation communautaire — est l'une des institutions les plus originales et les moins étudiées de l'Afrique subsaharienne. Cet ouvrage propose la première analyse anthropologique systématique de son rôle dans la gouvernance des ressources naturelles.\n\nÀ partir d'une enquête de terrain de 18 mois dans le Menabe, Voahirana Rakotondrabe montre comment le dina structure les droits fonciers, régule l'accès à la forêt et arbitre les conflits entre communautés.\n\nCollection : Anthropologie — FINIDY Éditions · 354 pages · ISBN 978-2-9999-0004-5",
  },
  {
    dest: "uploads/extraits/extrait-apprendre-malgache.pdf",
    titre: "Extrait — Apprendre en malgache : didactique du bilinguisme à l'école primaire",
    auteur: "Célestine Ramanantsoa",
    annee: 2025,
    resume:
      "Dans un pays où la langue d'enseignement fait l'objet de débats politiques permanents, cet ouvrage apporte une réponse scientifique : quels sont les effets réels du choix de la langue d'instruction sur les apprentissages des élèves malgaches ?\n\nÀ partir d'une vaste étude comparative menée dans 40 écoles primaires de six régions, Célestine Ramanantsoa montre que les élèves instruits initialement en malgache acquièrent de meilleures bases en lecture, mathématiques et compréhension.\n\nCollection : Sciences de l'éducation — FINIDY Éditions · 244 pages · ISBN 978-2-9999-0006-9",
  },
];

// ─── Générateur PDF ───────────────────────────────────────────────────────────

const EXTRA_PDFS: PdfSpec[] = [
  {
    dest: "uploads/colloques/programme-shs-oi-2024.pdf",
    titre: "Programme - 4e Colloque International SHS Ocean Indien",
    auteur: "FINIDY Research Center", annee: 2024,
    resume: "Programme du colloque consacre aux inegalites et au developpement dans l'Ocean Indien.",
  },
  {
    dest: "uploads/colloques/actes-shs-oi-2024.pdf",
    titre: "Actes - 4e Colloque International SHS Ocean Indien",
    auteur: "FINIDY Research Center", annee: 2024,
    resume: "Actes reunissant les communications sur les inegalites et le developpement dans l'Ocean Indien.",
  },
  {
    dest: "uploads/cv/cv-andriantsoa.pdf",
    titre: "Curriculum vitae - Fidy Andriantsoa",
    auteur: "Fidy Andriantsoa",
    resume: "Economiste du developpement specialise en evaluation d'impact, economie rurale et politiques sociales.",
  },
];

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if ((current + " " + word).trim().length <= maxChars) {
      current = (current + " " + word).trim();
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

async function generatePdf(spec: PdfSpec, dest: string) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]); // A4
  const { width, height } = page.getSize();

  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const or = rgb(0.91, 0.627, 0.125);    // #E8A020
  const brun = rgb(0.361, 0.227, 0.118); // #5C3A1E
  const gris = rgb(0.549, 0.478, 0.369); // #8C7A5E
  const blanc = rgb(1, 1, 1);
  const ambrefonce = rgb(0.239, 0.125, 0.031); // #3D2008

  // ── Bandeau de tête
  page.drawRectangle({ x: 0, y: height - 80, width, height: 80, color: ambrefonce });
  page.drawText("FINIDY Research Center", {
    x: 40, y: height - 35,
    size: 14, font: fontBold, color: or,
  });
  page.drawText("SAONTSY — Sciences Humaines & Sociales · Madagascar", {
    x: 40, y: height - 55,
    size: 8, font: fontRegular, color: blanc,
  });

  // ── Ligne décorative
  page.drawRectangle({ x: 40, y: height - 90, width: width - 80, height: 2, color: or });

  // ── Titre
  let y = height - 130;
  const titreLines = wrapText(spec.titre, 70);
  for (const line of titreLines) {
    page.drawText(line, { x: 40, y, size: 14, font: fontBold, color: ambrefonce });
    y -= 20;
  }
  y -= 10;

  // ── Auteur
  page.drawText(spec.auteur, { x: 40, y, size: 11, font: fontBold, color: brun });
  y -= 18;

  // ── Métadonnées
  const meta = [
    spec.revue,
    spec.annee ? `© ${spec.annee}` : null,
    spec.doi ? `DOI : ${spec.doi}` : null,
  ].filter(Boolean).join("   ·   ");

  page.drawText(meta, { x: 40, y, size: 8, font: fontRegular, color: gris });
  y -= 30;

  // ── Ligne séparatrice
  page.drawRectangle({ x: 40, y, width: width - 80, height: 1, color: rgb(0.85, 0.8, 0.7) });
  y -= 20;

  // ── Label "Résumé"
  page.drawText("Résumé", { x: 40, y, size: 11, font: fontBold, color: or });
  y -= 20;

  // ── Corps du résumé
  const paragraphs = spec.resume.split("\n").filter(Boolean);
  for (const para of paragraphs) {
    const lines = wrapText(para, 85);
    for (const line of lines) {
      if (y < 80) break; // sécurité bas de page
      page.drawText(line, { x: 40, y, size: 10, font: fontRegular, color: brun });
      y -= 15;
    }
    y -= 8; // espace entre paragraphes
  }

  // ── Pied de page
  page.drawRectangle({ x: 0, y: 0, width, height: 40, color: rgb(0.96, 0.93, 0.85) });
  page.drawText("Ce document est un extrait/résumé fourni à des fins d'information. · finidy.mg", {
    x: 40, y: 15, size: 7, font: fontRegular, color: gris,
  });

  return await doc.save();
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n🖼️  Téléchargement des images Unsplash...\n");

  const dirs = [
    "uploads/entretiens",
    "uploads/couvertures",
    "uploads/articles-pdf",
    "uploads/extraits",
    "uploads/avatars",
    "uploads/cours",
    "uploads/colloques",
    "uploads/cv",
  ];
  for (const d of dirs) ensureDir(path.join(ROOT, d));

  let imgOk = 0, imgFail = 0;
  for (const img of IMAGES) {
    const dest = path.join(ROOT, img.dest);
    const isAvatar = img.dest.startsWith("uploads/avatars/");
    const isLandscape = img.dest.startsWith("uploads/cours/") || img.dest.startsWith("uploads/colloques/");
    const url = isAvatar
      ? picsumUrl(img.seed, 400, 400)
      : isLandscape
        ? picsumUrl(img.seed, 1280, 720)
        : picsumUrl(img.seed);
    try {
      await downloadFile(url, dest);
      console.log(`   ✅ ${img.label}`);
      imgOk++;
    } catch (err) {
      console.log(`   ❌ ${img.label} — ${(err as Error).message}`);
      imgFail++;
    }
  }

  console.log(`\n   Images : ${imgOk} ok, ${imgFail} échecs\n`);
  console.log("📄  Génération des PDFs...\n");

  let pdfOk = 0;
  for (const spec of [...PDFS, ...EXTRA_PDFS]) {
    const dest = path.join(ROOT, spec.dest);
    if (fs.existsSync(dest)) {
      console.log(`   ⏭  Déjà présent : ${path.basename(dest)}`);
      pdfOk++;
      continue;
    }
    try {
      const bytes = await generatePdf(spec, dest);
      fs.writeFileSync(dest, bytes);
      console.log(`   ✅ ${path.basename(dest)}`);
      pdfOk++;
    } catch (err) {
      console.log(`   ❌ ${path.basename(dest)} — ${(err as Error).message}`);
    }
  }

  console.log(`\n   PDFs : ${pdfOk}/${PDFS.length + EXTRA_PDFS.length} générés`);
  console.log("\n✨  Assets terminés.\n");
}

main().catch(console.error);
