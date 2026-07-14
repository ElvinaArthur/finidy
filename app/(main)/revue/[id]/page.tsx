import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  FileText, Users, ExternalLink,
  Eye, ArrowDownToLine, Calendar, Globe, Hash, BookMarked,
  ShieldCheck, Tag,
} from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { DISCIPLINES_LABELS } from '@/lib/disciplines'
import PdfViewer from '@/components/shared/PdfViewer'

const LANGUE_LABELS: Record<string, string> = {
  FR: 'Français',
  EN: 'Anglais',
  MG: 'Malgache',
}

async function getArticle(id: string) {
  try {
    const article = await prisma.articleRevue.findUnique({
      where: { id, statut: 'PUBLIE' },
      include: {
        auteur: {
          select: { name: true, institution: true, discipline: true, email: true },
        },
        coAuteurs: true,
      },
    })
    if (!article) return null

    await prisma.articleRevue.update({
      where: { id: article.id },
      data: { vues: { increment: 1 } },
    })

    return article
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const article = await prisma.articleRevue.findUnique({
    where: { id },
    select: { titre: true, resume: true, auteur: { select: { name: true } }, doi: true, motsClés: true },
  })
  if (!article) return { title: 'Article introuvable | FINIDY Research Center' }
  return {
    title: `${article.titre} | SAONTSY — FINIDY Research Center`,
    description: article.resume.slice(0, 160),
    keywords: article.motsClés ?? [],
    authors: [{ name: article.auteur.name }],
    openGraph: {
      title: article.titre,
      description: article.resume.slice(0, 160),
      type: 'article' as const,
      url: `https://finidy.mg/revue/${id}`,
      siteName: 'SAONTSY — FINIDY Research Center',
    },
    alternates: { canonical: `https://finidy.mg/revue/${id}` },
  }
}

export default async function ArticleRevuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const article = await getArticle(id)

  if (!article) notFound()

  const tousAuteurs = [
    { nom: article.auteur.name, institution: article.auteur.institution, principal: true },
    ...article.coAuteurs.map((c) => ({ nom: c.nom, institution: c.institution, principal: false })),
  ]

  const refCitation = [
    article.auteur.name,
    ...article.coAuteurs.map((c) => c.nom),
  ].join(', ') +
    (article.volume ? ` (${new Date(article.createdAt).getFullYear()}).` : '.') +
    ` ${article.titre}.` +
    ` SAONTSY — Revue FINIDY Research Center` +
    (article.volume ? `, Vol. ${article.volume}` : '') +
    (article.numero ? `(${article.numero})` : '') +
    (article.pages ? `, p. ${article.pages}` : '') +
    (article.doi ? `. https://doi.org/${article.doi}` : '') +
    '.'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    headline: article.titre,
    abstract: article.resume,
    author: tousAuteurs.map((a) => ({
      '@type': 'Person',
      name: a.nom,
      affiliation: a.institution ? { '@type': 'Organization', name: a.institution } : undefined,
    })),
    publisher: {
      '@type': 'Organization',
      name: 'FINIDY Research Center',
      url: 'https://finidy.mg',
    },
    isPartOf: {
      '@type': 'Periodical',
      name: 'SAONTSY — Revue FINIDY Research Center',
    },
    keywords: article.motsClés?.join(', ') ?? '',
    inLanguage: article.langue === 'EN' ? 'en' : article.langue === 'MG' ? 'mg' : 'fr',
    ...(article.doi ? { identifier: { '@type': 'PropertyValue', propertyID: 'DOI', value: article.doi } } : {}),
    url: `https://finidy.mg/revue/${article.id}`,
    datePublished: article.createdAt.toISOString(),
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Fil d'Ariane */}
      <nav className="flex items-center gap-2 text-sm font-body text-nihary-gris mb-8">
        <Link href="/revue" className="hover:text-nihary-or transition-colors">SAONTSY</Link>
        <span>/</span>
        <span className="text-nihary-brun truncate max-w-xs">{article.titre}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

        {/* ── Colonne principale ────────────────────────────────────── */}
        <div className="lg:col-span-2">

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="badge">
              <BookMarked size={11} strokeWidth={2} className="mr-1 inline" />
              {DISCIPLINES_LABELS[article.discipline] || article.discipline}
            </span>
            <span className="badge">
              <Globe size={11} strokeWidth={2} className="mr-1 inline" />
              {LANGUE_LABELS[article.langue] || article.langue}
            </span>
            {article.accesLibre && (
              <span className="badge" style={{ background: '#d1fae5', color: '#065f46' }}>
                Accès libre
              </span>
            )}
            {article.volume && (
              <span className="badge">
                Vol.&nbsp;{article.volume}{article.numero ? ` · n°${article.numero}` : ''}
                {article.pages ? ` · p.&nbsp;${article.pages}` : ''}
              </span>
            )}
          </div>

          {/* Titre */}
          <h1 className="font-display font-bold text-display-sm text-nihary-ambre-fonce leading-tight mb-4">
            {article.titre}
          </h1>

          {/* Auteurs */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mb-6">
            {tousAuteurs.map((a, i) => (
              <span key={i} className="text-sm font-body text-nihary-brun">
                <span className="font-medium">{a.nom}</span>
                {a.institution && (
                  <span className="text-nihary-gris"> · {a.institution}</span>
                )}
                {a.principal && tousAuteurs.length > 1 && (
                  <span className="ml-1 text-xs text-nihary-or">(auteur principal)</span>
                )}
              </span>
            ))}
          </div>

          {/* DOI */}
          {article.doi && (
            <div className="flex items-center gap-2 mb-6 text-sm font-mono text-nihary-gris">
              <Hash size={13} strokeWidth={2} />
              <span>DOI :</span>
              <a
                href={`https://doi.org/${article.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-nihary-or hover:underline"
              >
                {article.doi}
              </a>
            </div>
          )}

          <div className="divider-or mb-6" />

          {/* Résumé */}
          <section className="mb-8">
            <h2 className="font-display font-semibold text-lg text-nihary-ambre-fonce mb-3">Résumé</h2>
            <p className="font-body text-nihary-brun leading-relaxed text-[15px]">{article.resume}</p>
          </section>

          {/* Mots-clés */}
          {article.motsClés && article.motsClés.length > 0 && (
            <section className="mb-8">
              <h2 className="font-display font-semibold text-base text-nihary-ambre-fonce mb-3 flex items-center gap-2">
                <Tag size={15} strokeWidth={1.75} /> Mots-clés
              </h2>
              <div className="flex flex-wrap gap-2">
                {article.motsClés.map((mot) => (
                  <span key={mot}
                    className="px-3 py-1 bg-nihary-sable text-nihary-brun text-sm font-body rounded-full border border-nihary-sable-fonce">
                    {mot}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Validation comité scientifique */}
          <section className="card-sable p-5 mb-8">
            <div className="flex items-start gap-3">
              <ShieldCheck size={20} strokeWidth={1.75} className="text-nihary-or flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="font-display font-semibold text-nihary-ambre-fonce mb-1">
                  Évaluation par les pairs
                </h2>
                <p className="text-sm font-body text-nihary-brun leading-relaxed">
                  Cet article a été soumis à une évaluation en double aveugle par le comité scientifique
                  de <span className="font-medium">SAONTSY — Revue FINIDY Research Center</span>.
                  Il a été accepté après révision et répond aux standards de rigueur académique de la revue.
                </p>
                <Link href="/revue/comite"
                  className="mt-2 inline-flex items-center gap-1 text-xs text-nihary-or hover:underline font-body">
                  <Users size={12} strokeWidth={2} /> Voir le comité scientifique
                </Link>
              </div>
            </div>
          </section>

          {/* Citation */}
          <section className="mb-8">
            <h2 className="font-display font-semibold text-base text-nihary-ambre-fonce mb-3">
              Comment citer cet article
            </h2>
            <div className="bg-nihary-sable border border-nihary-sable-fonce rounded-lg p-4 font-mono text-xs text-nihary-brun leading-relaxed select-all">
              {refCitation}
            </div>
          </section>

          {/* Lecteur PDF intégré */}
          {article.fichierUrl && (
            <section>
              <h2 className="font-display font-semibold text-base text-nihary-ambre-fonce mb-4">
                Texte intégral
              </h2>
              <PdfViewer
                src={article.fichierUrl}
                titre={article.titre}
              />
            </section>
          )}
        </div>

        {/* ── Colonne latérale ──────────────────────────────────────── */}
        <aside className="space-y-5">

          {/* Thumbnail / couverture */}
          <div className="rounded-xl overflow-hidden border border-nihary-sable-fonce bg-nihary-sable aspect-[3/4] flex items-center justify-center">
            <div className="text-center p-6">
              <FileText size={48} strokeWidth={1} className="text-nihary-ambre mx-auto mb-3" />
              <p className="font-display font-semibold text-nihary-ambre-fonce text-sm leading-snug">
                SAONTSY
              </p>
              <p className="font-mono text-xs text-nihary-gris mt-1">
                {article.volume ? `Vol. ${article.volume}` : 'Revue'}
                {article.numero ? ` · n°${article.numero}` : ''}
              </p>
            </div>
          </div>

          {/* Accès texte intégral */}
          {article.fichierUrl ? (
            <div className="card-sable p-4 flex items-center gap-3">
              <ShieldCheck size={18} strokeWidth={1.75} className="text-nihary-or flex-shrink-0" />
              <div>
                <p className="text-xs font-body font-medium text-nihary-ambre-fonce">Texte intégral disponible</p>
                <p className="text-xs font-body text-nihary-gris mt-0.5">Lecture seule · pas de téléchargement</p>
              </div>
            </div>
          ) : (
            <div className="card-sable p-4 flex items-center gap-3 opacity-60">
              <FileText size={18} strokeWidth={1.75} className="text-nihary-gris flex-shrink-0" />
              <p className="text-xs font-body text-nihary-gris">Texte intégral bientôt disponible</p>
            </div>
          )}

          {/* Statistiques */}
          <div className="card p-4 space-y-3">
            <h3 className="font-display font-semibold text-sm text-nihary-ambre-fonce">Statistiques</h3>
            <div className="flex items-center gap-2 text-sm font-body text-nihary-gris">
              <Eye size={14} strokeWidth={1.75} className="text-nihary-or" />
              <span>{article.vues} consultations</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-body text-nihary-gris">
              <ArrowDownToLine size={14} strokeWidth={1.75} className="text-nihary-or" />
              <span>{article.telechargements} téléchargements</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-body text-nihary-gris">
              <Calendar size={14} strokeWidth={1.75} className="text-nihary-or" />
              <span>Publié le {new Date(article.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>

          {/* Informations bibliographiques */}
          <div className="card p-4 space-y-2 text-sm font-body">
            <h3 className="font-display font-semibold text-sm text-nihary-ambre-fonce mb-2">Références</h3>
            <div className="flex justify-between text-nihary-gris">
              <span>Revue</span>
              <span className="font-medium text-nihary-brun">SAONTSY</span>
            </div>
            {article.volume && (
              <div className="flex justify-between text-nihary-gris">
                <span>Volume</span>
                <span className="font-medium text-nihary-brun">{article.volume}</span>
              </div>
            )}
            {article.numero && (
              <div className="flex justify-between text-nihary-gris">
                <span>Numéro</span>
                <span className="font-medium text-nihary-brun">{article.numero}</span>
              </div>
            )}
            {article.pages && (
              <div className="flex justify-between text-nihary-gris">
                <span>Pages</span>
                <span className="font-medium text-nihary-brun">{article.pages}</span>
              </div>
            )}
            <div className="flex justify-between text-nihary-gris">
              <span>Éditeur</span>
              <span className="font-medium text-nihary-brun">FINIDY Research Center</span>
            </div>
          </div>

          {/* Lien externe DOI */}
          {article.doi && (
            <a
              href={`https://doi.org/${article.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost w-full justify-center text-sm"
            >
              <ExternalLink size={14} strokeWidth={1.75} />
              Voir sur DOI.org
            </a>
          )}

          {/* Retour à la revue */}
          <Link href="/revue" className="btn-ghost w-full justify-center text-sm">
            ← Retour à SAONTSY
          </Link>
        </aside>
      </div>
    </div>
  )
}
