"use client"

import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"



export default function Hero() {
  const { t } = useLanguage()

  return (
    <section className="relative h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900 text-white">
      <Header />
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/60"></div>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/imagen-principal.gif')" }}
        ></div>
      </div>
      <div className="container mx-auto px-4 z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">{t("hero.title")}</h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">{t("hero.subtitle")}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90"
            onClick={() => window.location.href = "#request"}
          >
            {t("hero.bookButton")}
          </Button>
          <Button size="lg" variant="outline" className="border-white text-black hover:bg-white/10" onClick={() => window.location.href = "#shows"}>
            {t("hero.watchButton")}
          </Button>
        </div>
      </div>
    </section>
  )
}
