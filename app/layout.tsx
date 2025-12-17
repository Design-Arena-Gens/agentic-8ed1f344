import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sajed Restaurant - AI Voice Assistant',
  description: 'Experience fine dining with AI-powered voice assistance at Sajed Restaurant in New York',
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
