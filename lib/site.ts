const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.AUTH_URL || process.env.NEXTAUTH_URL || 'https://finidy.mg'
export const SITE_URL = configuredUrl.replace(/\/$/, '')
export const absoluteUrl = (path = '/') => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
