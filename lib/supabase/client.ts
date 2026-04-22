import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
  // На этапе пререндера (build/SSR) env может быть недоступен.
  // Используем безопасные заглушки, чтобы не падала сборка.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}
