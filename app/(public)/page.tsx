import { createClient } from '@/lib/supabase/server'
import ContestCard from '@/components/ContestCard'
import NewsCard from '@/components/NewsCard'
import { ArrowRight, Trophy, Users, Calendar } from 'lucide-react'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = await createClient()

  // Получаем активные конкурсы
  const { data: contests } = await supabase
    .from('contests')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(3)

  // Получаем последние новости
  const { data: news } = await supabase
    .from('news')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(3)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-vector-deep-blue to-vector-electric-blue text-white p-8 md:p-12 mb-12">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-accent font-bold mb-6">
            Твой вектор к успеху
          </h1>
          <p className="text-xl text-gray-200 mb-8">
            Участвуй в конкурсах, развивай таланты и достигай новых высот вместе с центром «Вектор»
          </p>
          <Link
            href="/contests"
            className="inline-flex items-center btn-primary bg-vector-orange hover:bg-orange-600 text-lg"
          >
            Смотреть конкурсы
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10">
          {/* Декоративные элементы */}
          <div className="absolute inset-0 bg-gradient-to-l from-white to-transparent"></div>
        </div>
      </section>

      {/* Статистика */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="card p-6 text-center">
          <Trophy className="h-12 w-12 text-vector-orange mx-auto mb-4" />
          <div className="text-3xl font-bold text-vector-deep-blue">50+</div>
          <div className="text-gray-600">Проведённых конкурсов</div>
        </div>
        <div className="card p-6 text-center">
          <Users className="h-12 w-12 text-vector-electric-blue mx-auto mb-4" />
          <div className="text-3xl font-bold text-vector-deep-blue">2000+</div>
          <div className="text-gray-600">Участников</div>
        </div>
        <div className="card p-6 text-center">
          <Calendar className="h-12 w-12 text-vector-teal mx-auto mb-4" />
          <div className="text-3xl font-bold text-vector-deep-blue">12</div>
          <div className="text-gray-600">Конкурсов в год</div>
        </div>
      </section>

      {/* Активные конкурсы */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-vector-deep-blue">Активные конкурсы</h2>
          <Link href="/contests" className="text-vector-electric-blue hover:underline flex items-center">
            Все конкурсы
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contests?.map((contest) => (
            <ContestCard
              key={contest.id}
              id={contest.id}
              title={contest.title}
              description={contest.description}
              coverUrl={contest.cover_url}
              startDate={contest.start_date}
              endDate={contest.end_date}
              status={contest.status}
              participantCount={0} // TODO: добавить подсчёт работ
            />
          ))}
        </div>
      </section>

      {/* Новости */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-vector-deep-blue">Последние новости</h2>
          <Link href="/news" className="text-vector-electric-blue hover:underline flex items-center">
            Все новости
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
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
      </section>
    </div>
  )
}