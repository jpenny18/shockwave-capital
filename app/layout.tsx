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
    <html lang="en" style={{ backgroundColor: "#000" }} className="bg-black">
      <body className="min-h-screen overflow-x-hidden bg-black">
        {children}
      </body>
    </html>
  )
} 