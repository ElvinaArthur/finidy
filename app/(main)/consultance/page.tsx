import Link from "next/link";
import { Handshake, Plus, MapPin, Banknote } from "lucide-react";
import { prisma } from "@/lib/prisma";

async function getExperts() {
  try {
    return await prisma.expertProfile.findMany({
      where: { disponible: true },
      include: { user: { select: { name: true, institution: true } } },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export const metadata = {
  title: "Consultance | FINIDY Research Center",
  description:
    "Mise en relation avec des experts en Sciences Humaines et Sociales pour des missions de consultance, études et recherches appliquées à Madagascar et dans l'Océan Indien.",
  keywords: ['consultance SHS Madagascar', 'expert sciences humaines', 'étude recherche appliquée', 'FINIDY consultance'],
  openGraph: {
    title: "Consultance — FINIDY Research Center",
    description: "Experts SHS disponibles pour des missions de consultance à Madagascar.",
    type: 'website' as const,
    url: 'https://finidy.mg/consultance',
  },
  alternates: { canonical: 'https://finidy.mg/consultance' },
};

export default async function ConsultancePage() {
  const experts = await getExperts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="eyebrow">Pilier 2</span>
          <h1 className="font-display font-bold text-display-md text-nihary-ambre-fonce mt-1">
            Consultance
          </h1>
          <p className="text-nihary-gris font-body mt-2">
            Mise en relation avec des experts et chercheurs en Sciences Humaines
            et Sociales
          </p>
        </div>
        <Link
          href="/consultance/rejoindre"
          className="btn-primary flex-shrink-0"
        >
          <Plus size={16} strokeWidth={2} />
          Devenir expert
        </Link>
      </div>

      {experts.length === 0 ? (
        <div className="card-sable p-16 text-center">
          <div className="flex justify-center mb-4 text-nihary-ambre">
            <Handshake size={48} strokeWidth={1.25} />
          </div>
          <h2 className="font-display font-semibold text-xl text-nihary-ambre-fonce mb-2">
            Aucun expert inscrit pour l'instant
          </h2>
          <p className="text-nihary-gris font-body mb-6">
            Le réseau de consultance FINIDY Research Center vient d'ouvrir.
          </p>
          <Link href="/consultance/rejoindre" className="btn-primary">
            Être le premier expert référencé
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {experts.map((expert) => (
            <Link
              key={expert.id}
              href={`/consultance/${expert.id}`}
              className="card p-6 group"
            >
              <div
                className="w-12 h-12 rounded-full bg-nihary-or-pale flex items-center justify-center
                text-nihary-ambre font-display font-semibold text-lg mb-3"
              >
                {expert.user.name?.charAt(0).toUpperCase() || "?"}
              </div>
              <h3
                className="font-display font-semibold text-base text-nihary-ambre-fonce
                group-hover:text-nihary-or transition-colors"
              >
                {expert.user.name}
              </h3>
              <p className="text-sm text-nihary-gris font-body mb-3">
                {expert.titre}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {expert.specialites.slice(0, 3).map((s) => (
                  <span key={s} className="badge">
                    {s}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 text-xs text-nihary-gris-clair font-mono">
                {expert.ville && (
                  <span className="flex items-center gap-1">
                    <MapPin size={12} strokeWidth={2} /> {expert.ville}
                  </span>
                )}
                {expert.tarifHeure && (
                  <span className="flex items-center gap-1">
                    <Banknote size={12} strokeWidth={2} /> {expert.tarifHeure}{" "}
                    Ar/h
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
