'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Users, Trophy, FileText, Settings, Shield, BarChart, Mail, Bell } from 'lucide-react'

export default function AdminPage() {
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
        
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        if (error) {
          console.error('Ошибка загрузки профиля админа:', error)
          router.push('/profile')
          return
        }
        
        setProfile(profileData)

        // Если пользователь не админ, перенаправляем (ПРОВЕРКА ПО role!)
        if (profileData?.role !== 'admin') {
          console.log('Пользователь не админ, роль:', profileData?.role)
          router.push('/profile')
          return
        }
      } else {
        router.push('/auth/login')
        return
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
    <div className="min-h-screen bg-gray-100">
      {/* Админ хедер */}
      <header className="bg-gradient-to-r from-purple-700 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">Панель администратора</h1>
                <p className="text-sm opacity-80">Добро пожаловать, {profile?.full_name || 'Админ'}</p>
                <p className="text-xs opacity-60">Роль: {profile?.role}</p>
              </div>
            </div>
            <button
              onClick={() => {
                supabase.auth.signOut()
                router.push('/')
              }}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
            >
              Выйти
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Пользователей</p>
                <p className="text-3xl font-bold">156</p>
              </div>
              <Users className="h-10 w-10 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Конкурсов</p>
                <p className="text-3xl font-bold">24</p>
              </div>
              <Trophy className="h-10 w-10 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Работ</p>
                <p className="text-3xl font-bold">389</p>
              </div>
              <FileText className="h-10 w-10 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">На модерации</p>
                <p className="text-3xl font-bold">12</p>
              </div>
              <Bell className="h-10 w-10 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Основные инструменты */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Левая колонка - Быстрые действия */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Быстрые действия
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => router.push('/admin/users')}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-4 rounded-lg transition-colors flex items-center"
                >
                  <Users className="mr-3 h-5 w-5" />
                  Управление пользователями
                </button>
                <button 
                  onClick={() => router.push('/admin/contests')}
                  className="bg-green-50 hover:bg-green-100 text-green-700 p-4 rounded-lg transition-colors flex items-center"
                >
                  <Trophy className="mr-3 h-5 w-5" />
                  Создать конкурс
                </button>
                <button 
                  onClick={() => router.push('/admin/moderation')}
                  className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 p-4 rounded-lg transition-colors flex items-center"
                >
                  <FileText className="mr-3 h-5 w-5" />
                  Модерация работ
                </button>
                <button 
                  onClick={() => router.push('/admin/mailing')}
                  className="bg-purple-50 hover:bg-purple-100 text-purple-700 p-4 rounded-lg transition-colors flex items-center"
                >
                  <Mail className="mr-3 h-5 w-5" />
                  Рассылка
                </button>
              </div>
            </div>

            {/* Последние пользователи */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Последние пользователи</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 text-left">Имя</th>
                      <th className="py-3 text-left">Email</th>
                      <th className="py-3 text-left">Город</th>
                      <th className="py-3 text-left">Регистрация</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-3">Иванов Иван</td>
                      <td className="py-3">ivan@mail.ru</td>
                      <td className="py-3">Москва</td>
                      <td className="py-3">2 дня назад</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-3">Петрова Мария</td>
                      <td className="py-3">maria@mail.ru</td>
                      <td className="py-3">Санкт-Петербург</td>
                      <td className="py-3">5 дней назад</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Правая колонка - Статистика */}
          <div>
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <BarChart className="mr-2 h-5 w-5" />
                Статистика
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Регистраций за неделю</p>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-3/4"></div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Активных конкурсов</p>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-2/3"></div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Работ на проверке</p>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Система */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Система</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Статус базы данных</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Online</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Пользователей онлайн</span>
                  <span className="font-bold">23</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Последний бэкап</span>
                  <span className="text-sm">Сегодня, 03:00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Ваша роль</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">
                    {profile?.role || 'user'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
