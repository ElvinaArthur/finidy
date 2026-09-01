'use client'

import { useEffect, useState } from 'react'
import { Mail, X } from 'lucide-react'
import NewsletterForm from './NewsletterForm'
import { COOKIE_CONSENT_KEY } from '@/components/privacy/CookieConsent'

const DISMISSED_KEY = 'finidy-newsletter-dismissed-until'

export default function NewsletterPopup() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (localStorage.getItem('finidy-newsletter-subscribed') === 'true') return
    const dismissedUntil = Number(localStorage.getItem(DISMISSED_KEY) || 0)
    if (dismissedUntil > Date.now()) return
    let timer: ReturnType<typeof setTimeout> | undefined
    const schedule = () => { if (!timer && localStorage.getItem(COOKIE_CONSENT_KEY)) timer = setTimeout(() => setOpen(true), 12000) }
    schedule(); window.addEventListener('finidy:consent-updated', schedule)
    return () => { if (timer) clearTimeout(timer); window.removeEventListener('finidy:consent-updated', schedule) }
  }, [])

  const close = () => { localStorage.setItem(DISMISSED_KEY, String(Date.now() + 30 * 24 * 60 * 60 * 1000)); setOpen(false) }
  useEffect(() => {
    if (!open) return
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', key); return () => window.removeEventListener('keydown', key)
  }, [open])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 p-4" role="dialog" aria-modal="true" aria-labelledby="newsletter-title" onMouseDown={(e) => { if (e.target === e.currentTarget) close() }}>
      <section className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-stone-50 p-6 shadow-2xl sm:p-9">
        <button onClick={close} aria-label="Fermer" className="absolute right-4 top-4 rounded-full p-2 text-stone-600 hover:bg-stone-200"><X size={20} /></button>
        <Mail className="mb-5 text-nihary-ambre-fonce" size={30} />
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-nihary-ambre">La lettre FINIDY</p>
        <h2 id="newsletter-title" className="mt-2 pr-8 font-display text-2xl font-semibold text-stone-950 sm:text-3xl">Suivez la recherche qui éclaire Madagascar</h2>
        <p className="mb-6 mt-3 text-sm leading-6 text-stone-600">Recevez les nouvelles publications, les appels à contribution et les prochains événements. Pas de messages superflus.</p>
        <NewsletterForm source="popup" onSuccess={() => localStorage.removeItem(DISMISSED_KEY)} />
      </section>
    </div>
  )
}
