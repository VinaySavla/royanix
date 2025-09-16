'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function ProductGrid({ featured = false, category = null }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [hoveredProduct, setHoveredProduct] = useState(null) // Track which product is being hovered

  useEffect(() => {
    fetchProducts()
  }, [featured, category])

  const fetchProducts = async () => {
    try {
      let url = '/api/products'
      const params = new URLSearchParams()
      
      if (featured) {
        params.append('featured', 'true')
      }
      
      if (category) {
        params.append('category', category)
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`
      }
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(featured ? 4 : 8)].map((_, index) => (
          <div key={index} className="card p-6 animate-pulse">
            <div className="bg-gray-200 h-48 rounded mb-4"></div>
            <div className="bg-gray-200 h-4 rounded mb-2"></div>
            <div className="bg-gray-200 h-3 rounded mb-4"></div>
            <div className="bg-gray-200 h-8 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-3.5m-9 0H4" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Found</h3>
        <p className="text-gray-500 mb-6">Products will appear here once they are added by the administrator.</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => {
        const showSecondary = hoveredProduct === product._id && product.secondaryImage;
        const currentImage = showSecondary ? product.secondaryImage : product.image;
        
        return (
          <Link 
            href={`/products/${product._id}`}
            key={product._id}
            className="block"
          >
            <div 
              className={`card p-6 hover-lift fade-in animate-delay-${Math.min(index * 100, 800)} cursor-pointer transition-transform hover:scale-[1.02]`}
              onMouseEnter={() => setHoveredProduct(product._id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
            <div className="relative h-48 mb-4 bg-gray-100 rounded overflow-hidden hover-scale group">
              {currentImage ? (
                <Image
                  src={currentImage}
                  alt={showSecondary ? `${product.name} - Secondary` : product.name}
                  fill
                  className="object-cover transition-all duration-300"
                  style={{
                    // For PNG images with transparency, ensure proper background
                    backgroundColor: currentImage.startsWith('data:image/png') ? 'transparent' : '#f3f4f6'
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <svg className="w-12 h-12 pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              
              {/* Image indicator dots */}
              {(product.image || product.secondaryImage) && (
                <div className="absolute bottom-2 right-2 flex space-x-1">
                  {product.image && (
                    <div className={`w-2 h-2 rounded-full transition-colors ${
                      !showSecondary ? 'bg-white shadow-md' : 'bg-white/50'
                    }`} />
                  )}
                  {product.secondaryImage && (
                    <div className={`w-2 h-2 rounded-full transition-colors ${
                      showSecondary ? 'bg-white shadow-md' : 'bg-white/50'
                    }`} />
                  )}
                </div>
              )}
              
              {/* Hover hint for secondary image */}
              {product.secondaryImage && hoveredProduct !== product._id && (
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  +1 more
                </div>
              )}
            </div>
            <h3 className="font-semibold text-lg text-gray-900 mb-2">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{product.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full hover-glow">
                {product.category?.name || 'Cleaning'}
              </span>
              {featured && (
                <span className="text-xs bg-secondary-100 text-secondary-800 px-2 py-1 rounded-full bounce-slow">
                  Featured
                </span>
              )}
            </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
