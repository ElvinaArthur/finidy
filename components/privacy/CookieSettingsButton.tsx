'use client'

export default function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event('finidy:open-cookie-settings'))}
      className="text-xs text-nihary-gris-clair hover:text-nihary-or transition-colors"
    >
      Paramètres des cookies
    </button>
  )
}
