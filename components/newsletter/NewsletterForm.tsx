'use client'

import { FormEvent, useState } from 'react'

export default function NewsletterForm({ source = 'footer', onSuccess }: { source?: 'footer' | 'popup'; onSuccess?: () => void }) {
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function submit(event: FormEvent) {
    event.preventDefault(); setState('loading'); setMessage('')
    try {
      const response = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, consent, source }) })
      const data = await response.json() as { error?: string }
      if (!response.ok) throw new Error(data.error || 'Inscription impossible.')
      setState('success'); localStorage.setItem('finidy-newsletter-subscribed', 'true'); onSuccess?.()
    } catch (error) { setState('error'); setMessage(error instanceof Error ? error.message : 'Inscription impossible.') }
  }

  if (state === 'success') return <p role="status" className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">Un e-mail vient de vous être envoyé. Cliquez sur le lien pour confirmer votre inscription.</p>
  return (
    <form onSubmit={submit} className="space-y-3">
      <label className="sr-only" htmlFor={`newsletter-email-${source}`}>Adresse e-mail</label>
      <div className="flex flex-col gap-2 sm:flex-row"><input id={`newsletter-email-${source}`} type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Votre adresse e-mail" className="min-w-0 flex-1 rounded-full border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none focus:ring-2 focus:ring-nihary-or" /><button disabled={state === 'loading'} className="rounded-full bg-nihary-or px-5 py-2.5 text-sm font-semibold text-nihary-ambre-fonce disabled:opacity-60">{state === 'loading' ? 'Envoi…' : "S'inscrire"}</button></div>
      <label className="flex items-start gap-2 text-xs leading-5 text-current/75"><input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-nihary-ambre-fonce" /><span>J’accepte de recevoir la lettre d’information FINIDY. Je pourrai me désinscrire à tout moment.</span></label>
      {state === 'error' && <p role="alert" className="text-xs text-red-700">{message}</p>}
    </form>
  )
}
