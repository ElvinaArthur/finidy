import Link from "next/link";
import { PenLine, Plus, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DISCIPLINES_LABELS } from "@/lib/disciplines";

async function getArticles() {
  try {
    return await prisma.article.findMany({
      where: { statut: "PUBLIE" },
      include: { auteur: { select: { name: true } } },
      orderBy: { publishedAt: "desc" },
      take: 13,
    });
  } catch {
    return [];
  }
}

function readingTime(contenu: string): number {
  const words = contenu.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export const metadata = {
  title: "Magazine | FINIDY Research Center",
  description:
    "Le magazine du FINIDY Research Center : analyses, décryptages et grands reportages sur les enjeux des Sciences Humaines et Sociales à Madagascar et dans l'Océan Indien.",
  keywords: ['magazine SHS Madagascar', 'analyse sociologie', 'FINIDY magazine', 'décryptage Océan Indien'],
  openGraph: {
    title: "Magazine — FINIDY Research Center",
    description: "Analyses et reportages SHS à Madagascar et dans l'Océan Indien.",
    type: 'website' as const,
    url: 'https://finidy.mg/magazine',
  },
  alternates: { canonical: 'https://finidy.mg/magazine' },
};

export default async function MagazinePage() {
  const articles = await getArticles();
  const [featured, ...rest] = articles;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="eyebrow">Pilier 3</span>
          <h1 className="font-display font-bold text-display-md text-nihary-ambre-fonce mt-1">
            Magazine
          </h1>
          <p className="text-nihary-gris font-body mt-2">
            Vulgarisation et actualité scientifique en Sciences Humaines et
            Sociales
          </p>
        </div>
        <Link href="/magazine/proposer" className="btn-primary flex-shrink-0">
          <Plus size={16} strokeWidth={2} />
          Proposer un article
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="card-sable p-16 text-center">
          <div className="flex justify-center mb-4 text-nihary-ambre">
            <PenLine size={48} strokeWidth={1.25} />
          </div>
          <h2 className="font-display font-semibold text-xl text-nihary-ambre-fonce mb-2">
            Aucun article publié pour l'instant
          </h2>
          <p className="text-nihary-gris font-body mb-6">
            Le magazine FINIDY Research Center vient d'ouvrir. Soyez parmi les premières plumes
            publiées.
          </p>
          <Link href="/magazine/proposer" className="btn-primary">
            Proposer le premier article
          </Link>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Featured */}
          {featured && (
            <Link
              href={`/magazine/${featured.slug}`}
              className="card block overflow-hidden group"
            >
              <div className="grid sm:grid-cols-2">
                <div className="aspect-[16/10] sm:aspect-auto bg-nihary-sable flex items-center justify-center">
                  {featured.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={featured.imageUrl}
                      alt={featured.titre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <PenLine
                      size={40}
                      strokeWidth={1.25}
                      className="text-nihary-or"
                    />
                  )}
                </div>
                <div className="p-6 sm:p-8 flex flex-col justify-center">
                  <span className="badge w-fit mb-3">
                    {DISCIPLINES_LABELS[featured.discipline] ||
                      featured.discipline}
                  </span>
                  <h2
                    className="font-display font-bold text-2xl text-nihary-ambre-fonce mb-3
                    group-hover:text-nihary-or transition-colors"
                  >
                    {featured.titre}
                  </h2>
                  <p className="text-nihary-brun font-body text-sm mb-4 line-clamp-3">
                    {featured.chapeau}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-nihary-gris font-mono">
                    <span>{featured.auteur.name}</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} strokeWidth={2} />{" "}
                      {readingTime(featured.contenu)} min
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Grille */}
          {rest.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map((article) => (
                <Link
                  key={article.id}
                  href={`/magazine/${article.slug}`}
                  className="card overflow-hidden group"
                >
                  <div className="aspect-[16/10] bg-nihary-sable flex items-center justify-center">
                    {article.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={article.imageUrl}
                        alt={article.titre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <PenLine
                        size={28}
                        strokeWidth={1.25}
                        className="text-nihary-or"
                      />
                    )}
                  </div>
                  <div className="p-5">
                    <span className="badge mb-2">
                      {DISCIPLINES_LABELS[article.discipline] ||
                        article.discipline}
                    </span>
                    <h3
                      className="font-display font-semibold text-base text-nihary-ambre-fonce mb-2
                      group-hover:text-nihary-or transition-colors line-clamp-2"
                    >
                      {article.titre}
                    </h3>
                    <p className="text-sm text-nihary-gris font-body mb-3 line-clamp-2">
                      {article.chapeau}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-nihary-gris-clair font-mono">
                      <span>{article.auteur.name}</span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} strokeWidth={2} />{" "}
                        {readingTime(article.contenu)} min
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
