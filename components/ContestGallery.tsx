'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Trophy } from 'lucide-react'

interface Photo {
  id: string
  image_url: string
  category: 'winner' | 'participant'
  name: string
  surname_initial: string
  age: number
  city: string
}

interface ContestGalleryProps {
  contestId: string
  winners: Photo[]
  participants: Photo[]
  status: string
}

export default function ContestGallery({
  winners,
  participants,
  status,
}: ContestGalleryProps) {
  const [activeTab, setActiveTab] = useState<'winners' | 'all'>('winners')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const allPhotos = [...winners, ...participants]

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-vector-deep-blue">Галерея работ</h2>
        <div className="flex border border-vector-medium-gray rounded-lg overflow-hidden">
          <button
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'winners' ? 'bg-vector-electric-blue text-white' : 'bg-white text-gray-700'}`}
            onClick={() => setActiveTab('winners')}
          >
            Победители
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'all' ? 'bg-vector-electric-blue text-white' : 'bg-white text-gray-700'}`}
            onClick={() => setActiveTab('all')}
          >
            Все работы
          </button>
        </div>
      </div>

      {/* Галерея */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {(activeTab === 'winners' ? winners : allPhotos).map((photo) => (
          <div
            key={photo.id}
            className="relative group cursor-pointer"
            onClick={() => setSelectedImage(photo.image_url)}
          >
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                src={photo.image_url}
                alt={`Работа ${photo.name}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            {photo.category === 'winner' && (
              <div className="absolute top-2 right-2 bg-yellow-500 text-white p-1 rounded-full">
                <Trophy className="h-4 w-4" />
              </div>
            )}
            <div className="mt-2">
              <div className="font-medium">{photo.name} {photo.surname_initial}.</div>
              <div className="text-sm text-gray-500">
                {photo.age} лет, {photo.city}
              </div>
            </div>
          </div>
        ))}
      </div>

      {allPhotos.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">Работ пока нет</div>
          <p className="text-gray-500">Станьте первым участником!</p>
        </div>
      )}

      {/* Модальное окно для просмотра изображения */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={selectedImage}
              alt="Увеличенное изображение"
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}