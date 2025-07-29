"use client"

import Link from "next/link"
import { Facebook, Instagram, Youtube, Music2} from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Elisangela Show Brasil</h3>
            <p className="text-gray-400">{t("footer.subtitle")}</p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#shows" className="text-gray-400 hover:text-white transition-colors">
                  {t("nav.shows")}
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-gray-400 hover:text-white transition-colors">
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link href="#request" className="text-gray-400 hover:text-white transition-colors">
                  {t("nav.request")}
                </Link>
              </li>
              <li>
                <Link href="#calendar" className="text-gray-400 hover:text-white transition-colors">
                  {t("nav.calendar")}
                </Link>
              </li>
              <li>
                <Link href="#collaborate" className="text-gray-400 hover:text-white transition-colors">
                  {t("nav.collaborate")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">{t("footer.connect")}</h3>
            <div className="flex space-x-4">
              <Link href="https://www.facebook.com/elisangelashowbrasil" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={24} />
              </Link>
              <Link href="https://www.instagram.com/elisangelavieira932" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={24} />
              </Link>
              <Link href="https://www.tiktok.com/@elisangelashowbrasil" className="text-gray-400 hover:text-white transition-colors">
                <Music2 size={24} />
              </Link>
              <Link href="https://www.youtube.com/@elisangelashowbrasil6004" className="text-gray-400 hover:text-white transition-colors">
                <Youtube size={24} />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Elisangela Show Brasil. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  )
}

