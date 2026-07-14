import type { Metadata } from 'next'
import './globals.css'
import SessionProvider from '@/components/SessionProvider'

const SITE_URL = 'https://finidy.mg'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: '%s | FINIDY Research Center',
    default: 'FINIDY Research Center — Plateforme SHS Madagascar',
  },
  description:
    "FINIDY Research Center est la plateforme de référence en Sciences Humaines et Sociales de Madagascar et de l'Océan Indien. Revue peer-reviewed SAONTSY, magazine, consultance, édition scientifique, colloques et université populaire.",
  keywords: [
    'SHS Madagascar', 'sciences humaines sociales', 'revue scientifique Madagascar',
    'SAONTSY revue', 'FINIDY Research Center', 'publication académique', 'peer review Madagascar',
    'sociologie Madagascar', 'anthropologie océan Indien', 'recherche Afrique',
  ],
  authors: [{ name: 'FINIDY Research Center', url: SITE_URL }],
  creator: 'FINIDY Research Center',
  publisher: 'FINIDY Research Center',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: SITE_URL },
  openGraph: {
    siteName: 'FINIDY Research Center',
    locale: 'fr_MG',
    type: 'website',
    url: SITE_URL,
    title: 'FINIDY Research Center — Plateforme SHS Madagascar',
    description: "Plateforme de référence en Sciences Humaines et Sociales de Madagascar et de l'Océan Indien.",
  },
  twitter: {
    card: 'summary_large_image',
    site: '@FINIDY_RC',
    creator: '@FINIDY_RC',
    title: 'FINIDY Research Center',
    description: "Plateforme de référence en Sciences Humaines et Sociales de Madagascar.",
  },
  manifest: '/manifest.json',
  icons: { icon: '/favicon.ico' },
}

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ResearchOrganization',
  name: 'FINIDY Research Center',
  alternateName: 'FINIDY',
  url: SITE_URL,
  description: "Centre de recherche en Sciences Humaines et Sociales de Madagascar et de l'Océan Indien.",
  foundingDate: '2024',
  areaServed: ['Madagascar', 'Océan Indien', 'Afrique'],
  knowsAbout: ['Sciences humaines', 'Sciences sociales', 'Sociologie', 'Anthropologie'],
  sameAs: [],
  publication: {
    '@type': 'Periodical',
    name: 'SAONTSY — Revue FINIDY Research Center',
    issueFrequency: 'Biannual',
    publisher: { '@type': 'Organization', name: 'FINIDY Research Center' },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
