'use client'

import { useState, useEffect } from 'react'
import { Check, X, Eye, Trash2, Filter } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

interface Work {
  id: string
  image_url: string
  category: 'winner' | 'participant'
  name: string
  surname_initial: string
  age: number
  city: string
  approved: boolean
  uploaded_at: string
  contests: {
    title: string
  } | null
  contest_id: string
}

export default function AdminWorksPage() {
  const [works, setWorks] = useState<Work[]>([])
  const [loading, setLoading] = useState(true)
  const [approvingId, setApprovingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all')
  
  const supabase = createClient()

  useEffect(() => {
    loadWorks()
  }, [filter])

  const loadWorks = async () => {
    setLoading(true)
    
    let query = supabase
      .from('contest_photos')
      .select(`
        *,
        contests (
          title
        )
      `)
      .order('uploaded_at', { ascending: false })

    if (filter === 'approved') {
      query = query.eq('approved', true)
    } else if (filter === 'pending') {
      query = query.eq('approved', false)
    }

    const { data } = await query
    setWorks(data || [])
    setLoading(false)
  }

  const handleApprove = async (id: string, approved: boolean) => {
    setApprovingId(id)
    try {
      const { error } = await supabase
        .from('contest_photos')
        .update({ approved })
        .eq('id', id)

      if (error) throw error
      
      // Обновляем локальное состояние
      setWorks(works.map(work => 
        work.id === id ? { ...work, approved } : work
      ))
    } catch (error) {
      console.error('Error updating work:', error)
      alert('Ошибка при обновлении работы')
    } finally {
      setApprovingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту работу?')) {
      return
    }

    setDeletingId(id)
    try {
      const { error } = await supabase
        .from('contest_photos')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      // Удаляем из локального состояния
      setWorks(works.filter(work => work.id !== id))
    } catch (error) {
      console.error('Error deleting work:', error)
      alert('Ошибка при удалении работы')
    } finally {
      setDeletingId(null)
    }
  }

  const addWork = async () => {
    const contestId = prompt('Введите ID конкурса:')
    const imageUrl = prompt('Введите URL изображения:')
    const name = prompt('Введите имя участника:')
    const surnameInitial = prompt('Введите первую букву фамилии:')
    const age = prompt('Введите возраст:')
    const city = prompt('Введите город:')
    const category = prompt('Категория (winner/participant):')

    if (!contestId || !imageUrl || !name || !surnameInitial || !age || !city || !category) {
      alert('Все поля обязательны для заполнения')
      return
    }

    try {
      const { error } = await supabase
        .from('contest_photos')
        .insert({
          contest_id: contestId,
          image_url: imageUrl,
          name,
          surname_initial: surnameInitial,
          age: parseInt(age),
          city,
          category: category as 'winner' | 'participant',
          approved: true,
        })

      if (error) throw error

      alert('Работа добавлена успешно')
      loadWorks()
    } catch (error) {
      console.error('Error adding work:', error)
      alert('Ошибка при добавлении работы')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Работы участников</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <Filter className="h-4 w-4 text-gray-500 ml-3" />
            <select
              className="border-0 focus:ring-0 py-2 pl-2 pr-4"
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
            >
              <option value="all">Все работы</option>
              <option value="approved">Опубликованные</option>
              <option value="pending">На модерации</option>
            </select>
          </div>
          <button
            onClick={addWork}
            className="btn-primary"
          >
            Добавить работу
          </button>
        </div>
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
                    Работа
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Участник
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Конкурс
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Загружена
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {works.map((work) => (
                  <tr key={work.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={work.image_url}
                          alt={`Работа ${work.name}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {work.name} {work.surname_initial}.
                      </div>
                      <div className="text-sm text-gray-500">
                        {work.age} лет, {work.city}
                      </div>
                      <div className="text-xs mt-1">
                        <span className={`px-2 py-1 rounded-full ${
                          work.category === 'winner'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {work.category === 'winner' ? 'Победитель' : 'Участник'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{work.contests?.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        work.approved
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {work.approved ? 'Опубликовано' : 'На модерации'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(work.uploaded_at).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {!work.approved ? (
                          <button
                            onClick={() => handleApprove(work.id, true)}
                            disabled={approvingId === work.id}
                            className="p-1 text-green-400 hover:text-green-600 disabled:opacity-50"
                            title="Опубликовать"
                          >
                            <Check size={18} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleApprove(work.id, false)}
                            disabled={approvingId === work.id}
                            className="p-1 text-yellow-400 hover:text-yellow-600 disabled:opacity-50"
                            title="Снять с публикации"
                          >
                            <X size={18} />
                          </button>
                        )}
                        <a
                          href={work.image_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-blue-400 hover:text-blue-600"
                          title="Просмотреть"
                        >
                          <Eye size={18} />
                        </a>
                        <button
                          onClick={() => handleDelete(work.id)}
                          disabled={deletingId === work.id}
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

          {works.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg">Работы не найдены</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}