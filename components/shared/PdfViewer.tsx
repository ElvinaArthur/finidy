"use client"
import { useEffect, useState } from 'react'
import { BookOpen, ChevronDown, ChevronUp, Lock } from 'lucide-react'

interface PdfViewerProps {
  src: string   // ex: /uploads/articles-pdf/article-xxx.pdf
  titre: string
}

export default function PdfViewer({ src, titre }: PdfViewerProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const openFromHash = () => {
      if (window.location.hash === '#lecture') setOpen(true)
    }

    openFromHash()
    window.addEventListener('hashchange', openFromHash)
    return () => window.removeEventListener('hashchange', openFromHash)
  }, [])

  // Les articles passent par la route inline : l'URL statique est bloquée
  // par middleware afin de ne pas exposer un lien de téléchargement direct.
  const readerSrc = src.startsWith('/uploads/articles-pdf/')
    ? src.replace('/uploads/articles-pdf/', '/api/pdf/')
    : src
  const iframeSrc = `${readerSrc}#toolbar=0&navpanes=0&scrollbar=1`

  return (
    <div className="mb-8">
      <button
        onClick={() => setOpen((v) => !v)}
        className="btn-primary w-full sm:w-auto justify-center"
      >
        <BookOpen size={16} strokeWidth={2} />
        {open ? 'Fermer le lecteur' : "Lire l'article"}
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {open && (
        <div className="mt-4 rounded-xl overflow-hidden border border-nihary-sable-fonce shadow-nihary-lg">

          {/* Bandeau protection */}
          <div className="flex items-center gap-2 px-4 py-2 bg-nihary-sable border-b border-nihary-sable-fonce text-xs font-body text-nihary-gris">
            <Lock size={12} strokeWidth={2} className="text-nihary-or flex-shrink-0" />
            <span>Lecture seule — document protégé · téléchargement désactivé</span>
          </div>

          {/* iframe — Chrome affiche nativement les PDFs en iframe via URL statique */}
          <iframe
            src={iframeSrc}
            title={titre}
            className="w-full border-0"
            style={{ height: '80vh' }}
          />

          <div className="px-4 py-1.5 bg-nihary-sable border-t border-nihary-sable-fonce text-xs font-body text-nihary-gris text-center">
            © FINIDY Research Center — SAONTSY · Tous droits réservés
          </div>
        </div>
      )}
    </div>
  )
}
