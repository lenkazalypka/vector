import Link from 'next/link'
import { Calendar, Award, Users } from 'lucide-react'

interface ContestCardProps {
  id: string
  title: string
  description: string
  coverUrl: string | null
  startDate: string
  endDate: string
  status: 'active' | 'upcoming' | 'finished'
  participantCount: number
}

export default function ContestCard({
  id,
  title,
  description,
  coverUrl,
  startDate,
  endDate,
  status,
  participantCount,
}: ContestCardProps) {
  const statusColors = {
    active: 'bg-vector-teal text-white',
    upcoming: 'bg-vector-electric-blue text-white',
    finished: 'bg-vector-dark-gray text-white',
  }

  return (
    <Link href={`/contests/${id}`}>
      <div className="card overflow-hidden group cursor-pointer">
        {coverUrl && (
          <div className="h-48 overflow-hidden">
            <img
              src={coverUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold text-vector-deep-blue group-hover:text-vector-electric-blue transition-colors">
              {title}
            </h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]}`}>
              {status === 'active' && 'Идёт'}
              {status === 'upcoming' && 'Скоро'}
              {status === 'finished' && 'Завершён'}
            </span>
          </div>

          <p className="text-gray-600 mb-6 line-clamp-2">{description}</p>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="font-accent">
                {new Date(startDate).toLocaleDateString('ru-RU')} – {new Date(endDate).toLocaleDateString('ru-RU')}
              </span>
            </div>

            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              <span>{participantCount} работ</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}