import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Mic, Video, FileText, Clock, Eye, Download } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { DISCIPLINES_LABELS } from '@/lib/disciplines'

const FORMAT_META: Record<string, { label: string; icon: typeof Mic }> = {
  PODCAST: { label: 'Podcast', icon: Mic },
  VIDEO: { label: 'Vidéo', icon: Video },
  TEXTE: { label: 'Texte', icon: FileText },
}

async function getEntretien(slug: string) {
  try {
    const entretien = await prisma.entretien.findUnique({
      where: { slug, statut: 'PUBLIE' },
      include: { auteur: { select: { name: true, institution: true } } },
    })
    if (!entretien) return null

    void prisma.entretien.update({
      where: { id: entretien.id },
      data: { vues: { increment: 1 } },
    }).catch((error) => console.error('Compteur entretien', error))

    return entretien
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const entretien = await prisma.entretien.findUnique({ where: { slug, statut: 'PUBLIE' }, select: { titre: true, description: true } })
  if (!entretien) return { title: 'Entretien introuvable | FINIDY Research Center' }
  return { title: `${entretien.titre} | FINIDY Research Center`, description: entretien.description }
}

export default async function EntretienDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const entretien = await getEntretien(slug)

  if (!entretien) notFound()

  const meta = FORMAT_META[entretien.format]

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <div className="mb-6">
        <Link href="/entretiens" className="text-sm font-body text-nihary-or hover:underline">
          ← Retour aux entretiens
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="badge">
          <meta.icon size={12} strokeWidth={1.75} className="mr-1 inline" />
          {meta.label}
        </span>
        <span className="badge">{DISCIPLINES_LABELS[entretien.discipline] || entretien.discipline}</span>
      </div>

      <h1 className="font-display font-bold text-display-md text-nihary-ambre-fonce mb-4 leading-tight">
        {entretien.titre}
      </h1>

      <p className="text-lg text-nihary-brun font-body mb-6 leading-relaxed">{entretien.description}</p>

      <div className="flex flex-wrap items-center gap-4 pb-6 mb-8 border-b border-nihary-sable-fonce
        text-sm text-nihary-gris font-body">
        <div>
          <span className="font-medium text-nihary-ambre-fonce">{entretien.auteur.name}</span>
          {entretien.auteur.institution && <span> · {entretien.auteur.institution}</span>}
        </div>
        {entretien.dureeMinutes && (
          <span className="flex items-center gap-1">
            <Clock size={14} strokeWidth={1.75} /> {entretien.dureeMinutes} min
          </span>
        )}
        <span className="flex items-center gap-1">
          <Eye size={14} strokeWidth={1.75} /> {entretien.vues} vues
        </span>
      </div>

      {/* Lecteur média */}
      {entretien.mediaUrl && entretien.format === 'PODCAST' && (
        <div className="card-sable p-5 mb-8">
          <audio controls className="w-full" src={entretien.mediaUrl}>
            Votre navigateur ne supporte pas la lecture audio.
          </audio>
        </div>
      )}

      {entretien.mediaUrl && entretien.format === 'VIDEO' && (
        <div className="mb-8 rounded-xl overflow-hidden border border-nihary-sable-fonce aspect-video bg-black">
          {entretien.mediaUrl.includes('youtube.com') || entretien.mediaUrl.includes('youtu.be') ? (
            <iframe
              src={entretien.mediaUrl}
              title={entretien.titre}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          ) : (
            <video controls className="w-full h-full" src={entretien.mediaUrl}>
              Votre navigateur ne supporte pas la lecture vidéo.
            </video>
          )}
        </div>
      )}

      {!entretien.mediaUrl && (
        <div className="card-sable p-8 mb-8 text-center text-sm text-nihary-gris font-body">
          Média non encore disponible pour cet entretien.
        </div>
      )}

      {entretien.mediaUrl && entretien.format === 'PODCAST' && (
        <a href={entretien.mediaUrl} download
          className="btn-outline mb-8 inline-flex">
          <Download size={16} strokeWidth={1.75} />
          Télécharger l'audio
        </a>
      )}

      {/* Transcription */}
      {entretien.transcription && (
        <details className="card p-5 group">
          <summary className="font-display font-semibold text-nihary-ambre-fonce cursor-pointer
            list-none flex items-center justify-between">
            Lire la transcription
            <span className="text-nihary-or text-sm group-open:rotate-180 transition-transform">▾</span>
          </summary>
          <div className="prose-nihary font-body text-nihary-brun mt-4 pt-4 border-t border-nihary-sable-fonce
            whitespace-pre-wrap">
            {entretien.transcription}
          </div>
        </details>
      )}

      {entretien.format === 'TEXTE' && !entretien.transcription && (
        <div className="prose-nihary font-body text-nihary-brun whitespace-pre-wrap">
          {entretien.description}
        </div>
      )}
    </article>
  )
}
