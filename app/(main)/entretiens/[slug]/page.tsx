import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Clock, Eye, FileText, Headphones, Mic, Play, Quote, Video } from "lucide-react";
import type { Discipline, FormatEntretien } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { DISCIPLINES_LABELS } from "@/lib/disciplines";
import EntretienEngagement from "@/components/entretiens/EntretienEngagement";

const FORMAT_META: Record<FormatEntretien, { label: string; action: string; icon: typeof Mic }> = {
  PODCAST: { label: "Podcast", action: "Écouter", icon: Mic },
  VIDEO: { label: "Vidéo", action: "Regarder", icon: Video },
  TEXTE: { label: "Entretien écrit", action: "Lire", icon: FileText },
};

async function getEntretien(slug: string) {
  try {
    const entretien = await prisma.entretien.findUnique({
      where: { slug, statut: "PUBLIE" },
      include: { auteur: { select: { name: true, institution: true, bio: true, image: true } } },
    });
    if (!entretien) return null;
    void prisma.entretien.update({ where: { id: entretien.id }, data: { vues: { increment: 1 } } }).catch((error) => console.error("Compteur entretien", error));
    return entretien;
  } catch {
    return null;
  }
}

async function getRecommendations(discipline: Discipline, format: FormatEntretien, excludeId: string) {
  try {
    const items = await prisma.entretien.findMany({
      where: { statut: "PUBLIE", id: { not: excludeId } },
      include: { auteur: { select: { name: true, image: true } } },
      orderBy: { publishedAt: "desc" },
      take: 20,
    });
    return items
      .map((item) => ({
        item,
        score: (item.format === format ? 5 : 0) + (item.format === "VIDEO" ? 4 : item.format === "PODCAST" ? 3 : 0) + (item.discipline === discipline ? 3 : 0),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(({ item }) => item);
  } catch {
    return [];
  }
}

function youtubeEmbedUrl(mediaUrl: string) {
  try {
    const url = new URL(mediaUrl);
    if (url.hostname === "youtu.be") return `https://www.youtube-nocookie.com/embed/${url.pathname.slice(1)}`;
    if (url.hostname === "youtube.com" || url.hostname.endsWith(".youtube.com") || url.hostname === "youtube-nocookie.com") {
      const id = url.searchParams.get("v") || url.pathname.match(/\/(?:embed|shorts)\/([^/?]+)/)?.[1];
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
  } catch {
    return null;
  }
  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entretien = await prisma.entretien.findUnique({ where: { slug, statut: "PUBLIE" }, select: { titre: true, description: true, imageUrl: true } });
  if (!entretien) return { title: "Entretien introuvable | FINIDY Research Center" };
  return { title: `${entretien.titre} | Entretiens FINIDY`, description: entretien.description, openGraph: { title: entretien.titre, description: entretien.description, type: "article" as const, images: entretien.imageUrl ? [entretien.imageUrl] : [] } };
}

export default async function EntretienDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entretien = await getEntretien(slug);
  if (!entretien) notFound();

  const meta = FORMAT_META[entretien.format];
  const FormatIcon = meta.icon;
  const recommendations = await getRecommendations(entretien.discipline, entretien.format, entretien.id);
  const publishedDate = entretien.publishedAt || entretien.createdAt;
  const youtubeUrl = entretien.format !== "TEXTE" && entretien.mediaUrl ? youtubeEmbedUrl(entretien.mediaUrl) : null;
  const transcriptParagraphs = entretien.transcription?.split(/\n\s*\n/).map((paragraph) => paragraph.replace(/\*\*/g, "").trim()).filter(Boolean) || [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": entretien.format === "VIDEO" ? "VideoObject" : entretien.format === "PODCAST" ? "PodcastEpisode" : "Article",
    name: entretien.titre,
    description: entretien.description,
    thumbnailUrl: entretien.imageUrl ? `https://finidy.mg${entretien.imageUrl}` : undefined,
    uploadDate: publishedDate.toISOString(),
    duration: entretien.dureeMinutes ? `PT${entretien.dureeMinutes}M` : undefined,
    author: { "@type": "Person", name: entretien.auteur.name },
  };

  return (
    <main className="min-h-screen bg-nihary-ecru">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="border-b border-nihary-sable-fonce bg-nihary-gradient">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <Link href="/entretiens#mediatheque" className="mb-8 inline-flex items-center gap-2 text-sm text-nihary-gris hover:text-nihary-or"><ArrowLeft size={15} />Retour aux entretiens</Link>
          <div className="grid gap-8 lg:grid-cols-[1fr_260px] lg:items-end">
            <div><div className="flex flex-wrap gap-2"><span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-nihary-ambre shadow-sm"><FormatIcon size={13} />{meta.label}</span><span className="badge">{DISCIPLINES_LABELS[entretien.discipline] || entretien.discipline}</span></div><h1 className="mt-4 max-w-4xl font-display text-4xl font-bold leading-[1.12] text-nihary-ambre-fonce sm:text-5xl">{entretien.titre}</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-nihary-brun">{entretien.description}</p><div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-nihary-gris"><span className="flex items-center gap-1.5"><CalendarDays size={14} />{publishedDate.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>{entretien.dureeMinutes && <span className="flex items-center gap-1.5"><Clock size={14} />{entretien.dureeMinutes} min</span>}<span className="flex items-center gap-1.5"><Eye size={14} />{entretien.vues.toLocaleString("fr-FR")} vues</span></div></div>
            <div className="card flex items-center gap-4 p-4"><div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-nihary-or-pale">{entretien.auteur.image ? <Image src={entretien.auteur.image} alt={entretien.auteur.name || "Invité FINIDY"} fill priority className="object-cover object-top" sizes="64px" /> : <span className="flex h-full items-center justify-center font-display text-xl font-bold text-nihary-ambre">{entretien.auteur.name?.charAt(0)}</span>}</div><div className="min-w-0"><p className="text-[10px] font-medium uppercase tracking-wider text-nihary-or">Avec</p><p className="truncate font-display font-semibold text-nihary-ambre-fonce">{entretien.auteur.name}</p>{entretien.auteur.institution && <p className="mt-0.5 line-clamp-2 text-[11px] leading-4 text-nihary-gris">{entretien.auteur.institution}</p>}</div></div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {entretien.format === "VIDEO" && entretien.mediaUrl && (
          <section aria-label="Lecteur vidéo" className="overflow-hidden rounded-xl border border-nihary-sable-fonce bg-black shadow-nihary-lg"><div className="aspect-video">{youtubeUrl ? <iframe src={youtubeUrl} title={entretien.titre} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen className="h-full w-full" /> : <video controls poster={entretien.imageUrl || undefined} className="h-full w-full" src={entretien.mediaUrl}>Votre navigateur ne supporte pas la vidéo.</video>}</div></section>
        )}

        {entretien.format === "PODCAST" && (
          <section className="relative overflow-hidden rounded-xl border border-nihary-sable-fonce bg-nihary-ambre-fonce p-6 text-white shadow-nihary-lg sm:p-8"><div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border-[28px] border-white/5" /><div className="relative"><div className="mb-5 flex items-center gap-4"><div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-nihary-sable">{entretien.imageUrl ? <Image src={entretien.imageUrl} alt={entretien.titre} fill className="object-cover" sizes="80px" /> : <Headphones className="m-auto h-full text-nihary-or" size={36} />}</div><div><p className="text-xs font-medium uppercase tracking-[0.18em] text-nihary-or-clair">Podcast FINIDY · hébergé sur YouTube</p><h2 className="mt-2 font-display text-xl font-semibold">Écouter l’entretien</h2></div></div>{youtubeUrl ? <div className="aspect-video overflow-hidden rounded-lg bg-black"><iframe src={youtubeUrl} title={entretien.titre} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen className="h-full w-full" /></div> : <p className="rounded-lg bg-white/10 p-4 text-sm text-white/70">L’épisode YouTube sera bientôt disponible.</p>}</div></section>
        )}

        {entretien.format === "VIDEO" && !entretien.mediaUrl && <div className="card-sable p-10 text-center"><Video className="mx-auto mb-3 text-nihary-or" size={38} /><p className="font-display text-lg font-semibold text-nihary-ambre-fonce">La vidéo sera bientôt disponible</p></div>}
      </div>

      <div className="mx-auto grid max-w-5xl gap-8 px-4 pb-14 pt-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_230px] lg:px-8">
        <div className="space-y-8">
          {transcriptParagraphs.length > 0 && <section className="card p-6 sm:p-8"><div className="mb-6 flex items-center justify-between gap-4"><div><span className="eyebrow">Version texte</span><h2 className="mt-1 font-display text-2xl font-semibold text-nihary-ambre-fonce">Transcription</h2></div><Quote className="text-nihary-or" size={28} /></div><div className="space-y-5">{transcriptParagraphs.map((paragraph, index) => { const question = paragraph.startsWith("FINIDY :") || paragraph.startsWith("FINIDY:"); return <p key={index} className={question ? "rounded-lg border-l-4 border-nihary-or bg-nihary-or-pale p-4 font-medium leading-7 text-nihary-ambre-fonce" : "text-[16px] leading-8 text-nihary-brun"}>{paragraph}</p>; })}</div></section>}
          {entretien.format === "TEXTE" && transcriptParagraphs.length === 0 && <section className="prose-nihary whitespace-pre-wrap text-[17px] leading-8 text-nihary-brun">{entretien.description}</section>}

          <section className="card p-6"><div className="flex flex-col gap-5 sm:flex-row sm:items-center"><div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-nihary-or-pale">{entretien.auteur.image ? <Image src={entretien.auteur.image} alt={entretien.auteur.name || "Invité FINIDY"} fill className="object-cover object-top" sizes="80px" /> : <span className="flex h-full items-center justify-center font-display text-2xl font-bold text-nihary-ambre">{entretien.auteur.name?.charAt(0)}</span>}</div><div><span className="eyebrow">Le profil</span><h2 className="mt-1 font-display text-xl font-semibold text-nihary-ambre-fonce">{entretien.auteur.name}</h2>{entretien.auteur.institution && <p className="mt-0.5 text-xs text-nihary-gris">{entretien.auteur.institution}</p>}{entretien.auteur.bio && <p className="mt-3 text-sm leading-6 text-nihary-brun">{entretien.auteur.bio}</p>}</div></div></section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start"><div className="card p-5"><p className="text-xs font-medium uppercase tracking-wider text-nihary-gris">Dans cet entretien</p><dl className="mt-4 space-y-3 text-sm"><div className="flex justify-between gap-3"><dt className="text-nihary-gris">Format</dt><dd className="font-medium text-nihary-brun">{meta.label}</dd></div>{entretien.dureeMinutes && <div className="flex justify-between gap-3"><dt className="text-nihary-gris">Durée</dt><dd className="font-medium text-nihary-brun">{entretien.dureeMinutes} min</dd></div>}<div className="flex justify-between gap-3"><dt className="text-nihary-gris">Thème</dt><dd className="text-right font-medium text-nihary-brun">{DISCIPLINES_LABELS[entretien.discipline] || entretien.discipline}</dd></div></dl></div><div className="card-sable p-5"><Mic className="mb-2 text-nihary-or" size={18} /><h2 className="font-display font-semibold text-nihary-ambre-fonce">Une voix à proposer ?</h2><p className="mt-1 text-xs leading-5 text-nihary-gris">Suggérez un invité ou un sujet à la rédaction.</p><Link href="/entretiens/proposer" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-nihary-or hover:underline">Faire une proposition <ArrowRight size={12} /></Link></div></aside>
      </div>

      <EntretienEngagement slug={entretien.slug} />

      {recommendations.length > 0 && <section className="border-t border-nihary-sable-fonce bg-white/60"><div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8"><div className="mb-6"><span className="eyebrow">À suivre</span><h2 className="mt-1 font-display text-2xl font-bold text-nihary-ambre-fonce">Entretiens recommandés</h2><p className="mt-1 text-sm text-nihary-gris">Une sélection privilégiant les formats vidéo et podcast.</p></div><div className="grid gap-5 sm:grid-cols-3">{recommendations.map((item) => { const itemMeta = FORMAT_META[item.format]; const Icon = itemMeta.icon; return <article key={item.id} className="card group overflow-hidden"><Link href={`/entretiens/${item.slug}`} className="relative block aspect-video overflow-hidden bg-nihary-sable">{item.imageUrl ? <Image src={item.imageUrl} alt={item.titre} fill className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" sizes="(max-width: 640px) 100vw, 33vw" /> : <div className="flex h-full items-center justify-center"><Icon className="text-nihary-or" /></div>}<span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-medium text-nihary-ambre"><Icon size={12} />{itemMeta.label}</span>{item.format !== "TEXTE" && <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-nihary-or text-nihary-ambre-fonce"><Play size={12} fill="currentColor" /></span>}</Link><div className="p-4"><h3 className="line-clamp-2 font-display font-semibold text-nihary-ambre-fonce"><Link href={`/entretiens/${item.slug}`} className="hover:text-nihary-or">{item.titre}</Link></h3><div className="mt-3 flex items-center gap-2"><div className="relative h-7 w-7 overflow-hidden rounded-full bg-nihary-or-pale">{item.auteur.image ? <Image src={item.auteur.image} alt={item.auteur.name || "Invité"} fill className="object-cover object-top" sizes="28px" /> : <span className="flex h-full items-center justify-center text-[10px] font-bold text-nihary-ambre">{item.auteur.name?.charAt(0)}</span>}</div><p className="truncate text-xs text-nihary-gris">{item.auteur.name}</p></div><Link href={`/entretiens/${item.slug}`} className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-nihary-or">{itemMeta.action} <ArrowRight size={12} /></Link></div></article>; })}</div></div></section>}
    </main>
  );
}
