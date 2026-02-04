import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <>
      <Header />
      
      {/* Весь твой контент из шага 3 */}
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 px-4">
          <div className="absolute inset-0 bg-gradient-to-br from-vector-electric/5 via-transparent to-vector-purple/5" />
          <div className="relative container mx-auto max-w-6xl">
            <div className="text-center animate-fade-in">
              <h1 className="mb-6">
                Центр дополнительного образования
                <span className="block text-vector-dark mt-2">«Вектор»</span>
              </h1>
              <p className="text-xl text-vector-medium max-w-2xl mx-auto mb-10">
                Современная платформа для развития талантов. Участвуйте в конкурсах, 
                создавайте проекты и достигайте новых высот вместе с нами.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="btn-primary animate-pulse">
                  🚀 Начать участие
                </button>
                <button className="btn-secondary">
                  📚 Узнать больше
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-center mb-12">Почему выбирают нас</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Безопасная среда', desc: 'Полное соответствие 152-ФЗ', icon: '🛡️', color: 'blue' },
                { title: 'Современные конкурсы', desc: 'Интересные задания для всех возрастов', icon: '🎨', color: 'purple' },
                { title: 'Профессиональное жюри', desc: 'Опытные педагоги и эксперты', icon: '🏆', color: 'orange' },
              ].map((feature, idx) => (
                <div key={idx} className="glass-card p-8 card-hover animate-slide-up" style={{animationDelay: `${idx * 100}ms`}}>
                  <div className={`text-4xl mb-4 ${feature.color === 'blue' ? 'text-vector-electric' : feature.color === 'purple' ? 'text-vector-purple' : 'text-vector-orange'}`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-vector-medium">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 px-4 bg-gradient-to-r from-vector-electric/5 to-vector-purple/5">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: '500+', label: 'Участников' },
                { number: '50+', label: 'Конкурсов' },
                { number: '100+', label: 'Победителей' },
                { number: '24/7', label: 'Поддержка' },
              ].map((stat, idx) => (
                <div key={idx} className="animate-float" style={{animationDelay: `${idx * 200}ms`}}>
                  <div className="text-4xl font-bold text-vector-deep-blue mb-2">{stat.number}</div>
                  <div className="text-vector-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="gradient-card p-12">
              <h2 className="mb-6">Готовы раскрыть таланты?</h2>
              <p className="text-xl text-vector-medium mb-8">
                Присоединяйтесь к нашему сообществу творческих и целеустремленных людей.
                Отправьте свою первую работу и начните путь к успеху!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="btn-primary">
                  ✨ Принять участие
                </button>
                <button className="btn-secondary">
                  📧 vectoryakutsk@mail.ru
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </>
  )
}