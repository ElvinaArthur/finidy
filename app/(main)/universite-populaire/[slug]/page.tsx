import { notFound } from "next/navigation";
import Link from "next/link";
import { GraduationCap, ArrowLeft, Clock, Users, PlayCircle, FileText, ChevronDown } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DISCIPLINES_LABELS } from "@/lib/disciplines";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cours = await prisma.cours.findUnique({
    where: { slug, statut: "PUBLIE" },
    select: { titre: true, description: true, formateur: { select: { name: true } }, niveau: true },
  }).catch(() => null);
  if (!cours) return { title: "Cours introuvable | FINIDY Research Center" };
  return {
    title: `${cours.titre} | Université Populaire FINIDY Research Center`,
    description: cours.description?.slice(0, 160) ?? `Cours en ligne par ${cours.formateur.name} — Université Populaire FINIDY Research Center.`,
    openGraph: {
      title: cours.titre,
      description: cours.description?.slice(0, 160) ?? "",
      type: "website" as const,
      url: `https://finidy.mg/universite-populaire/${slug}`,
    },
    alternates: { canonical: `https://finidy.mg/universite-populaire/${slug}` },
  };
}

const NIVEAU_LABELS: Record<string, string> = {
  DEBUTANT: "Débutant",
  INTERMEDIAIRE: "Intermédiaire",
  AVANCE: "Avancé",
};

async function getCours(slug: string) {
  try {
    return await prisma.cours.findUnique({
      where: { slug, statut: "PUBLIE" },
      include: {
        formateur: { select: { name: true, institution: true, bio: true } },
        chapitres: { orderBy: { ordre: "asc" } },
        _count: { select: { inscriptions: true } },
      },
    });
  } catch {
    return null;
  }
}

export default async function CoursPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cours = await getCours(slug);
  if (!cours) notFound();

  const totalDuree = cours.chapitres.reduce((sum, c) => sum + (c.dureeMin ?? 0), 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/universite-populaire" className="btn-ghost mb-6 inline-flex">
        <ArrowLeft size={16} strokeWidth={1.75} />
        Retour aux cours
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2">
          <div className="aspect-[16/9] bg-nihary-sable rounded-nihary overflow-hidden flex items-center justify-center mb-6">
            {cours.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cours.imageUrl} alt={cours.titre} className="w-full h-full object-cover" />
            ) : (
              <GraduationCap size={48} strokeWidth={1.25} className="text-nihary-or" />
            )}
          </div>

          <span className="badge mb-3">
            {DISCIPLINES_LABELS[cours.discipline] || cours.discipline}
          </span>

          <h1 className="font-display font-bold text-display-md text-nihary-ambre-fonce mb-4">
            {cours.titre}
          </h1>

          <div className="flex flex-wrap gap-4 text-sm text-nihary-gris font-body mb-6">
            <span className="flex items-center gap-1.5">
              <GraduationCap size={14} strokeWidth={1.75} />
              {NIVEAU_LABELS[cours.niveau]}
            </span>
            {totalDuree > 0 && (
              <span className="flex items-center gap-1.5">
                <Clock size={14} strokeWidth={1.75} />
                {totalDuree >= 60
                  ? `${Math.floor(totalDuree / 60)}h${totalDuree % 60 > 0 ? ` ${totalDuree % 60}min` : ""}`
                  : `${totalDuree} min`}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Users size={14} strokeWidth={1.75} />
              {cours._count.inscriptions} inscrits
            </span>
          </div>

          <div className="text-nihary-brun font-body leading-relaxed whitespace-pre-line mb-8">
            {cours.description}
          </div>

          {/* Programme */}
          {cours.chapitres.length > 0 && (
            <div>
              <h2 className="font-display font-semibold text-xl text-nihary-ambre-fonce mb-4">
                Programme ({cours.chapitres.length} chapitres)
              </h2>
              <div className="space-y-2">
                {cours.chapitres.map((chapitre, idx) => (
                  <div key={chapitre.id} className="card-sable p-4 flex items-center gap-3">
                    <span className="text-xs font-mono text-nihary-gris-clair w-5 flex-shrink-0">
                      {idx + 1}
                    </span>
                    {chapitre.videoUrl ? (
                      <PlayCircle size={16} strokeWidth={1.75} className="text-nihary-or flex-shrink-0" />
                    ) : (
                      <FileText size={16} strokeWidth={1.75} className="text-nihary-or flex-shrink-0" />
                    )}
                    <span className="font-display font-medium text-nihary-ambre-fonce flex-1">
                      {chapitre.titre}
                    </span>
                    {chapitre.dureeMin && (
                      <span className="text-xs font-mono text-nihary-gris-clair flex-shrink-0">
                        {chapitre.dureeMin} min
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="card p-5 sticky top-4">
            <p className="font-display font-bold text-2xl text-nihary-ambre-fonce mb-1">
              {cours.gratuit ? "Gratuit" : "Payant"}
            </p>
            <p className="text-xs text-nihary-gris font-body mb-4">
              Accès libre et permanent
            </p>
            <button className="btn-primary w-full justify-center mb-3">
              S'inscrire au cours
            </button>
            <div className="space-y-2 text-sm text-nihary-brun font-body">
              <div className="flex justify-between">
                <span className="text-nihary-gris">Niveau</span>
                <span>{NIVEAU_LABELS[cours.niveau]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-nihary-gris">Chapitres</span>
                <span>{cours.chapitres.length}</span>
              </div>
              {cours.dureeHeures && (
                <div className="flex justify-between">
                  <span className="text-nihary-gris">Durée estimée</span>
                  <span>{cours.dureeHeures}h</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-nihary-gris">Inscrits</span>
                <span>{cours._count.inscriptions}</span>
              </div>
            </div>
          </div>

          {cours.formateur.bio && (
            <div className="card-sable p-5">
              <p className="text-xs font-mono text-nihary-gris uppercase tracking-widest mb-2">
                Formateur
              </p>
              <p className="font-display font-semibold text-nihary-ambre-fonce mb-1">
                {cours.formateur.name}
              </p>
              {cours.formateur.institution && (
                <p className="text-xs text-nihary-gris font-body mb-2">
                  {cours.formateur.institution}
                </p>
              )}
              <p className="text-sm text-nihary-brun font-body">{cours.formateur.bio}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
