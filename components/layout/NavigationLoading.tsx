'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function NavigationLoading() {
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)

  useEffect(() => setLoading(false), [pathname])

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const target = event.target instanceof Element ? event.target.closest('a') : null
      if (!target || target.target === '_blank' || target.hasAttribute('download')) return
      const destination = new URL(target.href, window.location.href)
      const current = new URL(window.location.href)
      if (destination.origin !== current.origin || destination.pathname === current.pathname) return
      setLoading(true)
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  if (!loading) return null
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[100]" role="status" aria-label="Changement de page en cours">
      <div className="h-1 w-full overflow-hidden bg-nihary-or/20">
        <div className="h-full w-1/3 animate-[navigation-progress_1s_ease-in-out_infinite] bg-nihary-or" />
      </div>
      <span className="sr-only">Chargement de la nouvelle page</span>
    </div>
  )
}
