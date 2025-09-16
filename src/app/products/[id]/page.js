'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showFullscreen, setShowFullscreen] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products/${params.id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Product not found')
        } else {
          setError('Failed to load product')
        }
        return
      }
      
      const data = await response.json()
      setProduct(data)
    } catch (error) {
      console.error('Error fetching product:', error)
      setError('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const getAvailableImages = () => {
    if (!product) return []
    const images = []
    if (product.image) images.push({ src: product.image, alt: product.name, type: 'primary' })
    if (product.secondaryImage) images.push({ src: product.secondaryImage, alt: `${product.name} - Secondary`, type: 'secondary' })
    return images
  }

  const currentImages = getAvailableImages()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Image skeleton */}
              <div className="space-y-4">
                <div className="bg-gray-200 h-96 rounded-lg shimmer"></div>
                <div className="flex space-x-2">
                  <div className="bg-gray-200 h-20 w-20 rounded-lg shimmer"></div>
                  <div className="bg-gray-200 h-20 w-20 rounded-lg shimmer"></div>
                </div>
              </div>
              
              {/* Content skeleton */}
              <div className="space-y-6">
                <div className="bg-gray-200 h-8 rounded shimmer"></div>
                <div className="bg-gray-200 h-4 rounded shimmer"></div>
                <div className="bg-gray-200 h-32 rounded shimmer"></div>
                <div className="bg-gray-200 h-10 rounded shimmer"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="fade-in">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto float" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.175-5.5-3M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-8">{error || 'The product you are looking for does not exist.'}</p>
            <div className="space-x-4">
              <button 
                onClick={() => router.back()}
                className="btn-secondary hover-bounce"
              >
                Go Back
              </button>
              <Link href="/products" className="btn-primary hover-pulse">
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm fade-in">
            <Link href="/" className="text-gray-500 hover:text-primary-600 hover-glow">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/products" className="text-gray-500 hover:text-primary-600 hover-glow">Products</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="fade-in animate-delay-200">
            <div className="sticky top-8">
              {/* Main Image */}
              <div className="relative bg-white rounded-lg shadow-lg overflow-hidden mb-4 hover-lift">
                <div className="aspect-square relative">
                  {currentImages.length > 0 ? (
                    <Image
                      src={currentImages[currentImageIndex]?.src}
                      alt={currentImages[currentImageIndex]?.alt}
                      fill
                      className="object-cover cursor-zoom-in transition-all duration-300"
                      style={{
                        backgroundColor: currentImages[currentImageIndex]?.src?.startsWith('data:image/png') ? 'transparent' : '#f3f4f6'
                      }}
                      onClick={() => setShowFullscreen(true)}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 bg-gray-100">
                      <svg className="w-24 h-24 pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Zoom indicator */}
                  {currentImages.length > 0 && (
                    <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {currentImages.length > 1 && (
                <div className="flex space-x-2">
                  {currentImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 hover-lift ${
                        currentImageIndex === index 
                          ? 'border-primary-500 shadow-lg' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover"
                        style={{
                          backgroundColor: image.src.startsWith('data:image/png') ? 'transparent' : '#f3f4f6'
                        }}
                      />
                      <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Information */}
          <div className="fade-in animate-delay-400">
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <div className="flex items-center space-x-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 hover-glow">
                    {product.category?.name || 'Cleaning'}
                  </span>
                  {product.featured && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary-100 text-secondary-800 bounce-slow">
                      ⭐ Featured
                    </span>
                  )}
                  {product.size && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      📦 {product.size}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-gray max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Description</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              {/* Features */}
              <div className="bg-white p-6 rounded-lg shadow-sm border hover-lift">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 fade-in animate-delay-600">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <span className="text-gray-700">Eco-Friendly Formula</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 fade-in animate-delay-700">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <span className="text-gray-700">Powerful Cleaning</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 fade-in animate-delay-800">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                    </div>
                    <span className="text-gray-700">Family Safe</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 fade-in animate-delay-900">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                    </div>
                    <span className="text-gray-700">Fast Acting</span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-primary-50 p-6 rounded-lg border border-primary-100 fade-in animate-delay-1000">
                <h3 className="text-lg font-semibold text-primary-900 mb-3">Get This Product</h3>
                <p className="text-primary-800 mb-4">Contact us to learn more about this product or to place an order.</p>
                <div className="space-y-2 text-sm text-primary-700">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>royanix@gmail.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>+91 95941 00444</span>
                  </div>
                </div>
                <div className="mt-4 space-x-3">
                  <Link href="/contact" className="btn-primary hover-bounce">
                    Contact Us
                  </Link>
                  <Link href="/products" className="btn-outline hover-pulse">
                    View More Products
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {showFullscreen && currentImages.length > 0 && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 fade-in">
          <div className="relative max-w-full max-h-full">
            <button
              onClick={() => setShowFullscreen(false)}
              className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 z-10 hover-bounce"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="relative max-w-4xl max-h-full">
              <Image
                src={currentImages[currentImageIndex]?.src}
                alt={currentImages[currentImageIndex]?.alt}
                width={800}
                height={600}
                className="max-w-full max-h-full object-contain"
                style={{
                  backgroundColor: currentImages[currentImageIndex]?.src?.startsWith('data:image/png') ? 'transparent' : '#1f2937'
                }}
              />
            </div>

            {currentImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {currentImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      currentImageIndex === index ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}