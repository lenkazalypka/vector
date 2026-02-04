import Link from 'next/link'
import { Calendar } from 'lucide-react'

interface NewsCardProps {
  id: string
  title: string
  content: string
  imageUrl: string | null
  publishedAt: string
}

export default function NewsCard({
  id,
  title,
  content,
  imageUrl,
  publishedAt,
}: NewsCardProps) {
  return (
    <Link href={`/news/${id}`}>
      <div className="card overflow-hidden group cursor-pointer">
        {imageUrl && (
          <div className="h-48 overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-vector-deep-blue group-hover:text-vector-electric-blue transition-colors mb-3">
            {title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-3">{content}</p>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="font-accent">
              {new Date(publishedAt).toLocaleDateString('ru-RU')}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}