import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { MEMBRES_COMMUNAUTE } from '@/lib/communaute-scientifique'

const BASE_URL = 'https://finidy.mg'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/revue`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/revue/comite`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    ...MEMBRES_COMMUNAUTE.map((m) => ({
      url: `${BASE_URL}/revue/communaute/${m.id}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
    { url: `${BASE_URL}/magazine`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/entretiens`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/editions`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/colloques`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/colloques/appel`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/colloques/actes`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/universite-populaire`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/consultance`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/consultance/offres`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/a-propos`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${BASE_URL}/politique-editoriale`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/mentions-legales`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ]

  const [articles, magazineArticles, entretiens, livres, colloques, cours] = await Promise.all([
    prisma.articleRevue.findMany({
      where: { statut: 'PUBLIE' },
      select: { id: true, updatedAt: true },
    }).catch(() => []),
    prisma.article.findMany({
      where: { statut: 'PUBLIE' },
      select: { slug: true, updatedAt: true },
    }).catch(() => []),
    prisma.entretien.findMany({
      where: { statut: 'PUBLIE' },
      select: { slug: true, createdAt: true },
    }).catch(() => []),
    prisma.livre.findMany({
      select: { slug: true, createdAt: true },
    }).catch(() => []),
    prisma.colloque.findMany({
      select: { slug: true, createdAt: true },
    }).catch(() => []),
    prisma.cours.findMany({
      where: { statut: 'PUBLIE' },
      select: { slug: true, createdAt: true },
    }).catch(() => []),
  ])

  const dynamicRoutes: MetadataRoute.Sitemap = [
    ...articles.map((a) => ({
      url: `${BASE_URL}/revue/${a.id}`,
      lastModified: a.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...magazineArticles.map((a) => ({
      url: `${BASE_URL}/magazine/${a.slug}`,
      lastModified: a.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...entretiens.map((e) => ({
      url: `${BASE_URL}/entretiens/${e.slug}`,
      lastModified: e.createdAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...livres.map((l) => ({
      url: `${BASE_URL}/editions/${l.slug}`,
      lastModified: l.createdAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...colloques.map((c) => ({
      url: `${BASE_URL}/colloques/${c.slug}`,
      lastModified: c.createdAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
    ...cours.map((c) => ({
      url: `${BASE_URL}/universite-populaire/${c.slug}`,
      lastModified: c.createdAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]

  return [...staticRoutes, ...dynamicRoutes]
}
