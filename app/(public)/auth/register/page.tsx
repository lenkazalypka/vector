'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    child_name: '',
    age: '',
    city: '',
    phone: '',
    consent_terms: false,
    consent_privacy: false,
    consent_personal_data: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Проверка согласий
    if (!formData.consent_terms || !formData.consent_privacy || !formData.consent_personal_data) {
      setError('Необходимо согласие со всеми документами')
      setLoading(false)
      return
    }

    try {
      // 1. Регистрация в Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) {
        // Проверяем конкретные ошибки
        if (authError.message.includes('already registered')) {
          throw new Error('Пользователь с таким email уже существует')
        }
        throw authError
      }

      // 2. Проверяем, есть ли админы в системе
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_admin', true)

      // Если админов нет - делаем первого пользователя админом
      const isFirstUser = count === 0

      // 3. Создание профиля в таблице profiles
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: formData.email,
            full_name: formData.full_name,
            child_name: formData.child_name || null,
            age: formData.age ? parseInt(formData.age) : null,
            city: formData.city || null,
            phone: formData.phone || null,
            consent_terms: formData.consent_terms,
            consent_privacy: formData.consent_privacy,
            consent_personal_data: formData.consent_personal_data,
            is_admin: isFirstUser, // Первый пользователь = админ!
            consent_given_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })

        if (profileError) {
          console.error('Profile creation error:', profileError)
          
          // Удаляем пользователя из auth, если профиль не создался
          await supabase.auth.signOut()
          
          if (profileError.message.includes('row-level security')) {
            throw new Error('Ошибка безопасности. Пожалуйста, сообщите администратору.')
          }
          throw profileError
        }

        // 4. Принудительный редирект на профиль
        setTimeout(() => {
          window.location.href = '/profile'
        }, 500)
      }
    } catch (err: any) {
      console.error('Registration error:', err)
      setError(err.message || 'Ошибка при регистрации')
      
      // Автоматическая очистка ошибки через 5 секунд
      setTimeout(() => {
        setError(null)
      }, 5000)
    } finally {
      setLoading(false)
    }
  }

  // Функция для валидации email
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
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
          <h1 className="text-3xl font-bold text-gray-900">Регистрация</h1>
          <p className="text-gray-600 mt-2">Создайте аккаунт для участия в конкурсах</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg flex items-start animate-fadeIn">
                  <AlertCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{error}</p>
                    <p className="text-sm mt-1 opacity-90">
                      {error.includes('безопасности') && 'Проверьте политики RLS в Supabase'}
                      {error.includes('уже существует') && 'Попробуйте войти или восстановить пароль'}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vector-electric-blue focus:border-transparent outline-none transition-all"
                    placeholder="example@mail.ru"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value })
                      if (e.target.value && !validateEmail(e.target.value)) {
                        setError('Введите корректный email')
                      } else if (error?.includes('email')) {
                        setError(null)
                      }
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Пароль <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vector-electric-blue focus:border-transparent outline-none transition-all pr-12"
                      placeholder="Не менее 6 символов"
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
                  <p className="text-xs text-gray-500 mt-2">Минимум 6 символов</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Ваше ФИО <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vector-electric-blue focus:border-transparent outline-none transition-all"
                      placeholder="Иванов Иван Иванович"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Имя ребёнка <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vector-electric-blue focus:border-transparent outline-none transition-all"
                      placeholder="Иван"
                      value={formData.child_name}
                      onChange={(e) => setFormData({ ...formData, child_name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Возраст <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="120"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vector-electric-blue focus:border-transparent outline-none transition-all"
                      placeholder="7"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Город <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vector-electric-blue focus:border-transparent outline-none transition-all"
                      placeholder="Москва"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Телефон для связи <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vector-electric-blue focus:border-transparent outline-none transition-all"
                    placeholder="+7 (999) 123-45-67"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              {/* Согласия */}
              <div className="space-y-4 border-t border-gray-200 pt-6">
                <p className="text-sm font-semibold text-gray-800">Необходимые согласия:</p>
                
                <div className="flex items-start bg-blue-50 p-4 rounded-lg">
                  <input
                    type="checkbox"
                    id="consent_terms"
                    checked={formData.consent_terms}
                    onChange={(e) => setFormData({ ...formData, consent_terms: e.target.checked })}
                    className="mt-1 h-5 w-5 text-vector-electric-blue focus:ring-vector-electric-blue rounded"
                  />
                  <label htmlFor="consent_terms" className="ml-3 text-sm text-gray-700">
                    Я принимаю <Link href="/legal/terms" className="text-vector-electric-blue hover:underline font-medium">Пользовательское соглашение</Link> *
                  </label>
                </div>

                <div className="flex items-start bg-blue-50 p-4 rounded-lg">
                  <input
                    type="checkbox"
                    id="consent_privacy"
                    checked={formData.consent_privacy}
                    onChange={(e) => setFormData({ ...formData, consent_privacy: e.target.checked })}
                    className="mt-1 h-5 w-5 text-vector-electric-blue focus:ring-vector-electric-blue rounded"
                  />
                  <label htmlFor="consent_privacy" className="ml-3 text-sm text-gray-700">
                    Я соглашаюсь с <Link href="/legal/privacy" className="text-vector-electric-blue hover:underline font-medium">Политикой конфиденциальности</Link> *
                  </label>
                </div>

                <div className="flex items-start bg-blue-50 p-4 rounded-lg">
                  <input
                    type="checkbox"
                    id="consent_personal_data"
                    checked={formData.consent_personal_data}
                    onChange={(e) => setFormData({ ...formData, consent_personal_data: e.target.checked })}
                    className="mt-1 h-5 w-5 text-vector-electric-blue focus:ring-vector-electric-blue rounded"
                  />
                  <label htmlFor="consent_personal_data" className="ml-3 text-sm text-gray-700">
                    Я даю согласие на <Link href="/legal/consent" className="text-vector-electric-blue hover:underline font-medium">обработку персональных данных</Link> *
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !formData.consent_terms || !formData.consent_privacy || !formData.consent_personal_data}
                className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-semibold py-3.5 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Регистрация...
                  </>
                ) : (
                  <>
                    Зарегистрироваться
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </>
                )}
              </button>

              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-gray-600">
                  Уже есть аккаунт?{' '}
                  <Link href="/auth/login" className="text-vector-electric-blue hover:underline font-semibold">
                    Войти
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}