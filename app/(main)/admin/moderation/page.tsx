'use client'

import { useCallback, useEffect, useState } from 'react'
import { Check, Inbox, ShieldCheck, X } from 'lucide-react'
import { DISCIPLINES_LABELS } from '@/lib/disciplines'

type ContentType = 'articleRevue' | 'article' | 'entretien' | 'livre' | 'cours' | 'communication'
type Item = {
  id: string
  titre: string
  resume?: string
  chapeau?: string
  description?: string
  discipline?: string | null
  auteur?: { name: string | null; email: string }
  formateur?: { name: string | null; email: string }
  auteurs?: string
  colloque?: { titre: string }
}
type Section = { key: string; type: ContentType; label: string; accept: string; reject: string }

const SECTIONS: Section[] = [
  { key: 'articlesRevue', type: 'articleRevue', label: 'Revue scientifique', accept: 'PUBLIE', reject: 'REJETE' },
  { key: 'articlesMagazine', type: 'article', label: 'Magazine', accept: 'PUBLIE', reject: 'BROUILLON' },
  { key: 'entretiens', type: 'entretien', label: 'Entretiens', accept: 'PUBLIE', reject: 'BROUILLON' },
  { key: 'livres', type: 'livre', label: 'Livres', accept: 'PUBLIE', reject: 'REJETE' },
  { key: 'cours', type: 'cours', label: 'Cours', accept: 'PUBLIE', reject: 'BROUILLON' },
  { key: 'communications', type: 'communication', label: 'Communications', accept: 'ACCEPTE', reject: 'REJETE' },
]

export default function ModerationPage() {
  const [items, setItems] = useState<Record<string, Item[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [processingId, setProcessingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/admin/moderation')
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Erreur de chargement')
      setItems(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void load() }, [load])

  async function moderate(section: Section, id: string, statut: string) {
    setProcessingId(id)
    try {
      const response = await fetch('/api/admin/moderation', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: section.type, id, statut }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Mise à jour impossible')
      setItems((current) => ({ ...current, [section.key]: (current[section.key] || []).filter((item) => item.id !== id) }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Mise à jour impossible')
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-20 text-center">Chargement…</div>
  if (error && Object.keys(items).length === 0) return <div className="max-w-4xl mx-auto px-4 py-20 text-center"><ShieldCheck className="mx-auto mb-4" /><p>{error}</p></div>
  const total = SECTIONS.reduce((sum, section) => sum + (items[section.key]?.length || 0), 0)

  return <div className="max-w-4xl mx-auto px-4 py-10">
    <span className="eyebrow">Administration</span>
    <h1 className="font-display font-bold text-display-md text-nihary-ambre-fonce mt-1 mb-8">Modération du contenu</h1>
    {error && <p className="mb-4 text-sm text-red-700" role="alert">{error}</p>}
    {total === 0 ? <div className="card-sable p-12 text-center"><Inbox className="mx-auto mb-4" /><p>Aucun contenu en attente de modération.</p></div> :
      <div className="space-y-10">{SECTIONS.map((section) => {
        const sectionItems = items[section.key] || []
        if (!sectionItems.length) return null
        return <section key={section.key}>
          <h2 className="font-display font-semibold text-lg text-nihary-ambre-fonce mb-3">{section.label} ({sectionItems.length})</h2>
          <div className="space-y-3">{sectionItems.map((item) => {
            const owner = item.auteur || item.formateur
            const excerpt = item.resume || item.chapeau || item.description
            return <div key={item.id} className="card p-5 flex flex-wrap items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {item.discipline && <span className="badge mb-2">{DISCIPLINES_LABELS[item.discipline] || item.discipline}</span>}
                <h3 className="font-display font-medium text-nihary-ambre-fonce">{item.titre}</h3>
                <p className="text-sm text-nihary-gris mt-1">{owner ? `${owner.name || 'Sans nom'} · ${owner.email}` : item.auteurs || item.colloque?.titre}</p>
                {excerpt && <p className="text-sm text-nihary-brun mt-2 line-clamp-2">{excerpt}</p>}
              </div>
              <div className="flex gap-2">
                <button disabled={processingId === item.id} onClick={() => void moderate(section, item.id, section.accept)} className="btn-primary !py-1.5 !px-3 text-xs"><Check size={14} /> Accepter</button>
                <button disabled={processingId === item.id} onClick={() => void moderate(section, item.id, section.reject)} className="btn-outline !py-1.5 !px-3 text-xs text-red-600"><X size={14} /> Rejeter</button>
              </div>
            </div>
          })}</div>
        </section>
      })}</div>}
  </div>
}
