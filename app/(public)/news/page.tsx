import { createClient } from '@/lib/supabase/server'
import NewsCard from '@/components/NewsCard'

export default async function NewsPage() {
  const supabase = await createClient()
  
  const { data: news } = await supabase
    .from('news')
    .select('*')
    .order('published_at', { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-vector-deep-blue mb-8">Новости</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news?.map((item) => (
          <NewsCard
            key={item.id}
            id={item.id}
            title={item.title}
            content={item.content}
            imageUrl={item.image_url}
            publishedAt={item.published_at}
          />
        ))}
      </div>

      {news?.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">Новостей пока нет</div>
          <p className="text-gray-500">Следите за обновлениями</p>
        </div>
      )}
    </div>
  )
}