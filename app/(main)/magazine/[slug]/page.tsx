import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Clock, Eye, Feather, Share2 } from "lucide-react";
import type { Discipline } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { DISCIPLINES_LABELS } from "@/lib/disciplines";

async function getArticle(slug: string) {
  try {
    const article = await prisma.article.findUnique({
      where: { slug, statut: "PUBLIE" },
      include: { auteur: { select: { name: true, institution: true, bio: true, image: true } } },
    });
    if (!article) return null;
    void prisma.article.update({ where: { id: article.id }, data: { vues: { increment: 1 } } }).catch((error) => console.error("Compteur article", error));
    return article;
  } catch {
    return null;
  }
}

async function getRelated(discipline: Discipline, excludeId: string) {
  try {
    return await prisma.article.findMany({
      where: { statut: "PUBLIE", discipline, id: { not: excludeId } },
      include: { auteur: { select: { name: true } } },
      take: 3,
      orderBy: { publishedAt: "desc" },
    });
  } catch {
    return [];
  }
}

function readingTime(contenu: string) {
  return Math.max(1, Math.round(contenu.trim().split(/\s+/).length / 200));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({ where: { slug, statut: "PUBLIE" }, select: { titre: true, chapeau: true, imageUrl: true, auteur: { select: { name: true } } } });
  if (!article) return { title: "Article introuvable | FINIDY Research Center" };
  return {
    title: `${article.titre} | Magazine FINIDY`,
    description: article.chapeau,
    authors: [{ name: article.auteur.name }],
    openGraph: { title: article.titre, description: article.chapeau, type: "article" as const, images: article.imageUrl ? [article.imageUrl] : [] },
  };
}

export default async function ArticleMagazinePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();
  const related = await getRelated(article.discipline, article.id);
  const publishedDate = article.publishedAt || article.createdAt;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.titre,
    description: article.chapeau,
    image: article.imageUrl ? `https://finidy.mg${article.imageUrl}` : undefined,
    author: { "@type": "Person", name: article.auteur.name },
    publisher: { "@type": "Organization", name: "FINIDY Research Center", url: "https://finidy.mg" },
    datePublished: publishedDate.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    mainEntityOfPage: `https://finidy.mg/magazine/${article.slug}`,
  };

  return (
    <main className="min-h-screen bg-nihary-ecru">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="border-b border-nihary-sable-fonce bg-nihary-gradient">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <Link href="/magazine#articles" className="mb-8 inline-flex items-center gap-2 text-sm text-nihary-gris hover:text-nihary-or"><ArrowLeft size={15} />Retour au magazine</Link>
          <span className="eyebrow">{DISCIPLINES_LABELS[article.discipline] || article.discipline}</span>
          <h1 className="mt-3 max-w-4xl font-display text-4xl font-bold leading-[1.12] text-nihary-ambre-fonce sm:text-5xl">{article.titre}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-nihary-brun">{article.chapeau}</p>
          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-nihary-gris">
            <span className="font-medium text-nihary-ambre-fonce">Par {article.auteur.name}</span>
            <span className="flex items-center gap-1.5"><CalendarDays size={14} />{publishedDate.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
            <span className="flex items-center gap-1.5"><Clock size={14} />{readingTime(article.contenu)} min</span>
            <span className="flex items-center gap-1.5"><Eye size={14} />{article.vues.toLocaleString("fr-FR")} vues</span>
          </div>
        </div>
      </header>

      {article.imageUrl && <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8"><div className="relative aspect-[16/8] overflow-hidden rounded-xl border border-nihary-sable-fonce bg-nihary-sable shadow-nihary-sm"><Image src={article.imageUrl} alt={article.titre} fill priority className="object-cover" sizes="(max-width: 1152px) 100vw, 1152px" /></div></div>}

      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_220px] lg:px-8 lg:py-14">
        <article>
          <div className="prose-nihary whitespace-pre-wrap font-body text-[17px] leading-8 text-nihary-brun first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:font-display first-letter:text-6xl first-letter:font-bold first-letter:leading-[.8] first-letter:text-nihary-or">{article.contenu}</div>

          {article.tags.length > 0 && <div className="mt-10 flex flex-wrap gap-2 border-t border-nihary-sable-fonce pt-6">{article.tags.map((tag) => <span key={tag} className="badge">#{tag}</span>)}</div>}

          <section className="card mt-10 p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-nihary-or-pale">
                {article.auteur.image ? <Image src={article.auteur.image} alt={article.auteur.name || "Auteur FINIDY"} fill className="object-cover object-top" sizes="64px" /> : <div className="flex h-full items-center justify-center font-display text-xl font-bold text-nihary-ambre">{article.auteur.name?.charAt(0) || "?"}</div>}
              </div>
              <div className="flex-1"><p className="text-xs uppercase tracking-wider text-nihary-or">À propos de l’auteur</p><h2 className="mt-1 font-display text-lg font-semibold text-nihary-ambre-fonce">{article.auteur.name}</h2>{article.auteur.institution && <p className="text-xs text-nihary-gris">{article.auteur.institution}</p>}{article.auteur.bio && <p className="mt-2 line-clamp-3 text-sm leading-6 text-nihary-brun">{article.auteur.bio}</p>}</div>
            </div>
          </section>
        </article>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="card p-4"><p className="mb-3 text-xs font-medium uppercase tracking-wider text-nihary-gris">Vous appréciez cet article ?</p><a href={`mailto:?subject=${encodeURIComponent(article.titre)}&body=${encodeURIComponent(`À lire sur FINIDY : https://finidy.mg/magazine/${article.slug}`)}`} className="btn-outline"><Share2 size={15} />Partager</a></div>
          <div className="card-sable p-4"><Feather size={18} className="mb-2 text-nihary-or" /><h2 className="font-display font-semibold text-nihary-ambre-fonce">Écrire pour FINIDY</h2><p className="mt-1 text-xs leading-5 text-nihary-gris">Partagez une analyse ou un récit de terrain avec nos lecteurs.</p><Link href="/magazine/proposer" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-nihary-or hover:underline">Proposer un article <ArrowRight size={12} /></Link></div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="border-t border-nihary-sable-fonce bg-white/60">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-end justify-between"><div><span className="eyebrow">Poursuivre la lecture</span><h2 className="mt-1 font-display text-2xl font-bold text-nihary-ambre-fonce">Dans la même thématique</h2></div><Link href="/magazine#articles" className="hidden items-center gap-1 text-sm text-nihary-or hover:underline sm:flex">Tout le magazine <ArrowRight size={14} /></Link></div>
            <div className="grid gap-5 sm:grid-cols-3">{related.map((item) => <article key={item.id} className="card group overflow-hidden"><Link href={`/magazine/${item.slug}`} className="relative block aspect-[16/9] overflow-hidden bg-nihary-sable">{item.imageUrl ? <Image src={item.imageUrl} alt={item.titre} fill className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" sizes="(max-width: 640px) 100vw, 33vw" /> : <div className="flex h-full items-center justify-center"><Feather className="text-nihary-or" /></div>}</Link><div className="p-4"><h3 className="line-clamp-2 font-display font-semibold text-nihary-ambre-fonce"><Link href={`/magazine/${item.slug}`} className="hover:text-nihary-or">{item.titre}</Link></h3><p className="mt-2 text-xs text-nihary-gris">{item.auteur.name} · {readingTime(item.contenu)} min</p><Link href={`/magazine/${item.slug}`} className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-nihary-or">Lire l’article <ArrowRight size={12} /></Link></div></article>)}</div>
          </div>
        </section>
      )}
    </main>
  );
}
