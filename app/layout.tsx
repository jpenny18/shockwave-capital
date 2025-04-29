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
    <html lang="en" className="bg-[#0D0D0D]">
      <body className="min-h-screen overflow-x-hidden bg-[#0D0D0D]">
        {children}
      </body>
    </html>
  )
} 