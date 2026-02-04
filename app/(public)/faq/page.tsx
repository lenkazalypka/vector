'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface FAQItem {
  id: string
  question: string
  answer: string
}

export default function FAQPage() {
  const [faq, setFaq] = useState<FAQItem[]>([])
  const [loading, setLoading] = useState(true)
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    loadFAQ()
  }, [])

  const loadFAQ = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('faq')
      .select('*')
      .order('order', { ascending: true })

    if (data && data.length > 0) {
      setFaq(data)
    } else {
      // Дефолтные вопросы, если в базе нет
      setFaq([
        {
          id: '1',
          question: 'Как принять участие в конкурсе?',
          answer: 'Отправьте работу на почту vectoryakutsk@mail.ru. В письме укажите: 1) ФИО участника и возраст, 2) Название конкурса, 3) Контактные данные (телефон родителя). Администратор проверит работу и опубликует её на сайте.',
        },
        {
          id: '2',
          question: 'Почему моя работа не опубликована?',
          answer: 'Все работы проходят ручную модерацию администратором. Обычно это занимает 1-3 рабочих дня. Если прошло больше времени, проверьте правильность отправки на почту vectoryakutsk@mail.ru или напишите нам повторно.',
        },
        {
          id: '3',
          question: 'Сколько времени занимает публикация работы?',
          answer: 'Обычно публикация занимает 1-3 рабочих дня. В период высокой нагрузки (конец конкурса) срок может увеличиться до 5 рабочих дней.',
        },
        {
          id: '4',
          question: 'Можно ли удалить или изменить работу?',
          answer: 'Для удаления или изменения опубликованной работы напишите на vectoryakutsk@mail.ru с указанием названия конкурса и данных участника. Изменения вносятся администратором в течение 2 рабочих дней.',
        },
        {
          id: '5',
          question: 'Как выбираются победители?',
          answer: 'Победители выбираются жюри конкурса по установленным критериям оценки. Критерии публикуются в описании каждого конкурса. Результаты публикуются после завершения приёма работ.',
        },
        {
          id: '6',
          question: 'Платное ли участие?',
          answer: 'Участие в текущих конкурсах бесплатное. Информация о платных конкурсах (если такие появятся) будет опубликована отдельно в описании конкурса.',
        },
      ])
    }
    setLoading(false)
  }

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vector-electric-blue"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-vector-deep-blue mb-8">Часто задаваемые вопросы</h1>
      
      <div className="space-y-4">
        {faq.map((item) => (
          <div key={item.id} className="card overflow-hidden">
            <button
              className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              onClick={() => toggleItem(item.id)}
            >
              <span className="text-lg font-semibold text-vector-deep-blue">{item.question}</span>
              {openId === item.id ? (
                <ChevronUp className="h-5 w-5 text-vector-electric-blue flex-shrink-0" />
              ) : (
                <ChevronDown className="h-5 w-5 text-vector-electric-blue flex-shrink-0" />
              )}
            </button>
            
            {openId === item.id && (
              <div className="px-6 pb-6 border-t pt-4">
                <div className="text-gray-700 whitespace-pre-line">{item.answer}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}