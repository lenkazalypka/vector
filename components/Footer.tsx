// components/Footer.tsx
import Link from 'next/link'
import { Mail, Phone, MapPin, FileText, Shield, ClipboardCheck, Heart } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: 'Конкурсы', href: '/contests' },
    { name: 'Новости', href: '/news' },
    { name: 'FAQ', href: '/faq' },
  ]

  const legalLinks = [
    { name: 'Политика конфиденциальности', href: '/legal/privacy', icon: <Shield className="h-4 w-4" /> },
    { name: 'Пользовательское соглашение', href: '/legal/terms', icon: <FileText className="h-4 w-4" /> },
    { name: 'Согласие на обработку данных', href: '/legal/consent', icon: <ClipboardCheck className="h-4 w-4" /> },
  ]

  return (
    <footer className="bg-gradient-to-b from-white to-vector-light/50 border-t border-vector-light-gray/30 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* О центре */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-vector-electric to-vector-purple flex items-center justify-center">
                <span className="text-2xl font-bold text-white">В</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-vector-deep-blue">Центр «Вектор»</h3>
                <p className="text-vector-medium text-sm">Безопасная образовательная среда для детей</p>
              </div>
            </div>
            <p className="text-vector-medium mb-8 max-w-xl">
              Платформа для творческих конкурсов и дополнительного образования. 
              Мы соблюдаем 152-ФЗ и обеспечиваем полную безопасность персональных данных.
            </p>
            
            {/* Блок с почтой (главный контакт) */}
            <div className="bg-gradient-to-r from-blue-50 to-vector-light/50 rounded-xl p-5 border border-blue-100 max-w-md">
              <div className="flex items-center space-x-3 mb-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-vector-electric" />
                </div>
                <div>
                  <h4 className="font-bold text-vector-dark">Единственный способ связи:</h4>
                  <a 
                    href="mailto:vectoryakutsk@mail.ru" 
                    className="text-lg font-semibold text-vector-electric hover:text-vector-deep-blue transition-colors break-all"
                  >
                    vectoryakutsk@mail.ru
                  </a>
                </div>
              </div>
              <p className="text-sm text-vector-medium pl-13">
                Отправляйте работы, задавайте вопросы, получайте консультации
              </p>
            </div>
          </div>

          {/* Быстрые ссылки */}
          <div>
            <h4 className="text-lg font-bold text-vector-dark mb-6">Навигация</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-vector-medium hover:text-vector-electric hover:pl-2 transition-all duration-200 flex items-center group"
                  >
                    <span className="h-1 w-1 rounded-full bg-vector-electric opacity-0 group-hover:opacity-100 mr-2 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Юридическая информация */}
          <div>
            <h4 className="text-lg font-bold text-vector-dark mb-6">Документы</h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-vector-medium hover:text-vector-electric transition-colors flex items-center space-x-2 group"
                  >
                    <span className="text-vector-electric opacity-70 group-hover:opacity-100">
                      {link.icon}
                    </span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Нижняя часть */}
        <div className="mt-12 pt-8 border-t border-vector-light-gray/30">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-vector-medium text-sm">
              © {currentYear} Центр дополнительного образования «Вектор». Все права защищены.
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-vector-medium text-sm hover:text-vector-electric transition-colors flex items-center space-x-1"
                >
                  {link.icon}
                  <span className="hidden md:inline">{link.name}</span>
                  <span className="md:hidden">{link.name.split(' ')[0]}</span>
                </Link>
              ))}
            </div>
            
            <div className="flex items-center text-vector-medium text-sm">
          
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}