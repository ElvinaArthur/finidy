import Link from "next/link";
import { FileText, Users2, Landmark, PenSquare } from "lucide-react";
import PilierCard from "@/components/shared/PilierCard";
import { PILIERS } from "@/lib/piliers";
import { prisma } from "@/lib/prisma";

const PILIER_COUNT_LABELS: Record<string, string> = {
  revue: "articles publiés",
  consultance: "experts disponibles",
  magazine: "articles magazine",
  entretiens: "entretiens",
  editions: "ouvrages",
  colloques: "colloques",
  "universite-populaire": "cours",
};

async function getStats() {
  try {
    const [articlesRevue, articlesMagazine, entretiens, livres, colloques, cours, experts, utilisateurs] =
      await Promise.all([
        prisma.articleRevue.count({ where: { statut: "PUBLIE" } }),
        prisma.article.count({ where: { statut: "PUBLIE" } }),
        prisma.entretien.count({ where: { statut: "PUBLIE" } }),
        prisma.livre.count({ where: { statut: "PUBLIE" } }),
        prisma.colloque.count(),
        prisma.cours.count({ where: { statut: "PUBLIE" } }),
        prisma.expertProfile.count({ where: { disponible: true } }),
        prisma.user.count(),
      ]);

    return { articlesRevue, articlesMagazine, entretiens, livres, colloques, cours, experts, utilisateurs };
  } catch {
    return {
      articlesRevue: 0,
      articlesMagazine: 0,
      entretiens: 0,
      livres: 0,
      colloques: 0,
      cours: 0,
      experts: 0,
      utilisateurs: 0,
    };
  }
}

export default async function HomePage() {
  const stats = await getStats();

  const countMap: Record<string, number> = {
    revue: stats.articlesRevue,
    consultance: stats.experts,
    magazine: stats.articlesMagazine,
    entretiens: stats.entretiens,
    editions: stats.livres,
    colloques: stats.colloques,
    "universite-populaire": stats.cours,
  };

  return (
    <div className="bg-nihary-ecru">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-nihary-sable border-b border-nihary-sable-fonce">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg, #7A4A10 0, #7A4A10 1px, transparent 0, transparent 50%
            )`,
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <span className="eyebrow block mb-4">
              Madagascar · Océan Indien · Afrique
            </span>
            <h1
              className="font-display font-bold leading-tight mb-6 text-nihary-ambre-fonce"
              style={{
                fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
                letterSpacing: "-0.02em",
              }}
            >
              La plateforme de référence en{" "}
              <span className="text-nihary-or">
                Sciences Humaines & Sociales
              </span>
            </h1>
            <p className="text-lg text-nihary-brun font-body leading-relaxed mb-8 max-w-2xl">
              Nihary — <em>celui qui contemple</em> — réunit chercheurs, auteurs
              et praticiens autour d'un écosystème scientifique complet : revue
              peer-reviewed, magazine, consultance, édition, colloques et
              formation.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/revue" className="btn-primary text-base px-6 py-3">
                Explorer la Revue
              </Link>
              <Link
                href="/auth/inscription"
                className="btn-outline text-base px-6 py-3"
              >
                Devenir auteur
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-nihary-ambre-fonce via-nihary-or to-nihary-ambre-fonce" />
      </section>

      {/* ── CHIFFRES ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              value: stats.articlesRevue + stats.articlesMagazine,
              label: "Publications",
              icon: FileText,
            },
            { value: stats.experts, label: "Experts", icon: Users2 },
            { value: stats.colloques, label: "Colloques", icon: Landmark },
            {
              value: stats.utilisateurs,
              label: "Auteurs inscrits",
              icon: PenSquare,
            },
          ].map((s) => (
            <div key={s.label} className="card-sable p-5 text-center">
              <div className="flex justify-center mb-2 text-nihary-ambre">
                <s.icon size={24} strokeWidth={1.75} />
              </div>
              <div className="font-display font-bold text-2xl text-nihary-ambre-fonce">
                {s.value}
              </div>
              <div className="text-xs font-mono tracking-wider uppercase text-nihary-gris mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7 PILIERS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mb-8">
          <span className="eyebrow">Notre écosystème</span>
          <h2 className="font-display font-bold text-display-md text-nihary-ambre-fonce mt-1">
            Sept piliers, un projet commun
          </h2>
          <p className="text-nihary-gris font-body mt-2 max-w-xl">
            De la recherche fondamentale à la vulgarisation, de la formation à
            la consultance — Nihary couvre tout le cycle de la connaissance en
            SHS.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {PILIERS.map((p) => (
            <PilierCard
              key={p.href}
              icon={p.icon}
              titre={p.label}
              description={p.description}
              href={p.href}
              count={countMap[p.id] ?? 0}
              countLabel={PILIER_COUNT_LABELS[p.id]}
            />
          ))}
        </div>
      </section>

      {/* ── CTA SOUMETTRE ── */}
      <section className="bg-nihary-ambre-fonce border-t border-nihary-ambre/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <span className="eyebrow text-nihary-or">Rejoindre Nihary</span>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-white mt-2 mb-4">
            Vos travaux méritent d'être lus.
          </h2>
          <p className="text-nihary-gris-clair font-body mb-8 max-w-xl mx-auto">
            Soumettez un article, proposez un cours, présentez vos recherches —
            Nihary est la tribune des chercheurs en SHS de Madagascar et de
            l'Océan Indien.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/revue/soumettre" className="btn-primary">
              Soumettre un article
            </Link>
            <Link
              href="/auth/inscription"
              className="btn-outline border-nihary-or text-nihary-or hover:bg-nihary-ambre"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
