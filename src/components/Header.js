'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/LogoTransparent.png"
              alt="Royanix"
              width={120}
              height={80}
              className="h-12 w-auto bg-transparent"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 font-medium">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-primary-600 font-medium">
              Products
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary-600 font-medium">
              About Us
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary-600 font-medium">
              Contact
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 hover:text-primary-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="text-gray-700 hover:text-primary-600 font-medium py-2">
                Home
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-primary-600 font-medium py-2">
                Products
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-primary-600 font-medium py-2">
                About Us
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-primary-600 font-medium py-2">
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
