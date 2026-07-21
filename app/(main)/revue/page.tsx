import Link from "next/link";
import { BadgeCheck, BookOpen, MapPin, PackageCheck, Plus, ScrollText } from "lucide-react";
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
    "SAONTSY est la revue scientifique peer-reviewed du FINIDY Research Center, dédiée aux contributions des chercheurs en Sciences Humaines et Sociales de Madagascar et de l'Océan Indien — Le Malgache dans tous ses états.",
  keywords: ['revue scientifique Madagascar', 'peer review SHS', 'SAONTSY', 'FINIDY Research Center', 'article de recherche', 'sciences humaines Madagascar'],
  openGraph: {
    title: "SAONTSY — Revue scientifique FINIDY Research Center",
    description: "Articles de recherche peer-reviewed en Sciences Humaines et Sociales de Madagascar.",
    type: 'website' as const,
    url: 'https://finidy.mg/revue',
  },
  alternates: { canonical: 'https://finidy.mg/revue' },
  other: { ISSN: '3080-1842' },
};

export default async function RevuePage() {
  const articles = await getArticles();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex flex-col gap-6 rounded-xl border border-nihary-sable-fonce bg-nihary-gradient p-7 sm:flex-row sm:items-end sm:justify-between sm:p-10">
        <div>
          <span className="eyebrow">Revue scientifique · Évaluation par les pairs</span>
          <h1 className="mt-2 font-display text-4xl font-bold text-nihary-ambre-fonce sm:text-5xl">SAONTSY</h1>
          <p className="font-display italic text-nihary-brun mt-0.5 text-lg">
            Le Malgache dans tous ses états
          </p>
          <p className="mt-3 max-w-2xl text-lg leading-7 text-nihary-brun">La recherche malgache publiée, discutée et désormais disponible en lecture numérique ou en édition papier professionnelle.</p>
        </div>
        <div className="flex flex-wrap gap-3"><Link href="/commander?type=REVUE&titre=SAONTSY%20%E2%80%94%20%C3%A9dition%20papier" className="btn-outline"><PackageCheck size={16} />Commander la revue</Link><Link href="/revue/soumettre" className="btn-primary flex-shrink-0"><Plus size={16} strokeWidth={2} />Soumettre un article</Link></div>
      </div>

      <section className="card-sable p-5 mb-8" aria-label="Informations officielles de la revue">
        <div className="flex items-center gap-2 mb-4">
          <BadgeCheck size={18} className="text-emerald-700" />
          <h2 className="font-display font-semibold text-nihary-ambre-fonce">Notice bibliographique confirmée</h2>
        </div>
        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div><dt className="font-mono text-xs uppercase tracking-wider text-nihary-gris">Identifiants</dt><dd className="mt-1 text-nihary-brun"><strong>ISSN :</strong> 3080-1842</dd><dd className="text-nihary-brun"><strong>ISSN-L :</strong> 3080-1842</dd></div>
          <div><dt className="font-mono text-xs uppercase tracking-wider text-nihary-gris">Titre officiel</dt><dd className="mt-1 font-medium text-nihary-brun">Revue Saontsy</dd><dd className="text-nihary-gris">Titre alternatif : Saontsy</dd></div>
          <div><dt className="font-mono text-xs uppercase tracking-wider text-nihary-gris">Publication</dt><dd className="mt-1 flex items-center gap-1.5 text-nihary-brun"><BookOpen size={14} /> Support : imprimé</dd></div>
          <div><dt className="font-mono text-xs uppercase tracking-wider text-nihary-gris">Pays</dt><dd className="mt-1 flex items-center gap-1.5 text-nihary-brun"><MapPin size={14} /> Madagascar</dd></div>
        </dl>
      </section>

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
