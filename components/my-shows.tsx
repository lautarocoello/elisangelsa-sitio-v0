"use client"

import { useLanguage } from "@/lib/language-context"
import { useState } from "react"
import { PlayCircle } from "lucide-react"

const shows = [
  {
    id: 1,
    title: "¿Que sera de ti?",
    videoUrl: "/videos/video1.mp4",
  },
  {
    id: 2,
    title: "Feria de las Colectividades - Quilmes 2023",
    videoUrl: "/videos/video2.mp4",
  },
  {
    id: 3,
    title: "Perola Negra Brasil",
    videoUrl: "/videos/video3.mp4",
  },
]

export default function MyShows() {
  const { t } = useLanguage()

  return (
    <section id="shows" className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          {t("shows.title") || "Mis Shows"}
        </h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {shows.map((show) => (
            <div
              key={show.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <video
                src={show.videoUrl}
                controls
                className="w-full aspect-video"
              >
                Tu navegador no soporta videos HTML5.
              </video>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">{show.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
