import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Navbar } from '@/components/navigation/Navbar'
import './globals.css'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'Maet - Madplanlaegning for familier',
  description:
    'Maet goer det nemt at planlaegge ugens maaltider, finde opskrifter og lave indkoebslister for hele familien.',
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="da">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-gray-50 antialiased`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  )
}
