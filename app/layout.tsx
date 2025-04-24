import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shockwave Capital',
  description: 'High-octane funding for elite traders',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
} 