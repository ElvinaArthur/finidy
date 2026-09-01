'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

export const COOKIE_CONSENT_KEY = 'finidy-cookie-consent-v1'
type Consent = { necessary: true; preferences: boolean; analytics: boolean; marketing: boolean; updatedAt: string }
const initial: Consent = { necessary: true, preferences: false, analytics: false, marketing: false, updatedAt: '' }

export default function CookieConsent() {
  const [ready, setReady] = useState(false)
  const [settings, setSettings] = useState(false)
  const [consent, setConsent] = useState<Consent>(initial)
  const [hasChoice, setHasChoice] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (saved) {
      try { setConsent({ ...initial, ...JSON.parse(saved), necessary: true }); setHasChoice(true) } catch { localStorage.removeItem(COOKIE_CONSENT_KEY) }
    }
    setReady(true)
    const open = () => setSettings(true)
    window.addEventListener('finidy:open-cookie-settings', open)
    return () => window.removeEventListener('finidy:open-cookie-settings', open)
  }, [])

  const save = (next: Consent) => {
    const value = { ...next, necessary: true as const, updatedAt: new Date().toISOString() }
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(value))
    setConsent(value); setHasChoice(true); setSettings(false)
    window.dispatchEvent(new CustomEvent('finidy:consent-updated', { detail: value }))
  }

  if (!ready) return null
  return (
    <>
      {!hasChoice && !settings && (
        <section aria-label="Consentement aux cookies" className="fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-4xl rounded-2xl border border-stone-200 bg-white p-5 shadow-2xl sm:p-6">
          <h2 className="font-display text-lg font-semibold text-stone-900">Votre vie privée, simplement</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">Nous utilisons les éléments indispensables au fonctionnement du site. Les préférences et mesures d’audience restent désactivées sans votre accord.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={() => save({ ...initial, preferences: true, analytics: true, marketing: true })} className="rounded-full bg-nihary-ambre-fonce px-4 py-2 text-sm font-medium text-white">Tout accepter</button>
            <button onClick={() => save(initial)} className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-800">Refuser les optionnels</button>
            <button onClick={() => setSettings(true)} className="rounded-full px-4 py-2 text-sm font-medium text-nihary-ambre-fonce underline underline-offset-4">Personnaliser</button>
          </div>
        </section>
      )}
      {settings && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 p-4" role="dialog" aria-modal="true" aria-labelledby="cookie-title" onMouseDown={(e) => { if (e.target === e.currentTarget && hasChoice) setSettings(false) }}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4"><div><h2 id="cookie-title" className="font-display text-xl font-semibold">Paramètres des cookies</h2><p className="mt-1 text-sm text-stone-600">Modifiez vos choix à tout moment.</p></div>{hasChoice && <button aria-label="Fermer" onClick={() => setSettings(false)} className="rounded-full p-2 hover:bg-stone-100"><X size={20} /></button>}</div>
            <div className="mt-6 divide-y divide-stone-200">
              <Choice label="Nécessaires" description="Connexion, sécurité et mémorisation de votre consentement." checked disabled onChange={() => {}} />
              <Choice label="Préférences" description="Conserve vos choix d’affichage et de navigation." checked={consent.preferences} onChange={(preferences) => setConsent({ ...consent, preferences })} />
              <Choice label="Mesure d’audience" description="Aide à comprendre l’utilisation du site, si un outil de mesure est activé." checked={consent.analytics} onChange={(analytics) => setConsent({ ...consent, analytics })} />
              <Choice label="Communication" description="Autorise les outils de communication et campagnes non indispensables." checked={consent.marketing} onChange={(marketing) => setConsent({ ...consent, marketing })} />
            </div>
            <button onClick={() => save(consent)} className="mt-6 w-full rounded-full bg-nihary-ambre-fonce px-5 py-3 text-sm font-semibold text-white">Enregistrer mes choix</button>
          </div>
        </div>
      )}
    </>
  )
}

function Choice({ label, description, checked, disabled = false, onChange }: { label: string; description: string; checked: boolean; disabled?: boolean; onChange: (value: boolean) => void }) {
  return <label className="flex items-center justify-between gap-4 py-4"><span><span className="block text-sm font-semibold text-stone-900">{label}</span><span className="mt-1 block text-xs leading-5 text-stone-600">{description}</span></span><input type="checkbox" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5 accent-nihary-ambre-fonce" /></label>
}
