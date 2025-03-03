"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"

// Sample show data
const shows = [
  {
    id: 1,
    title: "¿Que sera de ti?",
    thumbnail: "/placeholder.svg?height=400&width=600",
    videoUrl: "https://www.youtube.com/watch?v=Jek6xYo3M_8",
  },
  {
    id: 2,
    title: "Feria de las Colectividades - Quilmes 2023",
    thumbnail: "/placeholder.svg?height=400&width=600",
    videoUrl: "https://www.youtube.com/watch?v=8sDwCVgjv60",
  },
  {
    id: 3,
    title: "Perola Negra Brasil",
    thumbnail: "/placeholder.svg?height=400&width=600",
    videoUrl: "https://www.youtube.com/watch?v=iFNXQ9g6pzQ",
  },
  {
    id: 4,
    title: "Animacion evento privado",
    thumbnail: "/placeholder.svg?height=400&width=600",
    videoUrl: "https://www.youtube.com/watch?v=dgKdQ2xaMc4",
  },
  {
    id: 5,
    title: "Animacion evento privado",
    thumbnail: "/placeholder.svg?height=400&width=600",
    videoUrl: "https://www.youtube.com/watch?v=iRv50OhgqGM",
  },
]

export default function MyShows() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number | null>(null)
  const [startIndex, setStartIndex] = useState(0)
  const itemsToShow = 3
  const { t } = useLanguage()

  const nextSlide = () => {
    if (startIndex + itemsToShow < shows.length) {
      setStartIndex(startIndex + 1)
    }
  }

  const prevSlide = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1)
    }
  }

  const openVideo = (index: number) => {
    setCurrentVideoIndex(index)
  }

  const closeVideo = () => {
    setCurrentVideoIndex(null)
  }

  return (
    <section id="shows" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t("shows.title")}</h2>

        <div className="relative">
          {/* Carousel navigation buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full"
            disabled={startIndex === 0}
          >
            <ChevronLeft size={24} />
          </button>

          <div className="overflow-hidden mx-8">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${startIndex * (100 / itemsToShow)}%)` }}
            >
              {shows.map((show, index) => (
                <div
                  key={show.id}
                  className="min-w-[33.333%] px-2 flex-shrink-0 transition-all duration-300"
                  style={{
                    minWidth: `${100 / Math.min(itemsToShow, shows.length)}%`,
                  }}
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                    <div className="relative aspect-video cursor-pointer group" onClick={() => openVideo(index)}>
                      <Image
                        src={show.thumbnail || "/placeholder.svg"}
                        alt={show.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-primary/80 rounded-full p-3">
                          <Play className="text-white" size={24} />
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{show.title}</h3>
                      <Button variant="link" className="p-0 h-auto text-primary" onClick={() => openVideo(index)}>
                        {t("shows.watchNow")}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full"
            disabled={startIndex + itemsToShow >= shows.length}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Video Modal */}
      {currentVideoIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <button onClick={closeVideo} className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full">
            <X size={24} />
          </button>
          <div className="w-full max-w-4xl aspect-video bg-black">
            {/* In a real implementation, this would be a video player */}
            <div className="w-full h-full flex items-center justify-center text-white">
              <div className="text-center">
                <Play size={64} className="mx-auto mb-4" />
                <p className="text-xl">{shows[currentVideoIndex].title} Video Player</p>
                <p className="text-sm text-gray-400 mt-2">(Video would play here in production)</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

