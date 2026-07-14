'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import { DISCIPLINES } from '@/lib/disciplines'

export default function ProposerEntretienPage() {
  const router = useRouter()
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    titre: '', description: '', format: 'PODCAST', discipline: '',
    dureeMinutes: '', mediaUrl: '', transcription: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/entretiens/proposer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur')
      setDone(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (done) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="flex justify-center mb-4 text-green-600">
        <CheckCircle2 size={48} strokeWidth={1.5} />
      </div>
      <h1 className="font-display font-bold text-2xl text-nihary-ambre-fonce mb-3">
        Entretien proposé
      </h1>
      <p className="text-nihary-gris font-body mb-6">
        Votre entretien est en attente de validation par l'équipe éditoriale.
      </p>
      <button onClick={() => router.push('/entretiens')} className="btn-primary">
        Retour aux entretiens
      </button>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <span className="eyebrow">Entretiens</span>
      <h1 className="font-display font-bold text-display-md text-nihary-ambre-fonce mt-1 mb-8">
        Proposer un entretien
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-body font-medium text-nihary-brun mb-1">Titre *</label>
          <input className="input" required value={form.titre}
            onChange={(e) => setForm({ ...form, titre: e.target.value })}
            placeholder="Entretien avec..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-body font-medium text-nihary-brun mb-1">Format *</label>
            <select className="input" required value={form.format}
              onChange={(e) => setForm({ ...form, format: e.target.value })}>
              <option value="PODCAST">Podcast</option>
              <option value="VIDEO">Vidéo</option>
              <option value="TEXTE">Texte</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-body font-medium text-nihary-brun mb-1">Durée (min)</label>
            <input type="number" min="1" className="input" value={form.dureeMinutes}
              onChange={(e) => setForm({ ...form, dureeMinutes: e.target.value })}
              placeholder="45" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-body font-medium text-nihary-brun mb-1">Discipline *</label>
          <select className="input" required value={form.discipline}
            onChange={(e) => setForm({ ...form, discipline: e.target.value })}>
            <option value="">Sélectionner une discipline</option>
            {DISCIPLINES.map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-body font-medium text-nihary-brun mb-1">Description *</label>
          <textarea className="input min-h-24 resize-y" required value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Présentation de l'entretien et de l'invité..." />
        </div>

        {form.format !== 'TEXTE' && (
          <div>
            <label className="block text-sm font-body font-medium text-nihary-brun mb-1">
              Lien média (audio/vidéo)
            </label>
            <input className="input" value={form.mediaUrl}
              onChange={(e) => setForm({ ...form, mediaUrl: e.target.value })}
              placeholder="https://... (fichier hébergé)" />
            <p className="text-xs text-nihary-gris font-body mt-1">
              L'upload direct sera disponible prochainement — pour l'instant, fournissez un lien.
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-body font-medium text-nihary-brun mb-1">
            Transcription {form.format === 'TEXTE' && '*'}
          </label>
          <textarea className="input min-h-40 resize-y" required={form.format === 'TEXTE'}
            value={form.transcription}
            onChange={(e) => setForm({ ...form, transcription: e.target.value })}
            placeholder="Texte intégral de l'entretien..." />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-nihary text-sm text-red-700">{error}</div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
          {loading ? 'Envoi...' : 'Proposer l\'entretien'}
        </button>

        <p className="text-xs text-nihary-gris font-body text-center">
          Vous devez être connecté pour proposer un entretien.
        </p>
      </form>
    </div>
  )
}
