import Link from "next/link";
import { CalendarDays, MapPin, Plus, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DISCIPLINES_LABELS } from "@/lib/disciplines";

const STATUT_META: Record<string, { label: string; color: string }> = {
  A_VENIR: { label: "À venir", color: "text-blue-600 bg-blue-50" },
  OUVERT: { label: "Ouvert", color: "text-green-700 bg-green-50" },
  CLOTURE: { label: "Clôturé", color: "text-nihary-gris bg-nihary-sable" },
  ARCHIVE: { label: "Archivé", color: "text-nihary-gris-clair bg-nihary-sable-fonce" },
};

async function getColloques(statut?: string) {
  try {
    return await prisma.colloque.findMany({
      where: statut ? { statut: statut as any } : undefined,
      orderBy: { dateDebut: "desc" },
      take: 20,
    });
  } catch {
    return [];
  }
}

export const metadata = {
  title: "Colloques | FINIDY Research Center",
  description:
    "Colloques et conférences scientifiques organisés par le FINIDY Research Center : appels à communications, programmes et actes en Sciences Humaines et Sociales.",
  keywords: ['colloque Madagascar', 'conférence scientifique SHS', 'appel à communications', 'FINIDY colloques'],
  openGraph: {
    title: "Colloques — FINIDY Research Center",
    description: "Colloques et conférences en Sciences Humaines et Sociales organisés par le FINIDY.",
    type: 'website' as const,
    url: 'https://finidy.mg/colloques',
  },
  alternates: { canonical: 'https://finidy.mg/colloques' },
};

export default async function ColloquesPage({
  searchParams,
}: {
  searchParams: Promise<{ statut?: string }>;
}) {
  const { statut } = await searchParams;
  const colloques = await getColloques(statut);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <span className="eyebrow">Pilier 6</span>
          <h1 className="font-display font-bold text-display-md text-nihary-ambre-fonce mt-1">
            Colloques
          </h1>
          <p className="text-nihary-gris font-body mt-2">
            Conférences et colloques internationaux en Sciences Humaines et Sociales
          </p>
        </div>
        <Link href="/colloques/soumettre" className="btn-primary flex-shrink-0">
          <Plus size={16} strokeWidth={2} />
          Soumettre une communication
        </Link>
      </div>

      {/* Filtres statut */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href="/colloques"
          className={`btn-ghost !py-1.5 !px-3 text-xs ${!statut ? "bg-nihary-sable text-nihary-or" : ""}`}
        >
          Tous
        </Link>
        {Object.entries(STATUT_META).map(([key, meta]) => (
          <Link
            key={key}
            href={`/colloques?statut=${key}`}
            className={`btn-ghost !py-1.5 !px-3 text-xs ${statut === key ? "bg-nihary-sable text-nihary-or" : ""}`}
          >
            {meta.label}
          </Link>
        ))}
      </div>

      {colloques.length === 0 ? (
        <div className="card-sable p-16 text-center">
          <div className="flex justify-center mb-4 text-nihary-ambre">
            <CalendarDays size={48} strokeWidth={1.25} />
          </div>
          <h2 className="font-display font-semibold text-xl text-nihary-ambre-fonce mb-2">
            Aucun colloque annoncé pour l'instant
          </h2>
          <p className="text-nihary-gris font-body mb-6">
            Soumettez une communication pour le prochain colloque FINIDY Research Center.
          </p>
          <Link href="/colloques/soumettre" className="btn-primary">
            Soumettre une communication
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {colloques.map((colloque) => {
            const sm = STATUT_META[colloque.statut] ?? STATUT_META.A_VENIR;
            return (
              <Link
                key={colloque.id}
                href={`/colloques/${colloque.slug}`}
                className="card overflow-hidden group"
              >
                <div className="aspect-[16/9] bg-nihary-sable flex items-center justify-center relative">
                  {colloque.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={colloque.imageUrl}
                      alt={colloque.titre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <CalendarDays size={32} strokeWidth={1.25} className="text-nihary-or" />
                  )}
                  <span
                    className={`absolute top-2 left-2 text-xs font-mono px-2 py-0.5 rounded-full ${sm.color}`}
                  >
                    {sm.label}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {colloque.discipline.slice(0, 2).map((d) => (
                      <span key={d} className="badge text-xs">
                        {DISCIPLINES_LABELS[d] || d}
                      </span>
                    ))}
                  </div>
                  <h3
                    className="font-display font-semibold text-base text-nihary-ambre-fonce mb-2
                    group-hover:text-nihary-or transition-colors line-clamp-2"
                  >
                    {colloque.titre}
                  </h3>
                  <div className="space-y-1 text-xs text-nihary-gris font-body">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={12} strokeWidth={1.75} />
                      {colloque.lieu}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} strokeWidth={1.75} />
                      {new Date(colloque.dateDebut).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
