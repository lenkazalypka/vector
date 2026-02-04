import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Защищаем маршрут /profile
  if (!user && request.nextUrl.pathname.startsWith('/profile')) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Разрешаем доступ к auth страницам только неавторизованным
  if (user && request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/profile', request.url))
  }

  // ЗАЩИТА АДМИНКИ
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Проверяем, админ ли пользователь
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    // Если ошибка или не админ - перенаправляем
    if (error || !profile?.is_admin) {
      console.error('Admin access denied:', error?.message || 'User is not admin')
      return NextResponse.redirect(new URL('/profile', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/auth/:path*',
    '/admin/:path*', // Добавляем защиту админских маршрутов
  ],
}