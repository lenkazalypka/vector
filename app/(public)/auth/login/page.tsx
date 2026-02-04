'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [rememberMe, setRememberMe] = useState(false)

  // Проверяем, есть ли сохраненные данные
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail')
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }))
      setRememberMe(true)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        // Конкретные ошибки
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Неверный email или пароль')
        }
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Подтвердите email для входа')
        }
        throw error
      }

      // Сохраняем email если выбрано "Запомнить меня"
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email)
      } else {
        localStorage.removeItem('rememberedEmail')
      }

      // Проверяем, есть ли профиль пользователя
      if (data.user) {
        let profile = null
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single()

          if (profileError) {
            console.log('Профиль не найден, создаем...', profileError.message)
            
            // Создаем базовый профиль если его нет
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: data.user.id,
                email: formData.email,
                full_name: data.user.user_metadata?.full_name || 'Пользователь',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
            
            if (insertError) {
              console.error('Ошибка создания профиля:', insertError)
            }
          } else {
            profile = profileData
          }
        } catch (err) {
          console.error('Ошибка при работе с профилем:', err)
        }

        // Перенаправление на нужную страницу
        if (profile?.is_admin) {
          router.push('/admin')
        } else {
          router.push('/profile')
        }
        
        // Принудительно обновляем страницу
        setTimeout(() => {
          window.location.reload()
        }, 100)
      }
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'Ошибка при входе')
      
      // Автоматическая очистка ошибки
      setTimeout(() => {
        setError(null)
      }, 5000)
    } finally {
      setLoading(false)
    }
  }

  // Восстановление пароля
  const handleResetPassword = async () => {
    if (!formData.email) {
      setError('Введите email для восстановления пароля')
      return
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) throw error
      
      setError('Ссылка для восстановления отправлена на email')
      setTimeout(() => setError(null), 5000)
    } catch (err: any) {
      setError(err.message || 'Ошибка при отправке')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-green-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-4 group">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-vector-electric-blue to-vector-teal flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <span className="font-accent font-bold text-xl text-white">→</span>
            </div>
            <span className="font-accent text-2xl font-bold bg-gradient-to-r from-vector-electric-blue to-vector-teal bg-clip-text text-transparent">
              ВЕКТОР
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Вход в аккаунт</h1>
          <p className="text-gray-600 mt-2">Войдите для управления участием в конкурсах</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className={`p-4 rounded-lg flex items-start animate-fadeIn ${
                  error.includes('отправлена') 
                    ? 'bg-green-50 border-l-4 border-green-500 text-green-700'
                    : 'bg-red-50 border-l-4 border-red-500 text-red-700'
                }`}>
                  <AlertCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{error}</p>
                    {error.includes('Неверный') && (
                      <button
                        type="button"
                        onClick={handleResetPassword}
                        className="text-sm mt-1 underline hover:no-underline"
                      >
                        Забыли пароль?
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vector-electric-blue focus:border-transparent outline-none transition-all"
                  placeholder="example@mail.ru"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-gray-800">
                    Пароль
                  </label>
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    className="text-sm text-vector-electric-blue hover:underline"
                  >
                    Забыли пароль?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vector-electric-blue focus:border-transparent outline-none transition-all pr-12"
                    placeholder="Введите пароль"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-vector-electric-blue focus:ring-vector-electric-blue rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                  Запомнить меня
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-semibold py-3.5 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Вход...
                  </>
                ) : (
                  <>
                    Войти
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </>
                )}
              </button>

              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-gray-600">
                  Нет аккаунта?{' '}
                  <Link href="/auth/register" className="text-vector-electric-blue hover:underline font-semibold">
                    Зарегистрироваться
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Вход в систему означает согласие с{' '}
            <Link href="/legal/privacy" className="text-vector-electric-blue hover:underline">
              Политикой конфиденциальности
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}