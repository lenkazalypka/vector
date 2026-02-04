import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Calendar, MapPin, Trophy, Users } from 'lucide-react'
import ContestGallery from '@/components/ContestGallery'

export default async function ContestDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()
  
  const { data: contest } = await supabase
    .from('contests')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!contest) {
    notFound()
  }

  // Получаем работы для этого конкурса
  const { data: photos } = await supabase
    .from('contest_photos')
    .select('*')
    .eq('contest_id', params.id)
    .eq('approved', true)
    .order('uploaded_at', { ascending: false })

  const winners = photos?.filter(p => p.category === 'winner') || []
  const participants = photos?.filter(p => p.category === 'participant') || []

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Обложка */}
      {contest.cover_url && (
        <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
          <img
            src={contest.cover_url}
            alt={contest.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute bottom-8 left-8 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{contest.title}</h1>
            <div className="flex items-center space-x-4">
              <span className="bg-vector-orange text-white px-3 py-1 rounded-full text-sm font-medium">
                {contest.status === 'active' && 'Идёт'}
                {contest.status === 'upcoming' && 'Скоро'}
                {contest.status === 'finished' && 'Завершён'}
              </span>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="font-accent">
                  {new Date(contest.start_date).toLocaleDateString('ru-RU')} – {new Date(contest.end_date).toLocaleDateString('ru-RU')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Информация о конкурсе */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card p-6 mb-8">
            <h2 className="text-2xl font-bold text-vector-deep-blue mb-4">О конкурсе</h2>
            <div className="prose max-w-none">
              {contest.description.split('\n').map((paragraph: string, idx: number) => (
                <p key={idx} className="text-gray-700 mb-4">{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Галерея работ */}
          <ContestGallery
            contestId={contest.id}
            winners={winners}
            participants={participants}
            status={contest.status}
          />
        </div>

        {/* Боковая панель */}
        <div>
          {/* Как участвовать */}
          <div className="card p-6 mb-6 bg-orange-50 border-orange-200">
            <h3 className="text-xl font-bold text-vector-deep-blue mb-4 flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-vector-orange" />
              Как принять участие
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-vector-orange text-white flex items-center justify-center text-sm mr-2">1</span>
                <span>Отправьте работу на почту <strong>vectoryakutsk@mail.ru</strong></span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-vector-orange text-white flex items-center justify-center text-sm mr-2">2</span>
                <span>Администратор проверит и опубликует работу</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-vector-orange text-white flex items-center justify-center text-sm mr-2">3</span>
                <span>Следите за результатами на этой странице</span>
              </li>
            </ul>
          </div>

          {/* Статистика */}
          <div className="card p-6">
            <h3 className="text-xl font-bold text-vector-deep-blue mb-4">Статистика</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                  <Users className="h-5 w-5 mr-2" />
                  <span>Всего работ:</span>
                </div>
                <span className="font-bold text-vector-deep-blue">{photos?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                  <Trophy className="h-5 w-5 mr-2" />
                  <span>Победителей:</span>
                </div>
                <span className="font-bold text-vector-deep-blue">{winners.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>До окончания:</span>
                </div>
                <span className="font-bold text-vector-deep-blue">
                  {contest.status === 'active' 
                    ? `${Math.ceil((new Date(contest.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} дней`
                    : 'Завершён'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}