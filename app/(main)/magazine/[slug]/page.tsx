import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Eye, Share2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DISCIPLINES_LABELS } from "@/lib/disciplines";

async function getArticle(slug: string) {
  try {
    const article = await prisma.article.findUnique({
      where: { slug, statut: "PUBLIE" },
      include: {
        auteur: { select: { name: true, institution: true, bio: true } },
      },
    });
    if (!article) return null;

    // Incrément réel du compteur de vues — pas une statistique fictive
    void prisma.article.update({
      where: { id: article.id },
      data: { vues: { increment: 1 } },
    }).catch((error) => console.error("Compteur article", error));

    return article;
  } catch {
    return null;
  }
}

async function getRelated(discipline: string, excludeId: string) {
  try {
    return await prisma.article.findMany({
      where: {
        statut: "PUBLIE",
        discipline: discipline as any,
        id: { not: excludeId },
      },
      take: 3,
      orderBy: { publishedAt: "desc" },
    });
  } catch {
    return [];
  }
}

function readingTime(contenu: string): number {
  const words = contenu.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug, statut: "PUBLIE" },
    select: { titre: true, chapeau: true },
  });
  if (!article) return { title: "Article introuvable | FINIDY Research Center" };
  return { title: `${article.titre} | FINIDY Research Center`, description: article.chapeau };
}

export default async function ArticleMagazinePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) notFound();

  const related = await getRelated(article.discipline, article.id);

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link
          href="/magazine"
          className="text-sm font-body text-nihary-or hover:underline"
        >
          ← Retour au magazine
        </Link>
      </div>

      <span className="badge mb-4">
        {DISCIPLINES_LABELS[article.discipline] || article.discipline}
      </span>

      <h1 className="font-display font-bold text-display-md text-nihary-ambre-fonce mb-4 leading-tight">
        {article.titre}
      </h1>

      <p className="text-lg text-nihary-brun font-body mb-6 leading-relaxed">
        {article.chapeau}
      </p>

      <div
        className="flex flex-wrap items-center gap-4 pb-6 mb-8 border-b border-nihary-sable-fonce
        text-sm text-nihary-gris font-body"
      >
        <div>
          <span className="font-medium text-nihary-ambre-fonce">
            {article.auteur.name}
          </span>
          {article.auteur.institution && (
            <span> · {article.auteur.institution}</span>
          )}
        </div>
        <span className="flex items-center gap-1">
          <Clock size={14} strokeWidth={1.75} /> {readingTime(article.contenu)}{" "}
          min de lecture
        </span>
        <span className="flex items-center gap-1">
          <Eye size={14} strokeWidth={1.75} /> {article.vues} vues
        </span>
      </div>

      {article.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.imageUrl}
          alt={article.titre}
          className="w-full rounded-lg mb-8 border border-nihary-sable-fonce"
        />
      )}

      <div className="prose-nihary font-body text-nihary-brun leading-relaxed whitespace-pre-wrap">
        {article.contenu}
      </div>

      {article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-nihary-sable-fonce">
          {article.tags.map((tag) => (
            <span key={tag} className="badge">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 mt-6">
        <Share2 size={16} strokeWidth={1.75} className="text-nihary-gris" />
        <span className="text-sm text-nihary-gris font-body">
          Partager cet article
        </span>
      </div>

      {related.length > 0 && (
        <div className="mt-14 pt-8 border-t border-nihary-sable-fonce">
          <h2 className="font-display font-semibold text-lg text-nihary-ambre-fonce mb-4">
            Articles liés
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {related.map((a) => (
              <Link
                key={a.id}
                href={`/magazine/${a.slug}`}
                className="card p-4"
              >
                <h3
                  className="font-display font-medium text-sm text-nihary-ambre-fonce
                  hover:text-nihary-or line-clamp-2"
                >
                  {a.titre}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
