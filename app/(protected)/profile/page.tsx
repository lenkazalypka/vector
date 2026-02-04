'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        
        // Получаем профиль
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        setProfile(profileData)
      }
      setLoading(false)
    }
    
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Доступ запрещен</h2>
          <p className="text-gray-600 mb-6">Войдите в систему чтобы увидеть эту страницу</p>
          <a href="/auth/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Войти
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Личный кабинет</h1>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="flex items-start space-x-6">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center">
              <span className="text-white text-3xl font-bold">
                {profile?.full_name?.[0] || user.email?.[0] || 'П'}
              </span>
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {profile?.full_name || 'Пользователь'}
              </h2>
              <p className="text-gray-600 mb-4">{user.email}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {profile?.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                
                {profile?.city && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <span>{profile.city}</span>
                  </div>
                )}
                
                {profile?.child_name && (
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-500" />
                    <span>Ребенок: {profile.child_name}</span>
                  </div>
                )}
                
                {profile?.age && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <span>Возраст: {profile.age} лет</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Участие в конкурсах */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Ваши конкурсы</h3>
          <div className="text-center py-8 text-gray-500">
            <p>Вы еще не участвовали в конкурсах</p>
            <a href="/contests" className="text-blue-600 hover:underline mt-2 inline-block">
              Посмотреть доступные конкурсы →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}