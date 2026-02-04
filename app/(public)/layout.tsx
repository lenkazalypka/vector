// app/(public)/layout.tsx
'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import '@/app/globals.css'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/auth')
  const isLegalPage = pathname?.startsWith('/legal')
  
  // НЕ показываем хедер/футер на auth и legal страницах
  if (isAuthPage || isLegalPage) {
    return <>{children}</>
  }

  // Показываем хедер/футер на остальных публичных страницах
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        {children}
      </main>
      <Footer />
    </div>
  )
}