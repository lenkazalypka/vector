export default function DebugPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Отладка переменных окружения</h1>
      
      <div style={{ background: '#f0f0f0', padding: '20px', marginTop: '20px' }}>
        <h2>Переменные на клиенте:</h2>
        <p><strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL || '❌ НЕ ЗАДАНО'}</p>
        <p><strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Задано (скрыто)' : '❌ НЕ ЗАДАНО'}</p>
      </div>

      <div style={{ background: '#e0f7fa', padding: '20px', marginTop: '20px' }}>
        <h2>Что должно быть:</h2>
        <p>URL: https://xxxxxx.supabase.co</p>
        <p>KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxx (длинный JWT токен)</p>
      </div>
    </div>
  )
}