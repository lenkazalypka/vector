'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface NewsItem {
  id: string
  title: string
  content: string
  image_url: string | null
  published_at: string
}

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    loadNews()
  }, [])

  const loadNews = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('news')
      .select('*')
      .order('published_at', { ascending: false })

    setNews(data || [])
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту новость?')) {
      return
    }

    setDeletingId(id)
    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setNews(news.filter(item => item.id !== id))
    } catch (error) {
      console.error('Error deleting news:', error)
      alert('Ошибка при удалении новости')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Новости</h1>
        <Link
          href="/admin/news/new"
          className="btn-primary flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Добавить новость
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vector-electric-blue"></div>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Заголовок
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Изображение
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата публикации
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {news.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{item.title}</div>
                      <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {item.content.substring(0, 100)}...
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.image_url ? (
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Нет изображения</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(item.published_at).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/news/${item.id}`}
                          target="_blank"
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Посмотреть на сайте"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          href={`/admin/news/${item.id}/edit`}
                          className="p-1 text-blue-400 hover:text-blue-600"
                          title="Редактировать"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="p-1 text-red-400 hover:text-red-600 disabled:opacity-50"
                          title="Удалить"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {news.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg">Новостей нет</div>
              <p className="text-gray-500 mt-2">Добавьте первую новость</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}