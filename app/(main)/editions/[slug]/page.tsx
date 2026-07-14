import { notFound } from "next/navigation";
import Link from "next/link";
import { BookOpen, ExternalLink, FileText, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DISCIPLINES_LABELS } from "@/lib/disciplines";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const livre = await prisma.livre.findUnique({
    where: { slug },
    select: { titre: true, description: true, auteur: { select: { name: true } }, annee: true },
  }).catch(() => null);
  if (!livre) return { title: "Ouvrage introuvable | FINIDY Research Center" };
  return {
    title: `${livre.titre} | Édition FINIDY Research Center`,
    description: livre.description?.slice(0, 160) ?? `Ouvrage publié par ${livre.auteur.name} aux éditions FINIDY Research Center.`,
    openGraph: {
      title: livre.titre,
      description: livre.description?.slice(0, 160) ?? "",
      type: "book" as const,
      url: `https://finidy.mg/editions/${slug}`,
    },
    alternates: { canonical: `https://finidy.mg/editions/${slug}` },
  };
}

async function getLivre(slug: string) {
  try {
    return await prisma.livre.findUnique({
      where: { slug },
      include: { auteur: { select: { name: true, institution: true, bio: true } } },
    });
  } catch {
    return null;
  }
}

export default async function LivrePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const livre = await getLivre(slug);
  if (!livre) notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/editions" className="btn-ghost mb-6 inline-flex">
        <ArrowLeft size={16} strokeWidth={1.75} />
        Retour aux éditions
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Couverture */}
        <div className="lg:col-span-1">
          <div className="aspect-[3/4] bg-nihary-sable rounded-nihary flex items-center justify-center overflow-hidden">
            {livre.couvertureUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={livre.couvertureUrl}
                alt={livre.titre}
                className="w-full h-full object-cover"
              />
            ) : (
              <BookOpen size={48} strokeWidth={1.25} className="text-nihary-or" />
            )}
          </div>

          <div className="mt-4 space-y-2">
            {livre.lienAchat && (
              <a
                href={livre.lienAchat}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full justify-center"
              >
                <ExternalLink size={15} strokeWidth={2} />
                Commander
              </a>
            )}
            {livre.extraitUrl && (
              <a
                href={livre.extraitUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost w-full justify-center"
              >
                <FileText size={15} strokeWidth={1.75} />
                Lire un extrait
              </a>
            )}
          </div>
        </div>

        {/* Détails */}
        <div className="lg:col-span-2">
          <span className="badge mb-3">
            {DISCIPLINES_LABELS[livre.discipline] || livre.discipline}
          </span>
          <h1 className="font-display font-bold text-display-md text-nihary-ambre-fonce mb-2">
            {livre.titre}
          </h1>

          <div className="flex flex-wrap gap-4 text-sm text-nihary-gris font-body mb-6">
            <span>Par {livre.auteur.name}</span>
            {livre.auteur.institution && <span>· {livre.auteur.institution}</span>}
            {livre.annee && <span>· {livre.annee}</span>}
            {livre.pages && <span>· {livre.pages} pages</span>}
            {livre.isbn && <span>· ISBN : {livre.isbn}</span>}
            {livre.collection && <span>· Collection : {livre.collection}</span>}
          </div>

          <div className="prose-nihary text-nihary-brun font-body leading-relaxed whitespace-pre-line mb-8">
            {livre.description}
          </div>

          {livre.auteur.bio && (
            <div className="card-sable p-5">
              <p className="text-xs text-nihary-gris font-mono uppercase tracking-widest mb-2">
                À propos de l'auteur
              </p>
              <p className="font-display font-semibold text-nihary-ambre-fonce mb-1">
                {livre.auteur.name}
              </p>
              <p className="text-sm text-nihary-brun font-body">{livre.auteur.bio}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
