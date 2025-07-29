"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useLanguage } from "@/lib/language-context"

// Sample images for cycling
const images = ["/elisangela.jpg","/elisangela-canta.jpg","/elisangela-perfil.jpg"]

export default function WhoIAm() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { t } = useLanguage()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t("about.title")}</h2>

        <div className="flex flex-col md:flex-row items-center gap-8 max-w-4xl mx-auto">
          <div className="md:w-1/3">
            <div className="relative w-64 h-64 mx-auto overflow-hidden rounded-full border-4 border-primary">
              {images.map((src, index) => (
                <Image
                  key={index}
                  src={src || "/placeholder.svg"}
                  alt="Entertainer"
                  fill
                  className="object-cover transition-opacity duration-7"
                  style={{
                    opacity: index === currentImageIndex ? 1 : 0,
                    zIndex: index === currentImageIndex ? 10 : 0,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="md:w-2/3 mt-6 md:mt-0">
            <h3 className="text-2xl font-semibold mb-4">{t("about.subtitle")}</h3>
            <p className="text-gray-700 mb-4">{t("about.paragraph1")}</p>
            <p className="text-gray-700 mb-4">{t("about.paragraph2")}</p>
            <p className="text-gray-700">{t("about.paragraph3")}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

