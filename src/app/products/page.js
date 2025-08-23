'use client'

import { useState, useEffect } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import ProductGrid from '../../components/ProductGrid'

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.filter(cat => cat.active))
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our <span className="text-primary-600">Eco-Friendly</span> Products
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover our complete range of environmentally conscious cleaning solutions. 
            Each product is carefully formulated to deliver exceptional results while protecting our planet.
          </p>
        </div>

        {/* Product Categories Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => handleCategoryClick('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Products
            </button>
            
            {!loading && categories.map((category) => (
              <button 
                key={category._id}
                onClick={() => handleCategoryClick(category._id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category._id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.name}
                {category.productCount > 0 && (
                  <span className="ml-1 text-xs opacity-75">({category.productCount})</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <ProductGrid category={selectedCategory === 'all' ? null : selectedCategory} />
      </div>

      <Footer />
    </div>
  )
}
