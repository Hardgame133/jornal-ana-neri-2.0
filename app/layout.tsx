import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { NetworkRecovery } from './components/network-recovery'

export const metadata: Metadata = {
  title: 'NOVA — Histórias em movimento',
  description: 'Estúdio independente de filmes, imagens e experiências digitais.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/favicon.jpg',
        type: 'image/jpeg',
      },
    ],
    apple: '/favicon.jpg',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
        <NetworkRecovery />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
