import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Royanix - Eco-Friendly Cleaning Products',
  description: 'Pure, eco-friendly cleaning liquids and products that are kingly clean and environmentally safe.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
