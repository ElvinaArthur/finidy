import Link from 'next/link'
import { Mic, Video, FileText, Plus, Clock } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { DISCIPLINES_LABELS } from '@/lib/disciplines'

const FORMAT_META: Record<string, { label: string; icon: typeof Mic }> = {
  PODCAST: { label: 'Podcast', icon: Mic },
  VIDEO: { label: 'Vidéo', icon: Video },
  TEXTE: { label: 'Texte', icon: FileText },
}

async function getEntretiens(format?: string) {
  try {
    return await prisma.entretien.findMany({
      where: { statut: 'PUBLIE', ...(format ? { format: format as any } : {}) },
      include: { auteur: { select: { name: true } } },
      orderBy: { publishedAt: 'desc' },
      take: 20,
    })
  } catch {
    return []
  }
}

export const metadata = {
  title: 'Entretiens | FINIDY Research Center',
  description:
    "Entretiens vidéo et podcasts avec des chercheurs, experts et praticiens des Sciences Humaines et Sociales de Madagascar et de l'Océan Indien.",
  keywords: ['entretien chercheur Madagascar', 'vidéo SHS', 'interview sociologue', 'podcast sciences humaines'],
  openGraph: {
    title: 'Entretiens — FINIDY Research Center',
    description: "Entretiens vidéo et podcasts avec des chercheurs SHS de Madagascar.",
    type: 'website' as const,
    url: 'https://finidy.mg/entretiens',
  },
  alternates: { canonical: 'https://finidy.mg/entretiens' },
}

export default async function EntretienListPage({
  searchParams,
}: {
  searchParams: Promise<{ format?: string }>
}) {
  const { format } = await searchParams
  const entretiens = await getEntretiens(format)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <span className="eyebrow">Pilier 4</span>
          <h1 className="font-display font-bold text-display-md text-nihary-ambre-fonce mt-1">
            Entretiens
          </h1>
          <p className="text-nihary-gris font-body mt-2">
            Podcasts, vidéos et textes avec des chercheurs et praticiens en SHS
          </p>
        </div>
        <Link href="/entretiens/proposer" className="btn-primary flex-shrink-0">
          <Plus size={16} strokeWidth={2} />
          Proposer un entretien
        </Link>
      </div>

      {/* Filtres format */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link href="/entretiens"
          className={`btn-ghost !py-1.5 !px-3 text-xs ${!format ? 'bg-nihary-sable text-nihary-or' : ''}`}>
          Tous
        </Link>
        {Object.entries(FORMAT_META).map(([key, meta]) => (
          <Link key={key} href={`/entretiens?format=${key}`}
            className={`btn-ghost !py-1.5 !px-3 text-xs ${format === key ? 'bg-nihary-sable text-nihary-or' : ''}`}>
            <meta.icon size={14} strokeWidth={1.75} />
            {meta.label}
          </Link>
        ))}
      </div>

      {entretiens.length === 0 ? (
        <div className="card-sable p-16 text-center">
          <div className="flex justify-center mb-4 text-nihary-ambre">
            <Mic size={48} strokeWidth={1.25} />
          </div>
          <h2 className="font-display font-semibold text-xl text-nihary-ambre-fonce mb-2">
            Aucun entretien publié pour l'instant
          </h2>
          <p className="text-nihary-gris font-body mb-6">
            Soyez parmi les premières voix de FINIDY Research Center.
          </p>
          <Link href="/entretiens/proposer" className="btn-primary">
            Proposer le premier entretien
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {entretiens.map((e) => {
            const meta = FORMAT_META[e.format]
            return (
              <Link key={e.id} href={`/entretiens/${e.slug}`} className="card overflow-hidden group">
                <div className="aspect-[16/10] bg-nihary-sable flex items-center justify-center relative">
                  {e.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={e.imageUrl} alt={e.titre} className="w-full h-full object-cover" />
                  ) : (
                    <meta.icon size={32} strokeWidth={1.25} className="text-nihary-or" />
                  )}
                  <span className="absolute top-2 left-2 badge bg-white/90">
                    <meta.icon size={12} strokeWidth={1.75} className="mr-1 inline" />
                    {meta.label}
                  </span>
                </div>
                <div className="p-5">
                  <span className="badge mb-2">{DISCIPLINES_LABELS[e.discipline] || e.discipline}</span>
                  <h3 className="font-display font-semibold text-base text-nihary-ambre-fonce mb-2
                    group-hover:text-nihary-or transition-colors line-clamp-2">
                    {e.titre}
                  </h3>
                  <p className="text-sm text-nihary-gris font-body mb-3 line-clamp-2">{e.description}</p>
                  <div className="flex items-center gap-3 text-xs text-nihary-gris-clair font-mono">
                    <span>{e.auteur.name}</span>
                    {e.dureeMinutes && (
                      <span className="flex items-center gap-1">
                        <Clock size={12} strokeWidth={2} /> {e.dureeMinutes} min
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
