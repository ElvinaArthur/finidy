import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, FileText, Headphones, Mic, Play, Plus, Radio, Video } from "lucide-react";
import type { FormatEntretien } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { DISCIPLINES_LABELS } from "@/lib/disciplines";

const FORMAT_META: Record<FormatEntretien, { label: string; icon: typeof Mic }> = {
  PODCAST: { label: "Podcast", icon: Mic },
  VIDEO: { label: "Vidéo", icon: Video },
  TEXTE: { label: "Entretien écrit", icon: FileText },
};

const isFormat = (value?: string): value is FormatEntretien => Boolean(value && value in FORMAT_META);

async function getEntretiens(format?: FormatEntretien) {
  try {
    return await prisma.entretien.findMany({
      where: { statut: "PUBLIE", ...(format ? { format } : {}) },
      include: { auteur: { select: { name: true, institution: true, image: true } } },
      orderBy: { publishedAt: "desc" },
      take: 30,
    });
  } catch {
    return [];
  }
}

export const metadata = {
  title: "Entretiens, vidéos & podcasts | FINIDY Research Center",
  description: "Écoutez et regardez les chercheurs, experts et praticiens qui analysent Madagascar et l'Océan Indien.",
  keywords: ["entretien chercheur Madagascar", "vidéo SHS", "interview sociologue", "podcast sciences humaines"],
  openGraph: { title: "Entretiens — FINIDY Research Center", description: "Des conversations de fond avec les voix de la recherche.", type: "website" as const, url: "https://finidy.mg/entretiens" },
  alternates: { canonical: "https://finidy.mg/entretiens" },
};

export default async function EntretienListPage({ searchParams }: { searchParams: Promise<{ format?: string }> }) {
  const { format: rawFormat } = await searchParams;
  const format = isFormat(rawFormat) ? rawFormat : undefined;
  const entretiens = await getEntretiens(format);
  const featured = entretiens.find((item) => item.format === "VIDEO") || entretiens.find((item) => item.format === "PODCAST") || entretiens[0];
  const rest = entretiens.filter((item) => item.id !== featured?.id);

  return (
    <main>
      <section className="border-b border-nihary-sable-fonce bg-nihary-gradient">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:px-8 lg:py-16">
          <div>
            <span className="eyebrow">Voix · Parcours · Idées</span>
            <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-tight text-nihary-ambre-fonce sm:text-5xl">Les conversations qui donnent un visage à la recherche</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-nihary-brun sm:text-lg">Rencontrez les chercheurs et praticiens qui décryptent les transformations de Madagascar et de l’Océan Indien, en vidéo et en podcast.</p>
            <div className="mt-7 flex flex-wrap gap-3"><Link href="#mediatheque" className="btn-primary"><Play size={16} />Voir les entretiens</Link><Link href="/entretiens/proposer" className="btn-outline"><Plus size={16} />Proposer un invité</Link></div>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-xs text-nihary-gris"><span className="flex items-center gap-1.5"><Video size={14} className="text-nihary-or" />Entretiens vidéo</span><span className="flex items-center gap-1.5"><Headphones size={14} className="text-nihary-or" />Podcasts de fond</span><span className="flex items-center gap-1.5"><Radio size={14} className="text-nihary-or" />Voix expertes</span></div>
          </div>

          {featured && (() => {
            const meta = FORMAT_META[featured.format];
            const Icon = meta.icon;
            return <article className="card group overflow-hidden"><Link href={`/entretiens/${featured.slug}`} className="relative block aspect-video overflow-hidden bg-nihary-sable">{featured.imageUrl ? <Image src={featured.imageUrl} alt={featured.titre} fill priority className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" sizes="(max-width: 1024px) 100vw, 42vw" /> : <div className="flex h-full items-center justify-center"><Icon size={44} className="text-nihary-or" /></div>}<span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-nihary-ambre shadow-sm"><Icon size={13} />{meta.label}</span>{featured.format !== "TEXTE" && <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-nihary-or text-nihary-ambre-fonce shadow-lg transition-transform group-hover:scale-110"><Play size={21} fill="currentColor" /></span>}</Link><div className="p-5 sm:p-6"><span className="eyebrow">À la une</span><h2 className="mt-2 line-clamp-2 font-display text-xl font-bold leading-snug text-nihary-ambre-fonce"><Link href={`/entretiens/${featured.slug}`} className="hover:text-nihary-or">{featured.titre}</Link></h2><div className="mt-4 flex items-center gap-3"><div className="relative h-9 w-9 overflow-hidden rounded-full bg-nihary-or-pale">{featured.auteur.image ? <Image src={featured.auteur.image} alt={featured.auteur.name || "Invité FINIDY"} fill className="object-cover object-top" sizes="36px" /> : <span className="flex h-full items-center justify-center font-display font-bold text-nihary-ambre">{featured.auteur.name?.charAt(0)}</span>}</div><div><p className="text-xs font-medium text-nihary-ambre-fonce">{featured.auteur.name}</p><p className="text-[11px] text-nihary-gris">{featured.dureeMinutes ? `${featured.dureeMinutes} min` : meta.label}</p></div></div></div></article>;
          })()}
        </div>
      </section>

      <div id="mediatheque" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><span className="eyebrow">Médiathèque</span><h2 className="mt-1 font-display text-2xl font-bold text-nihary-ambre-fonce">Écouter, regarder, comprendre</h2></div><nav className="flex flex-wrap gap-2" aria-label="Filtrer les entretiens"><Link href="/entretiens#mediatheque" className={`btn-ghost !px-3 !py-1.5 text-xs ${!format ? "bg-nihary-sable text-nihary-or" : ""}`}>Tous</Link>{Object.entries(FORMAT_META).map(([key, meta]) => { const Icon = meta.icon; return <Link key={key} href={`/entretiens?format=${key}#mediatheque`} className={`btn-ghost !px-3 !py-1.5 text-xs ${format === key ? "bg-nihary-sable text-nihary-or" : ""}`}><Icon size={14} />{meta.label}</Link>; })}</nav></div>

        {entretiens.length === 0 ? <div className="card-sable p-14 text-center"><Mic className="mx-auto mb-4 text-nihary-or" size={44} /><h2 className="font-display text-xl font-semibold text-nihary-ambre-fonce">Aucun entretien dans ce format</h2><p className="mt-2 text-nihary-gris">Découvrez les autres formats ou proposez une nouvelle voix.</p><Link href="/entretiens" className="btn-primary mt-6">Voir tous les entretiens</Link></div> : rest.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{rest.map((item) => { const meta = FORMAT_META[item.format]; const Icon = meta.icon; return <article key={item.id} className="card group flex h-full flex-col overflow-hidden"><Link href={`/entretiens/${item.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-nihary-sable">{item.imageUrl ? <Image src={item.imageUrl} alt={item.titre} fill className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" /> : <div className="flex h-full items-center justify-center"><Icon size={34} className="text-nihary-or" /></div>}<span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-medium text-nihary-ambre shadow-sm"><Icon size={12} />{meta.label}</span>{item.format !== "TEXTE" && <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-nihary-or text-nihary-ambre-fonce shadow"><Play size={14} fill="currentColor" /></span>}</Link><div className="flex flex-1 flex-col p-5"><span className="eyebrow">{DISCIPLINES_LABELS[item.discipline] || item.discipline}</span><h3 className="mt-2 line-clamp-2 font-display text-lg font-semibold leading-snug text-nihary-ambre-fonce"><Link href={`/entretiens/${item.slug}`} className="hover:text-nihary-or">{item.titre}</Link></h3><p className="mt-2 line-clamp-3 text-sm leading-6 text-nihary-gris">{item.description}</p><div className="mt-auto flex items-center justify-between gap-3 border-t border-nihary-sable-fonce pt-4"><div className="flex min-w-0 items-center gap-2"><div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-nihary-or-pale">{item.auteur.image ? <Image src={item.auteur.image} alt={item.auteur.name || "Invité FINIDY"} fill className="object-cover object-top" sizes="32px" /> : <span className="flex h-full items-center justify-center text-xs font-bold text-nihary-ambre">{item.auteur.name?.charAt(0)}</span>}</div><span className="truncate text-xs font-medium text-nihary-brun">{item.auteur.name}</span></div>{item.dureeMinutes && <span className="flex shrink-0 items-center gap-1 text-xs text-nihary-gris"><Clock size={12} />{item.dureeMinutes} min</span>}</div><Link href={`/entretiens/${item.slug}`} className="btn-outline mt-4 w-full justify-center">{item.format === "VIDEO" ? "Regarder" : item.format === "PODCAST" ? "Écouter" : "Lire"} <ArrowRight size={14} /></Link></div></article>; })}</div>
        ) : null}

        <section className="mt-14 rounded-xl bg-nihary-ambre-fonce px-6 py-8 text-white sm:px-9 sm:py-10"><div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-xs font-medium uppercase tracking-[0.18em] text-nihary-or-clair">Une voix à faire entendre ?</p><h2 className="mt-2 font-display text-2xl font-semibold">Proposez un chercheur, un praticien ou un sujet</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">La rédaction privilégie les conversations documentées, accessibles et ancrées dans les réalités du terrain.</p></div><Link href="/entretiens/proposer" className="btn-primary shrink-0"><Plus size={16} />Proposer un entretien</Link></div></section>
      </div>
    </main>
  );
}
