import Link from "next/link";
import { FileText, Download, CalendarDays } from "lucide-react";
import { prisma } from "@/lib/prisma";

async function getColloqueArchives() {
  try {
    return await prisma.colloque.findMany({
      where: { statut: { in: ["CLOTURE", "ARCHIVE"] }, actesUrl: { not: null } },
      orderBy: { dateFin: "desc" },
      take: 20,
    });
  } catch {
    return [];
  }
}

export const metadata = { title: "Actes & Proceedings | FINIDY Research Center" };

export default async function ActesPage() {
  const colloques = await getColloqueArchives();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <span className="eyebrow">Colloques</span>
      <h1 className="font-display font-bold text-display-md text-nihary-ambre-fonce mt-1 mb-4">
        Actes & Proceedings
      </h1>
      <p className="text-nihary-gris font-body mb-8 max-w-2xl">
        Les actes des colloques organisés ou soutenus par FINIDY Research Center, disponibles en téléchargement
        libre.
      </p>

      {colloques.length === 0 ? (
        <div className="card-sable p-16 text-center">
          <FileText size={40} strokeWidth={1.25} className="mx-auto mb-4 text-nihary-ambre" />
          <h2 className="font-display font-semibold text-xl text-nihary-ambre-fonce mb-2">
            Aucun acte disponible pour le moment
          </h2>
          <p className="text-nihary-gris font-body mb-6">
            Les actes des prochains colloques seront publiés ici après les événements.
          </p>
          <Link href="/colloques" className="btn-outline">
            Voir les colloques à venir
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {colloques.map((c) => (
            <div key={c.id} className="card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h2 className="font-display font-semibold text-nihary-ambre-fonce mb-1">
                  {c.titre}
                </h2>
                <div className="flex items-center gap-1.5 text-sm text-nihary-gris font-body">
                  <CalendarDays size={13} strokeWidth={1.75} />
                  {new Date(c.dateFin).getFullYear()} · {c.lieu}
                </div>
              </div>
              <a
                href={c.actesUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex-shrink-0"
              >
                <Download size={15} strokeWidth={2} />
                Télécharger les actes
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
