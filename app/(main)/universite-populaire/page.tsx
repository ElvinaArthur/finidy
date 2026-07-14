import Link from "next/link";
import { GraduationCap, Plus, Clock, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DISCIPLINES_LABELS } from "@/lib/disciplines";

const NIVEAU_META: Record<string, { label: string; color: string }> = {
  DEBUTANT: { label: "Débutant", color: "text-green-700 bg-green-50" },
  INTERMEDIAIRE: { label: "Intermédiaire", color: "text-blue-700 bg-blue-50" },
  AVANCE: { label: "Avancé", color: "text-nihary-ambre bg-nihary-or-pale" },
};

async function getCours(niveau?: string) {
  try {
    return await prisma.cours.findMany({
      where: {
        statut: "PUBLIE",
        ...(niveau ? { niveau: niveau as any } : {}),
      },
      include: {
        formateur: { select: { name: true, institution: true } },
        _count: { select: { chapitres: true, inscriptions: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 24,
    });
  } catch {
    return [];
  }
}

export const metadata = {
  title: "Université Populaire | FINIDY Research Center",
  description:
    "L'Université Populaire du FINIDY Research Center : cours en ligne gratuits pour démocratiser le savoir en Sciences Humaines et Sociales à Madagascar et dans l'Océan Indien.",
  keywords: ['cours en ligne Madagascar', 'université populaire SHS', 'formation gratuite', 'FINIDY université'],
  openGraph: {
    title: "Université Populaire — FINIDY Research Center",
    description: "Cours en ligne gratuits en Sciences Humaines et Sociales du FINIDY Research Center.",
    type: 'website' as const,
    url: 'https://finidy.mg/universite-populaire',
  },
  alternates: { canonical: 'https://finidy.mg/universite-populaire' },
};

export default async function UniversitePopulairePage({
  searchParams,
}: {
  searchParams: Promise<{ niveau?: string }>;
}) {
  const { niveau } = await searchParams;
  const cours = await getCours(niveau);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <span className="eyebrow">Pilier 7</span>
          <h1 className="font-display font-bold text-display-md text-nihary-ambre-fonce mt-1">
            Université Populaire
          </h1>
          <p className="text-nihary-gris font-body mt-2">
            Cours en ligne gratuits en Sciences Humaines et Sociales pour tous les niveaux
          </p>
        </div>
        <Link href="/universite-populaire/enseigner" className="btn-primary flex-shrink-0">
          <Plus size={16} strokeWidth={2} />
          Proposer un cours
        </Link>
      </div>

      {/* Filtres niveau */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href="/universite-populaire"
          className={`btn-ghost !py-1.5 !px-3 text-xs ${!niveau ? "bg-nihary-sable text-nihary-or" : ""}`}
        >
          Tous les niveaux
        </Link>
        {Object.entries(NIVEAU_META).map(([key, meta]) => (
          <Link
            key={key}
            href={`/universite-populaire?niveau=${key}`}
            className={`btn-ghost !py-1.5 !px-3 text-xs ${niveau === key ? "bg-nihary-sable text-nihary-or" : ""}`}
          >
            {meta.label}
          </Link>
        ))}
      </div>

      {cours.length === 0 ? (
        <div className="card-sable p-16 text-center">
          <div className="flex justify-center mb-4 text-nihary-ambre">
            <GraduationCap size={48} strokeWidth={1.25} />
          </div>
          <h2 className="font-display font-semibold text-xl text-nihary-ambre-fonce mb-2">
            Aucun cours disponible pour l'instant
          </h2>
          <p className="text-nihary-gris font-body mb-6">
            L'Université Populaire FINIDY Research Center ouvre ses portes. Soyez formateur pioneer.
          </p>
          <Link href="/universite-populaire/enseigner" className="btn-primary">
            Proposer le premier cours
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cours.map((c) => {
            const niv = NIVEAU_META[c.niveau] ?? NIVEAU_META.DEBUTANT;
            return (
              <Link
                key={c.id}
                href={`/universite-populaire/${c.slug}`}
                className="card overflow-hidden group"
              >
                <div className="aspect-[16/9] bg-nihary-sable flex items-center justify-center relative">
                  {c.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={c.imageUrl}
                      alt={c.titre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <GraduationCap size={32} strokeWidth={1.25} className="text-nihary-or" />
                  )}
                  <span
                    className={`absolute top-2 left-2 text-xs font-mono px-2 py-0.5 rounded-full ${niv.color}`}
                  >
                    {niv.label}
                  </span>
                  {c.gratuit && (
                    <span className="absolute top-2 right-2 text-xs font-mono px-2 py-0.5 rounded-full bg-nihary-or text-white">
                      Gratuit
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <span className="badge mb-2">
                    {DISCIPLINES_LABELS[c.discipline] || c.discipline}
                  </span>
                  <h3
                    className="font-display font-semibold text-base text-nihary-ambre-fonce mb-2
                    group-hover:text-nihary-or transition-colors line-clamp-2"
                  >
                    {c.titre}
                  </h3>
                  <p className="text-sm text-nihary-gris font-body mb-3 line-clamp-2">
                    {c.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-nihary-gris-clair font-mono">
                    <span>{c.formateur.name}</span>
                    {c.dureeHeures && (
                      <span className="flex items-center gap-1">
                        <Clock size={11} strokeWidth={2} /> {c.dureeHeures}h
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Users size={11} strokeWidth={2} /> {c._count.inscriptions}
                    </span>
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
