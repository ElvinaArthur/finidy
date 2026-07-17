import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Banknote, FileText, Send } from "lucide-react";
import { prisma } from "@/lib/prisma";

async function getExpert(id: string) {
  try {
    return await prisma.expertProfile.findUnique({
      where: { id, disponible: true },
      include: {
        user: { select: { name: true, institution: true, bio: true } },
      },
    });
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const expert = await prisma.expertProfile.findUnique({
    where: { id, disponible: true },
    include: { user: { select: { name: true } } },
  });
  if (!expert) return { title: "Expert introuvable | FINIDY Research Center" };
  return { title: `${expert.user.name} | Consultance FINIDY Research Center` };
}

export default async function ExpertProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const expert = await getExpert(id);

  if (!expert) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link
          href="/consultance"
          className="text-sm font-body text-nihary-or hover:underline"
        >
          ← Retour aux experts
        </Link>
      </div>

      <div className="card p-8">
        <div className="flex flex-col sm:flex-row sm:items-start gap-6">
          <div
            className="w-20 h-20 rounded-full bg-nihary-or-pale flex items-center justify-center
            text-nihary-ambre font-display font-bold text-3xl flex-shrink-0"
          >
            {expert.user.name?.charAt(0).toUpperCase() || "?"}
          </div>

          <div className="flex-1">
            <h1 className="font-display font-bold text-2xl text-nihary-ambre-fonce">
              {expert.user.name}
            </h1>
            <p className="text-nihary-gris font-body mt-1">{expert.titre}</p>
            {expert.user.institution && (
              <p className="text-sm text-nihary-gris-clair font-body mt-0.5">
                {expert.user.institution}
              </p>
            )}

            <div className="flex flex-wrap gap-4 mt-4 text-sm text-nihary-brun font-body">
              {expert.ville && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={15} strokeWidth={1.75} /> {expert.ville}
                </span>
              )}
              {expert.tarifHeure && (
                <span className="flex items-center gap-1.5">
                  <Banknote size={15} strokeWidth={1.75} /> {expert.tarifHeure}{" "}
                  Ar/heure
                </span>
              )}
              {expert.cvUrl && (
                <a
                  href={expert.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-nihary-or hover:underline"
                >
                  <FileText size={15} strokeWidth={1.75} /> Voir le CV
                </a>
              )}
            </div>
          </div>
        </div>

        {expert.user.bio && (
          <div className="mt-6 pt-6 border-t border-nihary-sable-fonce">
            <h2 className="font-display font-semibold text-nihary-ambre-fonce mb-2">
              À propos
            </h2>
            <p className="text-nihary-brun font-body leading-relaxed">
              {expert.user.bio}
            </p>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-nihary-sable-fonce">
          <h2 className="font-display font-semibold text-nihary-ambre-fonce mb-3">
            Spécialités
          </h2>
          <div className="flex flex-wrap gap-2">
            {expert.specialites.map((s) => (
              <span key={s} className="badge">
                {s}
              </span>
            ))}
          </div>
        </div>

        <Link
          href={`/consultance/devis?expertId=${expert.id}`}
          className="btn-primary w-full justify-center mt-8"
        >
          <Send size={16} strokeWidth={1.75} />
          Demander un devis à {expert.user.name?.split(" ")[0]}
        </Link>
      </div>
    </div>
  );
}
