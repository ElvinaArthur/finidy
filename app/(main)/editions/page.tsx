import Link from "next/link";
import { BookOpen, Plus, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DISCIPLINES_LABELS } from "@/lib/disciplines";

async function getLivres() {
  try {
    return await prisma.livre.findMany({
      where: { statut: "PUBLIE" },
      include: { auteur: { select: { name: true, institution: true } } },
      orderBy: { createdAt: "desc" },
      take: 24,
    });
  } catch {
    return [];
  }
}

export const metadata = {
  title: "Édition | FINIDY Research Center",
  description:
    "Catalogue des ouvrages publiés par le FINIDY Research Center : monographies, essais et travaux académiques en Sciences Humaines et Sociales de Madagascar.",
  keywords: ['édition scientifique Madagascar', 'ouvrage SHS', 'monographie', 'FINIDY éditions'],
  openGraph: {
    title: "Édition — FINIDY Research Center",
    description: "Ouvrages académiques publiés par le FINIDY Research Center.",
    type: 'website' as const,
    url: 'https://finidy.mg/editions',
  },
  alternates: { canonical: 'https://finidy.mg/editions' },
};

export default async function EditionsPage() {
  const livres = await getLivres();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="eyebrow">Pilier 5</span>
          <h1 className="font-display font-bold text-display-md text-nihary-ambre-fonce mt-1">
            Édition
          </h1>
          <p className="text-nihary-gris font-body mt-2">
            Ouvrages et manuscrits en Sciences Humaines et Sociales publiés par FINIDY Research Center
          </p>
        </div>
        <Link href="/editions/soumettre" className="btn-primary flex-shrink-0">
          <Plus size={16} strokeWidth={2} />
          Soumettre un manuscrit
        </Link>
      </div>

      {livres.length === 0 ? (
        <div className="card-sable p-16 text-center">
          <div className="flex justify-center mb-4 text-nihary-ambre">
            <BookOpen size={48} strokeWidth={1.25} />
          </div>
          <h2 className="font-display font-semibold text-xl text-nihary-ambre-fonce mb-2">
            Aucun ouvrage publié pour l'instant
          </h2>
          <p className="text-nihary-gris font-body mb-6">
            La maison d'édition FINIDY Research Center accueille ses premiers manuscrits.
          </p>
          <Link href="/editions/soumettre" className="btn-primary">
            Soumettre le premier manuscrit
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {livres.map((livre) => (
            <Link
              key={livre.id}
              href={`/editions/${livre.slug}`}
              className="card overflow-hidden group"
            >
              <div className="aspect-[3/4] bg-nihary-sable flex items-center justify-center">
                {livre.couvertureUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={livre.couvertureUrl}
                    alt={livre.titre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <BookOpen size={36} strokeWidth={1.25} className="text-nihary-or" />
                )}
              </div>
              <div className="p-4">
                <span className="badge mb-2">
                  {DISCIPLINES_LABELS[livre.discipline] || livre.discipline}
                </span>
                <h3
                  className="font-display font-semibold text-sm text-nihary-ambre-fonce mb-1
                  group-hover:text-nihary-or transition-colors line-clamp-2"
                >
                  {livre.titre}
                </h3>
                <p className="text-xs text-nihary-gris font-body mb-2 line-clamp-2">
                  {livre.description}
                </p>
                <div className="text-xs text-nihary-gris-clair font-mono">
                  <span>{livre.auteur.name}</span>
                  {livre.annee && <span className="ml-2">· {livre.annee}</span>}
                </div>
                {livre.lienAchat && (
                  <span className="mt-2 flex items-center gap-1 text-xs text-nihary-or font-body">
                    <ExternalLink size={11} /> Commander
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
