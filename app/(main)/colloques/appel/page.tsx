import Link from "next/link";
import { CalendarDays, FileText, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

async function getColloqueOuverts() {
  try {
    return await prisma.colloque.findMany({
      where: { statut: { in: ["OUVERT", "A_VENIR"] } },
      orderBy: { dateDebut: "asc" },
      take: 10,
    });
  } catch {
    return [];
  }
}

export const metadata = { title: "Call for Papers | FINIDY Research Center" };

export default async function AppelPage() {
  const colloques = await getColloqueOuverts();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <span className="eyebrow">Colloques</span>
      <h1 className="font-display font-bold text-display-md text-nihary-ambre-fonce mt-1 mb-4">
        Call for Papers
      </h1>
      <p className="text-nihary-gris font-body mb-8 max-w-2xl">
        Appels à communications ouverts pour les colloques et conférences organisés ou soutenus
        par FINIDY Research Center. Soumettez votre proposition de communication avant les dates limites.
      </p>

      {colloques.length === 0 ? (
        <div className="card-sable p-16 text-center">
          <CalendarDays size={40} strokeWidth={1.25} className="mx-auto mb-4 text-nihary-ambre" />
          <h2 className="font-display font-semibold text-xl text-nihary-ambre-fonce mb-2">
            Aucun appel ouvert pour le moment
          </h2>
          <p className="text-nihary-gris font-body mb-6">
            Revenez prochainement pour les prochains appels à communications.
          </p>
          <Link href="/colloques" className="btn-outline">
            Voir tous les colloques
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {colloques.map((c) => (
            <div key={c.id} className="card p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <span
                    className={`text-xs font-mono px-2 py-0.5 rounded-full mb-3 inline-block ${
                      c.statut === "OUVERT"
                        ? "text-green-700 bg-green-50"
                        : "text-blue-700 bg-blue-50"
                    }`}
                  >
                    {c.statut === "OUVERT" ? "Appel ouvert" : "À venir"}
                  </span>
                  <h2 className="font-display font-semibold text-nihary-ambre-fonce mb-2">
                    {c.titre}
                  </h2>
                  <div className="flex flex-wrap gap-4 text-sm text-nihary-gris font-body">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays size={13} strokeWidth={1.75} />
                      {new Date(c.dateDebut).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    {c.dateLimit && (
                      <span className="text-nihary-or font-medium">
                        Limite :{" "}
                        {new Date(c.dateLimit).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-nihary-brun font-body mt-3 line-clamp-2">
                    {c.description}
                  </p>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <Link href="/colloques/soumettre" className="btn-primary text-sm">
                    Soumettre
                  </Link>
                  <Link
                    href={`/colloques/${c.slug}`}
                    className="btn-ghost text-sm flex items-center gap-1"
                  >
                    Détails <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
