'use client'

import { useState, useEffect } from 'react'
import ContestCard from '@/components/ContestCard'
import { createClient } from '@/lib/supabase/client'
import { Search, Filter } from 'lucide-react'

type ContestStatus = 'active' | 'upcoming' | 'finished'

export default function ContestsPage() {
  const [contests, setContests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ContestStatus | 'all'>('all')
  const supabase = createClient()

  useEffect(() => {
    loadContests()
  }, [statusFilter])

  const loadContests = async () => {
    setLoading(true)
    let query = supabase
      .from('contests')
      .select('*')
      .order('created_at', { ascending: false })

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter)
    }

    const { data } = await query
    setContests(data || [])
    setLoading(false)
  }

  const filteredContests = contests.filter(contest =>
    contest.title.toLowerCase().includes(search.toLowerCase()) ||
    contest.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-vector-deep-blue mb-8">Конкурсы</h1>

      {/* Фильтры */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Поиск по названию или описанию..."
              className="input-field pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              className="input-field"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ContestStatus | 'all')}
            >
              <option value="all">Все конкурсы</option>
              <option value="active">Активные</option>
              <option value="upcoming">Предстоящие</option>
              <option value="finished">Завершённые</option>
            </select>
          </div>
        </div>
      </div>

      {/* Список конкурсов */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vector-electric-blue"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredContests.map((contest) => (
              <ContestCard
                key={contest.id}
                id={contest.id}
                title={contest.title}
                description={contest.description}
                coverUrl={contest.cover_url}
                startDate={contest.start_date}
                endDate={contest.end_date}
                status={contest.status}
                participantCount={0}
              />
            ))}
          </div>

          {filteredContests.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">Конкурсы не найдены</div>
              <p className="text-gray-500">Попробуйте изменить параметры поиска</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}