import Link from "next/link";
import { ScrollText, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";

const DISCIPLINES_LABELS: Record<string, string> = {
  SOCIOLOGIE: "Sociologie",
  ANTHROPOLOGIE: "Anthropologie",
  HISTOIRE: "Histoire",
  GEOGRAPHIE_HUMAINE: "Géographie humaine",
  ECONOMIE: "Économie",
  DROIT: "Droit",
  SCIENCE_POLITIQUE: "Science politique",
  PHILOSOPHIE: "Philosophie",
  PSYCHOLOGIE_SOCIALE: "Psychologie sociale",
  SCIENCES_EDUCATION: "Sciences de l'éducation",
  LINGUISTIQUE: "Linguistique",
  COMMUNICATION: "Communication",
  DEMOGRAPHIE: "Démographie",
  ETUDES_GENRE: "Études de genre",
  ETUDES_MALGACHES: "Études malgaches",
  RELATIONS_INTERNATIONALES: "Relations internationales",
};

async function getArticles() {
  try {
    return await prisma.articleRevue.findMany({
      where: { statut: "PUBLIE" },
      include: { auteur: { select: { name: true, institution: true } } },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  } catch {
    return [];
  }
}

export const metadata = {
  title: "SAONTSY — Revue scientifique | FINIDY Research Center",
  description:
    "SAONTSY est la revue scientifique peer-reviewed du FINIDY Research Center, dédiée aux contributions des chercheurs en Sciences Humaines et Sociales de Madagascar et de l'Océan Indien — Malgache dans tout ses états.",
  keywords: ['revue scientifique Madagascar', 'peer review SHS', 'SAONTSY', 'FINIDY Research Center', 'article de recherche', 'sciences humaines Madagascar'],
  openGraph: {
    title: "SAONTSY — Revue scientifique FINIDY Research Center",
    description: "Articles de recherche peer-reviewed en Sciences Humaines et Sociales de Madagascar.",
    type: 'website' as const,
    url: 'https://finidy.mg/revue',
  },
  alternates: { canonical: 'https://finidy.mg/revue' },
};

export default async function RevuePage() {
  const articles = await getArticles();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="eyebrow">Revue scientifique · FINIDY Research Center</span>
          <h1 className="font-display font-bold text-display-md text-nihary-ambre-fonce mt-1">
            SAONTSY
          </h1>
          <p className="font-display italic text-nihary-brun mt-0.5 text-lg">
            Malgache dans tout ses états
          </p>
          <p className="text-nihary-gris font-body mt-2">
            Contributions des chercheurs au sein du FINIDY Research Center et ses collaborateurs
          </p>
        </div>
        <Link href="/revue/soumettre" className="btn-primary flex-shrink-0">
          <Plus size={16} strokeWidth={2} />
          Soumettre un article
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="card-sable p-16 text-center">
          <div className="flex justify-center mb-4 text-nihary-ambre">
            <ScrollText size={48} strokeWidth={1.25} />
          </div>
          <h2 className="font-display font-semibold text-xl text-nihary-ambre-fonce mb-2">
            Aucun article publié pour l'instant
          </h2>
          <p className="text-nihary-gris font-body mb-6">
            FINIDY Research Center vient d'ouvrir. Soyez parmi les premiers auteurs de la revue.
          </p>
          <Link href="/revue/soumettre" className="btn-primary">
            Soumettre le premier article
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {articles.map((article) => (
            <div key={article.id} className="card p-6">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="badge">
                  {DISCIPLINES_LABELS[article.discipline] || article.discipline}
                </span>
                <span className="badge">{article.langue}</span>
                {article.accesLibre && (
                  <span className="badge-libre">Accès libre</span>
                )}
              </div>
              <h2 className="font-display font-semibold text-lg text-nihary-ambre-fonce mb-1 group-hover:text-nihary-or transition-colors">
                <Link href={`/revue/${article.id}`} className="hover:text-nihary-or">{article.titre}</Link>
              </h2>
              <p className="text-sm text-nihary-gris font-body mb-2">
                {article.auteur.name}
                {article.auteur.institution &&
                  ` · ${article.auteur.institution}`}
              </p>
              <p className="text-sm text-nihary-brun font-body line-clamp-2 mb-3">
                {article.resume}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-nihary-gris font-body">
                  {article.volume && <span>Vol.&nbsp;{article.volume}{article.numero ? ` · n°${article.numero}` : ''}</span>}
                  {article.doi && <span className="font-mono">DOI: {article.doi}</span>}
                </div>
                <Link href={`/revue/${article.id}`} className="btn-outline text-xs px-3 py-1.5">
                  Lire →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
