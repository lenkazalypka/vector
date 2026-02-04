// app/admin/layout.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Shield, Users, Trophy, FileText, Settings, BarChart, Home } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        setProfile(profileData)

        // Если пользователь не админ, перенаправляем
        if (!profileData?.is_admin) {
          router.push('/profile')
        }
      } else {
        router.push('/auth/login')
      }
      setLoading(false)
    }
    
    fetchData()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Боковое меню */}
      <aside className="w-64 bg-gradient-to-b from-purple-900 to-blue-900 text-white shadow-xl">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <Shield className="h-8 w-8" />
            <h1 className="text-xl font-bold">Админ-панель</h1>
          </div>
          
          <div className="mb-8">
            <p className="text-sm text-gray-300 mb-2">Вы вошли как:</p>
            <p className="font-semibold">{profile?.full_name || 'Администратор'}</p>
            <p className="text-sm text-gray-400 truncate">{user?.email}</p>
          </div>

          <nav className="space-y-2">
            <Link 
              href="/admin" 
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              <BarChart className="h-5 w-5" />
              <span>Дашборд</span>
            </Link>
            
            <Link 
              href="/admin/users" 
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Users className="h-5 w-5" />
              <span>Пользователи</span>
            </Link>
            
            <Link 
              href="/admin/contests" 
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Trophy className="h-5 w-5" />
              <span>Конкурсы</span>
            </Link>
            
            <Link 
              href="/admin/content" 
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              <FileText className="h-5 w-5" />
              <span>Контент</span>
            </Link>
            
            <Link 
              href="/admin/settings" 
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Settings className="h-5 w-5" />
              <span>Настройки</span>
            </Link>
          </nav>
        </div>

        <div className="p-6 border-t border-white/10 mt-auto">
          <div className="space-y-3">
            <Link 
              href="/" 
              className="flex items-center space-x-3 text-sm text-gray-300 hover:text-white"
            >
              <Home className="h-4 w-4" />
              <span>На главную</span>
            </Link>
            
            <button
              onClick={() => {
                supabase.auth.signOut()
                router.push('/')
              }}
              className="w-full text-left flex items-center space-x-3 text-sm text-red-300 hover:text-red-100"
            >
              <span>Выйти из админки</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Основной контент */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}