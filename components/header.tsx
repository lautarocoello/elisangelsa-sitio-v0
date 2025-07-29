"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import LanguageSwitcher from "@/components/language-switcher"
import { useLanguage } from "@/lib/language-context"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t } = useLanguage()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-center block group">
          <span
            className="block text-4xl sm:text-5xl font-lobster text-white animate-text-glow"
          >
            ELISÃNGELA
          </span>
          <span
            className="block text-2xl sm:text-3xl font-lobster text-white animate-text-glow delay-200"
          >
            SHOW BRASIL
          </span>

          <style jsx>{`
    @keyframes textGlow {
      0% {
        text-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
        transform: translateY(0px);
      }
      50% {
        text-shadow: 0 0 15px rgba(255, 255, 255, 0.6);
        transform: translateY(-2px);
      }
      100% {
        text-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
        transform: translateY(0px);
      }
    }

    .animate-text-glow {
      animation: textGlow 3s ease-in-out infinite;
    }

    .delay-200 {
      animation-delay: 0.2s;
    }
  `}</style>
        </Link>


        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          {/* Mobile menu button */}
          <button className="md:hidden text-white focus:outline-none" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex space-x-8">
          <Link href="#shows" className="hover:text-primary transition-colors">
            {t("nav.shows")}
          </Link>
          <Link href="#about" className="hover:text-primary transition-colors">
            {t("nav.about")}
          </Link>
          <Link href="#request" className="hover:text-primary transition-colors">
            {t("nav.request")}
          </Link>
          <Link href="#calendar" className="hover:text-primary transition-colors">
            {t("nav.calendar")}
          </Link>
          <Link href="#collaborate" className="hover:text-primary transition-colors">
            {t("nav.collaborate")}
          </Link>
        </nav>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-sm">
          <nav className="flex flex-col space-y-4 p-4">
            <Link
              href="#shows"
              className="hover:text-primary transition-colors py-2 border-b border-gray-800"
              onClick={toggleMenu}
            >
              {t("nav.shows")}
            </Link>
            <Link
              href="#about"
              className="hover:text-primary transition-colors py-2 border-b border-gray-800"
              onClick={toggleMenu}
            >
              {t("nav.about")}
            </Link>
            <Link
              href="#request"
              className="hover:text-primary transition-colors py-2 border-b border-gray-800"
              onClick={toggleMenu}
            >
              {t("nav.request")}
            </Link>
            <Link
              href="#calendar"
              className="hover:text-primary transition-colors py-2 border-b border-gray-800"
              onClick={toggleMenu}
            >
              {t("nav.calendar")}
            </Link>
            <Link href="#collaborate" className="hover:text-primary transition-colors py-2" onClick={toggleMenu}>
              {t("nav.collaborate")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}

