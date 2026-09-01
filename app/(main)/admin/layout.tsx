import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth/config'
import { getAccess } from '@/lib/auth/permissions'
export const metadata: Metadata = { robots: { index: false, follow: false, nocache: true } }
const adminPermissions = ['MANAGE_OFFERS','MODERATE_CONTENT','MANAGE_USERS','VIEW_CRM']
export default async function AdminLayout({ children }: { children: React.ReactNode }) { const session=await auth();if(!session?.user?.id)redirect('/auth/connexion?callbackUrl=/admin');const access=await getAccess(session.user.id);if(!access||!access.permissions.some(permission=>adminPermissions.includes(permission)))redirect('/dashboard');return children }
