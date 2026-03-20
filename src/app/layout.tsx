import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Navbar } from '@/components/navigation/Navbar'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Mæt — Din families madplan',
  description: 'Mæt gør det nemt at planlægge ugens måltider, finde opskrifter og lave indkøbslister for hele familien.',
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="da" className={inter.variable}>
      <body className="min-h-screen bg-bg font-sans antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  )
}
