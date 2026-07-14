'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/layout/Logo'

export default function InscriptionPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', institution: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/inscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      router.push('/auth/connexion?registered=1')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-nihary-sable flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo size="lg" />
          <p className="text-nihary-gris font-body mt-3">Rejoindre la communauté FINIDY Research Center</p>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-body font-medium text-nihary-brun mb-1">Nom complet *</label>
              <input className="input" required value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Dr. Marie Razafindrabe" />
            </div>
            <div>
              <label className="block text-sm font-body font-medium text-nihary-brun mb-1">Email *</label>
              <input type="email" className="input" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-body font-medium text-nihary-brun mb-1">Mot de passe *</label>
              <input type="password" className="input" required minLength={8} value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Minimum 8 caractères" />
            </div>
            <div>
              <label className="block text-sm font-body font-medium text-nihary-brun mb-1">Institution</label>
              <input className="input" value={form.institution}
                onChange={(e) => setForm({ ...form, institution: e.target.value })}
                placeholder="Université d'Antananarivo..." />
            </div>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-nihary text-sm text-red-700">{error}</div>
            )}
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? 'Création...' : 'Créer mon compte'}
            </button>
          </form>
          <p className="text-center text-sm text-nihary-gris font-body mt-4">
            Déjà un compte ?{' '}
            <Link href="/auth/connexion" className="text-nihary-or hover:underline">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
