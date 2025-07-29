"use client"

import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { useState, useEffect } from "react"

export default function Hero() {
  const { t } = useLanguage()
  const [isPortrait, setIsPortrait] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(orientation: portrait)")
    setIsPortrait(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setIsPortrait(e.matches)
    mediaQuery.addEventListener("change", handler)

    return () => mediaQuery.removeEventListener("change", handler)
  }, [])

  const backgroundImage = isPortrait ? "/imagenResponsive.gif" : "/imagenDesktop.gif"

  return (
    <section
      className={`relative h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900 text-white
        ${isPortrait ? "pt-24 sm:pt-16" : ""}`} // Más espacio arriba en móvil
    >
      <Header />
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/60"></div>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${backgroundImage}')` }}
        ></div>
      </div>
      <div
        className={`container mx-auto px-4 z-10 text-center
          ${isPortrait ? "pt-32" : ""} // Baja el texto y botones en móvil`}
      >
        <h1
          className="text-4xl md:text-6xl font-bold mb-4 hero-text-animation"
          style={{ textShadow: "0 0 10px rgba(3, 0, 0, 0.8)" }}
        >
          {t("hero.title")}
        </h1>
        <p
          className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto hero-subtitle-animation"
          style={{ textShadow: "0 0 8px rgba(11, 3, 3, 0.7)" }}
        >
          {t("hero.subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/70 transition-shadow duration-300"
            onClick={() => window.location.href = "#request"}
          >
            {t("hero.bookButton")}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-black hover:bg-white/20 shadow-md hover:shadow-white/50 transition-shadow duration-300"
            onClick={() => window.location.href = "#shows"}
          >
            {t("hero.watchButton")}
          </Button>
        </div>
      </div>

      <style jsx>{`
        @keyframes glow {
          0%, 100% {
            text-shadow:
              0 0 5px #fff,
              0 0 10px #fff,
              0 0 20px rgba(0, 255, 153, 1),
              0 0 30px rgba(18, 106, 189, 1),
              0 0 40px rgba(106, 0, 255, 1),
              0 0 55px #ff00de,
              0 0 75px #ff6f00ff;
          }
          50% {
            text-shadow:
              0 0 10px #fff,
              0 0 20px #e30574ff,
              0 0 30px rgba(105, 255, 135, 1),
              0 0 40px rgba(17, 67, 194, 1),
              0 0 50px rgba(175, 228, 39, 1),
              0 0 60px rgba(103, 190, 37, 1),
              0 0 80px #ff69b4;
          }
        }

        .hero-text-animation {
          animation: glow 3s ease-in-out infinite;
        }

        .hero-subtitle-animation {
          animation: glow 4s ease-in-out infinite alternate;
          font-weight: 500;
        }
      `}</style>
    </section>
  )
}
