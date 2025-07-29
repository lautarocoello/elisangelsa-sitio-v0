import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { LanguageProvider } from "@/lib/language-context"

export const metadata: Metadata = {
  title: "Elisangela Show Brasil",
  description: "Lleva tus eventos a otros nivel con nuestros shows",
  generator: 'By Lautaro Coello',
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" }
    ]
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        {/* Fuente Agu Display desde Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Agu+Display&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lobster&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-agu">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}

import './globals.css'
