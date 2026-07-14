'use client'
import { useEffect, useState } from 'react'
import { ShieldCheck, Check, X, Inbox } from 'lucide-react'
import { DISCIPLINES_LABELS } from '@/lib/disciplines'

interface PendingItem {
  id: string
  titre: string
  resume?: string
  chapeau?: string
  discipline: string
  auteur: { name: string | null; email: string }
  createdAt: string
}

export default function ModerationPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [articlesRevue, setArticlesRevue] = useState<PendingItem[]>([])
  const [articlesMagazine, setArticlesMagazine] = useState<PendingItem[]>([])
  const [entretiens, setEntretiens] = useState<PendingItem[]>([])
  const [processingId, setProcessingId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/moderation')
      if (res.status === 403) {
        setError('Accès réservé aux administrateurs.')
        return
      }
      const data = await res.json()
      setArticlesRevue(data.articlesRevue || [])
      setArticlesMagazine(data.articlesMagazine || [])
      setEntretiens(data.entretiens || [])
    } catch {
      setError('Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleAction = async (type: 'articleRevue' | 'article' | 'entretien', id: string, statut: string) => {
    setProcessingId(id)
    try {
      const res = await fetch('/api/admin/moderation', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id, statut }),
      })
      if (!res.ok) throw new Error()
      if (type === 'articleRevue') setArticlesRevue((prev) => prev.filter((a) => a.id !== id))
      else if (type === 'article') setArticlesMagazine((prev) => prev.filter((a) => a.id !== id))
      else setEntretiens((prev) => prev.filter((a) => a.id !== id))
    } catch {
      alert('Erreur lors de la mise à jour')
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-20 text-center text-nihary-gris font-body">Chargement…</div>
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <ShieldCheck size={40} strokeWidth={1.25} className="mx-auto mb-4 text-nihary-ambre" />
        <p className="text-nihary-brun font-body">{error}</p>
      </div>
    )
  }

  const totalPending = articlesRevue.length + articlesMagazine.length + entretiens.length

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <span className="eyebrow">Administration</span>
      <h1 className="font-display font-bold text-display-md text-nihary-ambre-fonce mt-1 mb-8">
        Modération du contenu
      </h1>

      {totalPending === 0 ? (
        <div className="card-sable p-12 text-center">
          <Inbox size={40} strokeWidth={1.25} className="mx-auto mb-4 text-nihary-ambre" />
          <p className="text-nihary-brun font-body">Aucun contenu en attente de modération.</p>
        </div>
      ) : (
        <div className="space-y-10">

          {articlesRevue.length > 0 && (
            <section>
              <h2 className="font-display font-semibold text-lg text-nihary-ambre-fonce mb-3">
                Revue scientifique ({articlesRevue.length})
              </h2>
              <div className="space-y-3">
                {articlesRevue.map((item) => (
                  <div key={item.id} className="card p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <span className="badge mb-2">{DISCIPLINES_LABELS[item.discipline] || item.discipline}</span>
                        <h3 className="font-display font-medium text-nihary-ambre-fonce">{item.titre}</h3>
                        <p className="text-sm text-nihary-gris font-body mt-1">
                          {item.auteur.name} · {item.auteur.email}
                        </p>
                        <p className="text-sm text-nihary-brun font-body mt-2 line-clamp-2">{item.resume}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          disabled={processingId === item.id}
                          onClick={() => handleAction('articleRevue', item.id, 'PUBLIE')}
                          className="btn-primary !py-1.5 !px-3 text-xs">
                          <Check size={14} strokeWidth={2} /> Publier
                        </button>
                        <button
                          disabled={processingId === item.id}
                          onClick={() => handleAction('articleRevue', item.id, 'REJETE')}
                          className="btn-outline !py-1.5 !px-3 text-xs border-red-300 text-red-600 hover:bg-red-50">
                          <X size={14} strokeWidth={2} /> Rejeter
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {articlesMagazine.length > 0 && (
            <section>
              <h2 className="font-display font-semibold text-lg text-nihary-ambre-fonce mb-3">
                Magazine ({articlesMagazine.length})
              </h2>
              <div className="space-y-3">
                {articlesMagazine.map((item) => (
                  <div key={item.id} className="card p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <span className="badge mb-2">{DISCIPLINES_LABELS[item.discipline] || item.discipline}</span>
                        <h3 className="font-display font-medium text-nihary-ambre-fonce">{item.titre}</h3>
                        <p className="text-sm text-nihary-gris font-body mt-1">
                          {item.auteur.name} · {item.auteur.email}
                        </p>
                        <p className="text-sm text-nihary-brun font-body mt-2 line-clamp-2">{item.chapeau}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          disabled={processingId === item.id}
                          onClick={() => handleAction('article', item.id, 'PUBLIE')}
                          className="btn-primary !py-1.5 !px-3 text-xs">
                          <Check size={14} strokeWidth={2} /> Publier
                        </button>
                        <button
                          disabled={processingId === item.id}
                          onClick={() => handleAction('article', item.id, 'BROUILLON')}
                          className="btn-outline !py-1.5 !px-3 text-xs border-red-300 text-red-600 hover:bg-red-50">
                          <X size={14} strokeWidth={2} /> Rejeter
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {entretiens.length > 0 && (
            <section>
              <h2 className="font-display font-semibold text-lg text-nihary-ambre-fonce mb-3">
                Entretiens ({entretiens.length})
              </h2>
              <div className="space-y-3">
                {entretiens.map((item) => (
                  <div key={item.id} className="card p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <span className="badge mb-2">{DISCIPLINES_LABELS[item.discipline] || item.discipline}</span>
                        <h3 className="font-display font-medium text-nihary-ambre-fonce">{item.titre}</h3>
                        <p className="text-sm text-nihary-gris font-body mt-1">
                          {item.auteur.name} · {item.auteur.email}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          disabled={processingId === item.id}
                          onClick={() => handleAction('entretien', item.id, 'PUBLIE')}
                          className="btn-primary !py-1.5 !px-3 text-xs">
                          <Check size={14} strokeWidth={2} /> Publier
                        </button>
                        <button
                          disabled={processingId === item.id}
                          onClick={() => handleAction('entretien', item.id, 'BROUILLON')}
                          className="btn-outline !py-1.5 !px-3 text-xs border-red-300 text-red-600 hover:bg-red-50">
                          <X size={14} strokeWidth={2} /> Rejeter
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
