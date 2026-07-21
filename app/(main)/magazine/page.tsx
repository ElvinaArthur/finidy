import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Feather,
  Lightbulb,
  PenLine,
  PackageCheck,
  Plus,
  Sparkles,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DISCIPLINES_LABELS } from "@/lib/disciplines";

async function getArticles() {
  try {
    return await prisma.article.findMany({
      where: { statut: "PUBLIE" },
      include: { auteur: { select: { name: true, institution: true, image: true } } },
      orderBy: { publishedAt: "desc" },
      take: 13,
    });
  } catch {
    return [];
  }
}

function readingTime(contenu: string) {
  return Math.max(1, Math.round(contenu.trim().split(/\s+/).length / 200));
}

export const metadata = {
  title: "Magazine | FINIDY Research Center",
  description: "Analyses, décryptages et grands récits sur les enjeux des Sciences Humaines et Sociales à Madagascar et dans l'Océan Indien.",
  keywords: ["magazine SHS Madagascar", "analyse sociologie", "FINIDY magazine", "décryptage Océan Indien"],
  openGraph: {
    title: "Magazine — FINIDY Research Center",
    description: "Comprendre les transformations de Madagascar avec le regard des sciences humaines et sociales.",
    type: "website" as const,
    url: "https://finidy.mg/magazine",
  },
  alternates: { canonical: "https://finidy.mg/magazine" },
};

export default async function MagazinePage() {
  const articles = await getArticles();
  const [featured, ...rest] = articles;

  return (
    <main>
      <section className="border-b border-nihary-sable-fonce bg-nihary-gradient">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:px-8 lg:py-16">
          <div>
            <span className="eyebrow">Idées · Terrains · Débats</span>
            <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-tight text-nihary-ambre-fonce sm:text-5xl">
              Le magazine qui éclaire les transformations de nos sociétés
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-nihary-brun sm:text-lg">
              Des chercheurs rendent accessibles leurs travaux pour mieux comprendre Madagascar, l’Océan Indien et les grands enjeux contemporains.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="#articles" className="btn-primary"><BookOpen size={16} />Lire le magazine</Link>
              <Link href="/magazine/proposer" className="btn-outline"><Plus size={16} />Proposer un article</Link>
              <Link href="/commander?type=MAGAZINE&titre=Magazine%20FINIDY%20%E2%80%94%20%C3%A9dition%20papier" className="btn-outline"><PackageCheck size={16} />Version papier</Link>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-xs text-nihary-gris">
              <span className="flex items-center gap-1.5"><Feather size={14} className="text-nihary-or" />Écrit par des spécialistes</span>
              <span className="flex items-center gap-1.5"><Lightbulb size={14} className="text-nihary-or" />Accessible sans jargon</span>
              <span className="flex items-center gap-1.5"><Sparkles size={14} className="text-nihary-or" />Lecture libre</span>
            </div>
          </div>

          {featured ? (
            <article className="card group overflow-hidden">
              <Link href={`/magazine/${featured.slug}`} className="relative block h-56 overflow-hidden bg-nihary-sable">
                {featured.imageUrl ? <Image src={featured.imageUrl} alt={featured.titre} fill priority className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" sizes="(max-width: 1024px) 100vw, 40vw" /> : <div className="flex h-full items-center justify-center"><PenLine size={42} className="text-nihary-or" /></div>}
                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-nihary-ambre shadow-sm">À la une</span>
              </Link>
              <div className="p-5 sm:p-6">
                <span className="eyebrow">{DISCIPLINES_LABELS[featured.discipline] || featured.discipline}</span>
                <h2 className="mt-2 line-clamp-2 font-display text-xl font-bold leading-snug text-nihary-ambre-fonce"><Link href={`/magazine/${featured.slug}`} className="hover:text-nihary-or">{featured.titre}</Link></h2>
                <div className="mt-4 flex items-center justify-between gap-3 text-xs text-nihary-gris"><span>{featured.auteur.name}</span><span className="flex items-center gap-1"><Clock size={12} />{readingTime(featured.contenu)} min</span></div>
              </div>
            </article>
          ) : (
            <div className="card-sable flex min-h-72 items-center justify-center p-8 text-center"><div><PenLine className="mx-auto mb-3 text-nihary-or" size={40} /><p className="font-display text-xl font-semibold text-nihary-ambre-fonce">Les premiers récits arrivent bientôt.</p></div></div>
          )}
        </div>
      </section>

      <div id="articles" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        {articles.length === 0 ? (
          <div className="card-sable p-14 text-center"><PenLine className="mx-auto mb-4 text-nihary-or" size={44} /><h2 className="font-display text-xl font-semibold text-nihary-ambre-fonce">Aucun article publié pour l’instant</h2><p className="mt-2 text-nihary-gris">Soyez parmi les premières plumes publiées dans le magazine FINIDY.</p><Link href="/magazine/proposer" className="btn-primary mt-6">Proposer le premier article</Link></div>
        ) : (
          <>
            <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div><span className="eyebrow">Dernières publications</span><h2 className="mt-1 font-display text-2xl font-bold text-nihary-ambre-fonce">À lire maintenant</h2></div>
              <p className="text-sm text-nihary-gris">{articles.length} analyses et récits</p>
            </div>

            {rest.length > 0 && (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((article) => (
                  <article key={article.id} className="card group flex h-full flex-col overflow-hidden">
                    <Link href={`/magazine/${article.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-nihary-sable">
                      {article.imageUrl ? <Image src={article.imageUrl} alt={article.titre} fill className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" /> : <div className="flex h-full items-center justify-center"><PenLine size={30} className="text-nihary-or" /></div>}
                    </Link>
                    <div className="flex flex-1 flex-col p-5">
                      <span className="eyebrow">{DISCIPLINES_LABELS[article.discipline] || article.discipline}</span>
                      <h3 className="mt-2 line-clamp-2 font-display text-lg font-semibold leading-snug text-nihary-ambre-fonce"><Link href={`/magazine/${article.slug}`} className="hover:text-nihary-or">{article.titre}</Link></h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-nihary-gris">{article.chapeau}</p>
                      <div className="mt-auto flex items-center justify-between gap-3 border-t border-nihary-sable-fonce pt-4 text-xs text-nihary-gris"><span>{article.auteur.name}</span><span className="flex items-center gap-1"><Clock size={12} />{readingTime(article.contenu)} min</span></div>
                      <Link href={`/magazine/${article.slug}`} className="btn-outline mt-4 w-full justify-center">Lire l’article <ArrowRight size={14} /></Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}

        <section className="mt-14 rounded-xl bg-nihary-ambre-fonce px-6 py-8 text-white sm:px-9 sm:py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-xs font-medium uppercase tracking-[0.18em] text-nihary-or-clair">Une recherche à partager ?</p><h2 className="mt-2 font-display text-2xl font-semibold">Transformez votre expertise en un article accessible</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">Proposez une analyse, un décryptage ou un récit de terrain à la rédaction FINIDY.</p></div><Link href="/magazine/proposer" className="btn-primary shrink-0"><Plus size={16} />Proposer un article</Link></div>
        </section>
      </div>
    </main>
  );
}
