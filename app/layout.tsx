import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Digital Catalogue - PDF Upload & Selection',
  description: 'Upload PDF catalogs and let customers select pages they want',
  keywords: 'digital catalogue, PDF viewer, customer selection, online catalog',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}