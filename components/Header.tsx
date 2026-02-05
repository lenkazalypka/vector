'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User, LogOut, Shield } from 'lucide-react'

export default function Header() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      
      if (session?.user) {
        try {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          if (error) {
            console.error('Ошибка загрузки профиля:', error)
          } else {
            setProfile(profileData)
          }
        } catch (err) {
          console.error('Ошибка при запросе профиля:', err)
        }
      }
      
      setLoading(false)
    }
    
    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        
        if (session?.user) {
          try {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single()
            setProfile(profileData)
          } catch (err) {
            console.error('Ошибка при обновлении профиля:', err)
          }
        } else {
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (pathname?.startsWith('/auth') || pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center">
              <span className="font-bold text-white text-lg">→</span>
            </div>
            <span className="font-bold text-xl text-gray-900">ВЕКТОР</span>
          </Link>

          <nav className="flex items-center space-x-6">
            <Link href="/contests" className="text-gray-700 hover:text-blue-600 transition-colors">
              Конкурсы
            </Link>
            <Link href="/news" className="text-gray-700 hover:text-blue-600 transition-colors">
              Новости
            </Link>
            <Link href="/faq" className="text-gray-700 hover:text-blue-600 transition-colors">
              FAQ
            </Link>
            
            {loading ? (
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                {/* Кнопка Админки - только для админов (ПРОВЕРКА ПО role!) */}
                {profile?.role === 'admin' && (
                  <Link 
                    href="/admin" 
                    className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 px-4 py-2 rounded-lg transition-all"
                  >
                    <Shield className="h-4 w-4" />
                    <span>Админка</span>
                  </Link>
                )}
                
                <Link 
                  href="/profile" 
                  className="flex items-center space-x-2 bg-blue-50 text-blue-700 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>Личный кабинет</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Выйти</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/login" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Войти
                </Link>
                <Link href="/auth/register" className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                  Регистрация
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
