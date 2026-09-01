'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import BackToTop from '@/components/layout/BackToTop'
import CookieConsent from '@/components/privacy/CookieConsent'
import NewsletterPopup from '@/components/newsletter/NewsletterPopup'
import NavigationLoading from '@/components/layout/NavigationLoading'

export default function MainShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname.startsWith('/auth/')

  if (isAuthPage) return <><NavigationLoading /><main className="min-h-screen">{children}</main></>

  return (
    <div className="flex min-h-screen flex-col">
      <NavigationLoading />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <BackToTop />
      <CookieConsent />
      <NewsletterPopup />
    </div>
  )
}
