import Link from 'next/link'

export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: { text: 'text-lg', sub: 'text-[8px]' },
    md: { text: 'text-xl', sub: 'text-[9px]' },
    lg: { text: 'text-3xl', sub: 'text-[11px]' },
  }

  return (
    <Link href="/" className="flex flex-col items-start leading-none group">
      <span
        className={`font-display font-bold text-nihary-ambre-fonce tracking-tight
          ${sizes[size].text}
          group-hover:text-nihary-or transition-colors duration-200`}
        style={{ letterSpacing: '-0.02em' }}
      >
        FINIDY <span className="text-nihary-or">Research Center</span>
      </span>
      <span
        className={`font-mono tracking-widest uppercase text-nihary-gris
          ${sizes[size].sub} mt-0.5`}
      >
        Sciences Humaines & Sociales · Madagascar
      </span>
    </Link>
  )
}
