'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/layout/Logo'

export default function ConnexionPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const res = await signIn('credentials', {
      email: form.email, password: form.password, redirect: false,
    })
    if (res?.error) {
      setError('Email ou mot de passe incorrect')
      setLoading(false)
    } else {
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen bg-nihary-sable flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo size="lg" />
          <p className="text-nihary-gris font-body mt-3">Connexion à votre espace auteur</p>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-body font-medium text-nihary-brun mb-1">Email</label>
              <input type="email" className="input" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-body font-medium text-nihary-brun mb-1">Mot de passe</label>
              <input type="password" className="input" required value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-nihary text-sm text-red-700">{error}</div>
            )}
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
          <p className="text-center text-sm text-nihary-gris font-body mt-4">
            Pas encore de compte ?{' '}
            <Link href="/auth/inscription" className="text-nihary-or hover:underline">Créer un compte</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
