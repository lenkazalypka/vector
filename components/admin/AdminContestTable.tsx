'use client'

import { useState } from 'react'
import { Edit, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Contest {
  id: string
  title: string
  status: 'active' | 'upcoming' | 'finished'
  start_date: string
  end_date: string
  created_at: string
}

interface AdminContestTableProps {
  contests: Contest[]
}

export default function AdminContestTable({ contests }: AdminContestTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const supabase = createClient()

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот конкурс?')) {
      return
    }

    setDeletingId(id)
    try {
      const { error } = await supabase
        .from('contests')
        .delete()
        .eq('id', id)

      if (error) throw error
      // Обновляем страницу
      window.location.reload()
    } catch (error) {
      console.error('Error deleting contest:', error)
      alert('Ошибка при удалении конкурса')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Название
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Даты проведения
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Создан
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contests.map((contest) => (
              <tr key={contest.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{contest.title}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    contest.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : contest.status === 'upcoming'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {contest.status === 'active' && 'Активный'}
                    {contest.status === 'upcoming' && 'Предстоящий'}
                    {contest.status === 'finished' && 'Завершён'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {new Date(contest.start_date).toLocaleDateString('ru-RU')}
                    {' - '}
                    {new Date(contest.end_date).toLocaleDateString('ru-RU')}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(contest.created_at).toLocaleDateString('ru-RU')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/contests/${contest.id}`}
                      target="_blank"
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title="Посмотреть на сайте"
                    >
                      <Eye size={18} />
                    </Link>
                    <Link
                      href={`/admin/contests/${contest.id}/edit`}
                      className="p-1 text-blue-400 hover:text-blue-600"
                      title="Редактировать"
                    >
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(contest.id)}
                      disabled={deletingId === contest.id}
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

      {contests.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">Конкурсы не найдены</div>
          <p className="text-gray-500 mt-2">Создайте первый конкурс</p>
        </div>
      )}
    </div>
  )
}