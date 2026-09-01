import Link from "next/link";
import { FileText, Users2, Landmark, PenSquare } from "lucide-react";
import PilierCard from "@/components/shared/PilierCard";
import { PILIERS } from "@/lib/piliers";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Recherche et engagement citoyen à Madagascar",
  description: "FINIDY Research Center est un écosystème de recherche et d’engagement citoyen pour le devenir de la société malgache : revue SAONTSY, édition, université populaire, média, colloques et consultance.",
};

const HOME_PILIER_ORDER = ["revue", "editions", "universite-populaire", "magazine", "entretiens", "colloques", "consultance"];

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
            <span className="eyebrow block mb-4">Recherche · Société malgache · Engagement citoyen</span>
            <h1
              className="font-display font-bold leading-tight mb-6 text-nihary-ambre-fonce"
              style={{
                fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
                letterSpacing: "-0.02em",
              }}
            >
              Comprendre la société malgache pour éclairer son devenir
            </h1>
            <p className="text-lg text-nihary-brun font-body leading-relaxed mb-8 max-w-2xl">
              FINIDY Research Center est un écosystème de recherche et d’engagement citoyen. Il réunit chercheurs, universitaires, communautés et organisations pour produire des connaissances rigoureuses, accessibles et porteuses d’espoir pour Madagascar.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/revue" className="btn-primary text-base px-6 py-3">
                Découvrir la revue SAONTSY
              </Link>
              <Link
                href="/auth/inscription"
                className="btn-outline text-base px-6 py-3"
              >
                Rejoindre FINIDY
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-nihary-ambre-fonce via-nihary-or to-nihary-ambre-fonce" />
      </section>

      <section className="border-y border-nihary-sable-fonce bg-white/60">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:px-8">
          <div><span className="eyebrow">Notre mission</span><h2 className="mt-2 text-3xl font-bold text-nihary-ambre-fonce">Science, bien-être et rayonnement</h2></div>
          <div className="space-y-4 leading-7 text-nihary-brun"><p>Notre mission est de réconcilier conscience scientifique, bonheur de la Grande Île et rayonnement international de la société malgache grâce à des programmes de recherche et de dissémination scientifique aussi accessibles que possible.</p><p>Nous travaillons avec les communautés malgaches, cultivons l’esprit critique et offrons une tribune aux acteurs scientifiques qui rendent intelligibles les enjeux de la restructuration de la société.</p><Link href="/a-propos" className="inline-block text-sm font-medium text-nihary-or hover:underline">En savoir plus sur FINIDY Research Center</Link></div>
        </div>
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
            Revue scientifique, édition, université populaire, magazine, média, colloque international et consultance : sept activités au service d’un même projet de société.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...PILIERS].sort((a,b)=>HOME_PILIER_ORDER.indexOf(a.id)-HOME_PILIER_ORDER.indexOf(b.id)).map((p) => (
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
          <span className="eyebrow text-nihary-or">Rejoindre FINIDY Research Center</span>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-white mt-2 mb-4">
            Faites vivre la recherche au service de la société malgache
          </h2>
          <p className="text-nihary-gris-clair font-body mb-8 max-w-xl mx-auto">
            Soumettez un article à la revue trimestrielle SAONTSY, proposez un cours, partagez une étude ou rejoignez notre réseau d’experts en sciences humaines et sociales.
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
