import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-primary-400 mb-4">Royanix</h3>
            <p className="text-gray-300 mb-4">
              Leading provider of eco-friendly cleaning products that deliver powerful results 
              while protecting our environment. Kingly clean, pure liquid solutions for your home and business.
            </p>
            <div className="text-gray-300">
              <p>📧 info@royanix.com</p>
              <p>📞 +1 (555) 123-4567</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-300 hover:text-primary-400">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-primary-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-primary-400">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-gray-300 hover:text-primary-400">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Product Categories</h4>
            <ul className="space-y-2 text-gray-300">
              <li>All-Purpose Cleaners</li>
              <li>Kitchen Cleaners</li>
              <li>Bathroom Cleaners</li>
              <li>Floor Care</li>
              <li>Glass & Surface</li>
              <li>Specialty Products</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2025 Royanix. All rights reserved. | Eco-Friendly • Kingly Clean • Pure Liquid</p>
        </div>
      </div>
    </footer>
  )
}
