import Link from 'next/link'
import { PILIERS } from '@/lib/piliers'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-nihary-ambre-fonce text-nihary-or-pale border-t border-nihary-ambre/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        {/* ── Ligne principale ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-x-8 gap-y-10">

          {/* Brand */}
          <div className="md:col-span-2 xl:col-span-1">
            <span className="font-display font-bold text-2xl text-nihary-or"
              style={{ letterSpacing: '-0.02em' }}>
              FINIDY <span className="font-normal">Research Center</span>
            </span>
            <div className="text-xs font-mono tracking-widest uppercase text-nihary-gris-clair mt-1 mb-3">
              Sciences Humaines & Sociales · Madagascar
            </div>
            <p className="text-sm text-nihary-gris-clair leading-relaxed max-w-xs">
              Plateforme de publication scientifique ancrée à Madagascar, ouverte sur l'Océan Indien et l'Afrique.
            </p>
            <div className="mt-5 space-y-1 text-xs text-nihary-gris-clair">
              <p>Revue Saontsy · ISSN 3080-1842</p>
              <p>Antananarivo, Madagascar</p>
              <a href="mailto:contact@finidy.mg"
                className="hover:text-nihary-or transition-colors">
                contact@finidy.mg
              </a>
            </div>
          </div>

          {/* Un bloc par pilier */}
          {PILIERS.map((pilier) => {
            const Icon = pilier.icon
            return (
              <div key={pilier.id}>
                <Link
                  href={pilier.href}
                  className="flex items-center gap-1.5 font-display font-semibold text-nihary-or
                    text-sm mb-3 hover:text-nihary-or-pale transition-colors group"
                >
                  <Icon size={13} strokeWidth={2} className="opacity-70 group-hover:opacity-100" />
                  {pilier.label}
                </Link>
                <ul className="space-y-2">
                  {(pilier.sousLiens ?? []).map((sub) => (
                    <li key={sub.href}>
                      <Link
                        href={sub.href}
                        className="text-xs text-nihary-gris-clair hover:text-nihary-or transition-colors leading-snug"
                      >
                        {sub.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* ── Séparateur ───────────────────────────────────────────── */}
        <div className="my-10 border-t border-nihary-ambre/25" />

        {/* ── Ligne secondaire ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">

          {/* Disciplines */}
          <div>
            <h4 className="font-display font-semibold text-nihary-or text-xs uppercase tracking-widest mb-3">
              Disciplines
            </h4>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5">
              {[
                'Sociologie', 'Anthropologie', 'Histoire', 'Géographie humaine',
                'Économie', 'Droit', 'Science politique', 'Philosophie',
                'Psychologie sociale', 'Linguistique', 'Démographie',
                'Études de genre', 'Études malgaches',
              ].map((d) => (
                <span key={d} className="text-xs text-nihary-gris-clair hover:text-nihary-or cursor-default transition-colors">
                  {d}
                </span>
              ))}
            </div>
          </div>

          {/* Informations */}
          <div>
            <h4 className="font-display font-semibold text-nihary-or text-xs uppercase tracking-widest mb-3">
              Informations
            </h4>
            <ul className="space-y-2">
              {[
                ['À propos', '/a-propos'],
                ['Politique éditoriale', '/politique-editoriale'],
                ['Comité scientifique', '/revue/comite'],
                ['Contact', '/contact'],
                ['Mentions légales', '/mentions-legales'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-xs text-nihary-gris-clair hover:text-nihary-or transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Rejoindre */}
          <div>
            <h4 className="font-display font-semibold text-nihary-or text-xs uppercase tracking-widest mb-3">
              Contribuer
            </h4>
            <ul className="space-y-2">
              {[
                ['Soumettre un article', '/revue/soumettre'],
                ['Proposer un entretien', '/entretiens/proposer'],
                ['Proposer un cours', '/universite-populaire/enseigner'],
                ['Devenir expert', '/consultance/rejoindre'],
                ['Soumettre un manuscrit', '/editions/soumettre'],
                ['Call for Papers', '/colloques/appel'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-xs text-nihary-gris-clair hover:text-nihary-or transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Copyright ────────────────────────────────────────────── */}
        <div className="mt-10 pt-6 border-t border-nihary-ambre/25 flex flex-col sm:flex-row
          items-center justify-between gap-3 text-xs text-nihary-gris-clair">
          <p>© {year} FINIDY Research Center. Tous droits réservés.</p>
          <p className="font-mono">finidy.mg · Sciences Humaines & Sociales · Madagascar</p>
        </div>
      </div>
    </footer>
  )
}
