import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600'],
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'JD Satisfaction Service Plus',
  description: 'Imprimerie, Tech, Cosmetiques, Fournitures — Livraison partout en Haiti',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} ${plusJakarta.variable}`}>
        {children}
      </body>
    </html>
  )
}
