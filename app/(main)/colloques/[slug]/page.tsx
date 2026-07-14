import { notFound } from "next/navigation";
import Link from "next/link";
import { CalendarDays, MapPin, FileText, ArrowLeft, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DISCIPLINES_LABELS } from "@/lib/disciplines";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const colloque = await prisma.colloque.findUnique({
    where: { slug },
    select: { titre: true, description: true, lieu: true, dateDebut: true },
  }).catch(() => null);
  if (!colloque) return { title: "Colloque introuvable | FINIDY Research Center" };
  const date = new Date(colloque.dateDebut).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  return {
    title: `${colloque.titre} | Colloques FINIDY Research Center`,
    description: colloque.description?.slice(0, 160) ?? `Colloque organisé à ${colloque.lieu} en ${date} par le FINIDY Research Center.`,
    openGraph: {
      title: colloque.titre,
      description: colloque.description?.slice(0, 160) ?? "",
      type: "website" as const,
      url: `https://finidy.mg/colloques/${slug}`,
    },
    alternates: { canonical: `https://finidy.mg/colloques/${slug}` },
  };
}

const STATUT_LABELS: Record<string, string> = {
  A_VENIR: "À venir",
  OUVERT: "Appel à communications ouvert",
  CLOTURE: "Clôturé",
  ARCHIVE: "Archivé",
};

async function getColloque(slug: string) {
  try {
    return await prisma.colloque.findUnique({
      where: { slug },
      include: {
        sessions: {
          include: { communications: { where: { statut: "ACCEPTE" } } },
          orderBy: { horaire: "asc" },
        },
        communications: {
          where: { statut: "ACCEPTE" },
          orderBy: { createdAt: "asc" },
          take: 10,
        },
      },
    });
  } catch {
    return null;
  }
}

export default async function ColloquePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const colloque = await getColloque(slug);
  if (!colloque) notFound();

  const fmt = (d: Date) =>
    new Date(d).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/colloques" className="btn-ghost mb-6 inline-flex">
        <ArrowLeft size={16} strokeWidth={1.75} />
        Retour aux colloques
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2">
          <div className="flex flex-wrap gap-2 mb-3">
            {colloque.discipline.map((d) => (
              <span key={d} className="badge">
                {DISCIPLINES_LABELS[d] || d}
              </span>
            ))}
          </div>

          <h1 className="font-display font-bold text-display-md text-nihary-ambre-fonce mb-4">
            {colloque.titre}
          </h1>

          <div className="flex flex-wrap gap-4 text-sm text-nihary-gris font-body mb-6">
            <span className="flex items-center gap-1.5">
              <MapPin size={14} strokeWidth={1.75} />
              {colloque.lieu}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays size={14} strokeWidth={1.75} />
              Du {fmt(colloque.dateDebut)} au {fmt(colloque.dateFin)}
            </span>
            {colloque.dateLimit && (
              <span className="text-nihary-or font-medium">
                Date limite de soumission : {fmt(colloque.dateLimit)}
              </span>
            )}
          </div>

          <div className="text-nihary-brun font-body leading-relaxed whitespace-pre-line mb-8">
            {colloque.description}
          </div>

          {/* Sessions */}
          {colloque.sessions.length > 0 && (
            <div className="mb-8">
              <h2 className="font-display font-semibold text-xl text-nihary-ambre-fonce mb-4">
                Programme
              </h2>
              <div className="space-y-3">
                {colloque.sessions.map((session) => (
                  <div key={session.id} className="card-sable p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display font-semibold text-nihary-ambre-fonce">
                        {session.titre}
                      </h3>
                      <span className="text-xs font-mono text-nihary-gris flex-shrink-0">
                        {new Date(session.horaire).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    {session.animateur && (
                      <p className="text-sm text-nihary-gris font-body mt-1">
                        <Users size={12} className="inline mr-1" />
                        {session.animateur}
                      </p>
                    )}
                    {session.communications.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {session.communications.map((c) => (
                          <li key={c.id} className="text-sm text-nihary-brun font-body pl-3 border-l-2 border-nihary-or-clair">
                            {c.titre} — <span className="text-nihary-gris">{c.auteurs}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Communications sans session */}
          {colloque.communications.length > 0 && colloque.sessions.length === 0 && (
            <div className="mb-8">
              <h2 className="font-display font-semibold text-xl text-nihary-ambre-fonce mb-4">
                Communications acceptées
              </h2>
              <div className="space-y-3">
                {colloque.communications.map((c) => (
                  <div key={c.id} className="card-sable p-4">
                    <h3 className="font-display font-semibold text-nihary-ambre-fonce mb-1">
                      {c.titre}
                    </h3>
                    <p className="text-sm text-nihary-gris font-body">{c.auteurs}</p>
                    <p className="text-sm text-nihary-brun font-body mt-2 line-clamp-3">{c.resume}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="card-sable p-5">
            <p className="text-xs font-mono text-nihary-gris uppercase tracking-widest mb-3">
              Statut
            </p>
            <p className="font-display font-semibold text-nihary-ambre-fonce">
              {STATUT_LABELS[colloque.statut] || colloque.statut}
            </p>
          </div>

          {(colloque.statut === "OUVERT" || colloque.statut === "A_VENIR") && (
            <Link href="/colloques/soumettre" className="btn-primary w-full justify-center">
              Soumettre une communication
            </Link>
          )}

          {colloque.programmeUrl && (
            <a
              href={colloque.programmeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost w-full justify-center"
            >
              <FileText size={15} strokeWidth={1.75} />
              Télécharger le programme
            </a>
          )}

          {colloque.actesUrl && (
            <a
              href={colloque.actesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost w-full justify-center"
            >
              <FileText size={15} strokeWidth={1.75} />
              Actes du colloque
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
