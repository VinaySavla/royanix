'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { compressImage, validateImageFile, getBase64SizeKB } from '../lib/imageUtils'

export default function ProductManagement() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [imageUploading, setImageUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    image: '',
    secondaryImage: '',
    featured: false,
    sizeVariants: [{ size: '', price: '' }]
  })

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products')
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

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
        // Set default category if none selected and categories exist
        if (data.length > 0 && !formData.category) {
          setFormData(prev => ({ ...prev, category: data[0]._id }))
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleImageUpload = async (e, imageType = 'primary') => {
    const file = e.target.files[0]
    if (!file) return

    try {
      setImageUploading(true)
      
      // Validate file
      validateImageFile(file)
      
      // Compress image
      const compressedImage = await compressImage(file, 250) // Max 250KB
      
      // Update form data based on image type
      const imageField = imageType === 'secondary' ? 'secondaryImage' : 'image'
      setFormData({ ...formData, [imageField]: compressedImage })
      
      console.log(`${imageType} image compressed to: ${getBase64SizeKB(compressedImage).toFixed(2)}KB`)
      
    } catch (error) {
      alert(error.message)
    } finally {
      setImageUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const url = editingProduct ? `/api/products/${editingProduct._id}` : '/api/products'
      const method = editingProduct ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchProducts()
        resetForm()
      } else {
        const error = await response.json()
        alert(error.message || 'Error saving product')
      }
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Error saving product')
    }
  }

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchProducts()
      } else {
        alert('Error deleting product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Error deleting product')
    }
  }

  const resetForm = () => {
    const defaultCategory = categories.length > 0 ? categories[0]._id : ''
    setFormData({
      name: '',
      description: '',
      category: defaultCategory,
      image: '',
      secondaryImage: '',
      featured: false,
      sizeVariants: [{ size: '', price: '' }]
    })
    setShowAddForm(false)
    setEditingProduct(null)
  }

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category?._id || product.category || '',
      image: product.image || '',
      secondaryImage: product.secondaryImage || '',
      featured: product.featured || false,
      sizeVariants: product.sizeVariants && product.sizeVariants.length > 0 
        ? product.sizeVariants 
        : [{ size: '', price: '' }]
    })
    setEditingProduct(product)
    setShowAddForm(true)
  }

  const getCategoryName = (categoryId) => {
    if (!categoryId) return 'No Category'
    if (typeof categoryId === 'object' && categoryId.name) {
      return categoryId.name
    }
    const category = categories.find(cat => cat._id === categoryId)
    return category ? category.name : 'Unknown'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary"
          disabled={categories.length === 0}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>

      {categories.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-yellow-800">No categories found</h3>
              <p className="text-sm text-yellow-700 mt-1">Please create at least one category before adding products.</p>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                    >
                      <option value="">Select a category</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows="4"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                    placeholder="Describe the product's features and benefits..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Product Image
                  </label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'primary')}
                      disabled={imageUploading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                    />
                    {imageUploading && (
                      <p className="text-sm text-blue-600">Compressing image...</p>
                    )}
                    {formData.image && (
                      <div className="mt-2">
                        <p className="text-sm text-green-600 mb-2">
                          Primary image size: {getBase64SizeKB(formData.image).toFixed(2)}KB
                        </p>
                        <Image
                          src={formData.image}
                          alt="Primary Preview"
                          width={200}
                          height={150}
                          className="rounded-md border border-gray-300 object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Product Image (Optional)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'secondary')}
                      disabled={imageUploading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                    />
                    <p className="text-xs text-gray-500">
                      Supports JPEG, PNG (with transparency), and WebP formats. Max 250KB after compression.
                    </p>
                    {formData.secondaryImage && (
                      <div className="mt-2">
                        <p className="text-sm text-green-600 mb-2">
                          Secondary image size: {getBase64SizeKB(formData.secondaryImage).toFixed(2)}KB
                        </p>
                        <Image
                          src={formData.secondaryImage}
                          alt="Secondary Preview"
                          width={200}
                          height={150}
                          className="rounded-md border border-gray-300 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, secondaryImage: '' })}
                          className="mt-2 text-sm text-red-600 hover:text-red-800"
                        >
                          Remove Secondary Image
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size Variants
                  </label>
                  <div className="space-y-3">
                    {formData.sizeVariants.map((variant, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              Size/Volume *
                            </label>
                            <input
                              type="text"
                              required
                              value={variant.size}
                              onChange={(e) => {
                                const newVariants = [...formData.sizeVariants]
                                newVariants[index].size = e.target.value
                                setFormData({ ...formData, sizeVariants: newVariants })
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                              placeholder="500ml, 1L, 2.5kg"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              Price *
                            </label>
                            <div className="flex space-x-2">
                              <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                value={variant.price}
                                onChange={(e) => {
                                  const newVariants = [...formData.sizeVariants]
                                  newVariants[index].price = e.target.value
                                  setFormData({ ...formData, sizeVariants: newVariants })
                                }}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                                placeholder="99.99"
                              />
                              {formData.sizeVariants.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newVariants = formData.sizeVariants.filter((_, i) => i !== index)
                                    setFormData({ ...formData, sizeVariants: newVariants })
                                  }}
                                  className="px-3 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50"
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          sizeVariants: [...formData.sizeVariants, { size: '', price: '' }]
                        })
                      }}
                      className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-300 hover:text-primary-600 transition-colors"
                    >
                      + Add Size Variant
                    </button>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                    Featured Product
                  </label>
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={imageUploading}
                  >
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Products ({products.length})</h3>
        </div>
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-3.5m-9 0H4" />
            </svg>
            <p className="text-gray-500">No products found. Add your first product to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size Variants
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 flex space-x-2">
                          {/* Primary Image */}
                          <div className="relative">
                            {product.image ? (
                              <Image
                                src={product.image}
                                alt={product.name}
                                width={48}
                                height={48}
                                className="rounded-lg object-cover"
                              />
                            ) : (
                              <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                            <span className="absolute -bottom-1 -right-1 text-xs bg-blue-500 text-white px-1 rounded">1</span>
                          </div>
                          
                          {/* Secondary Image */}
                          <div className="relative">
                            {product.secondaryImage ? (
                              <Image
                                src={product.secondaryImage}
                                alt={`${product.name} - Secondary`}
                                width={48}
                                height={48}
                                className="rounded-lg object-cover"
                              />
                            ) : (
                              <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                                <span className="text-xs text-gray-400">2</span>
                              </div>
                            )}
                            {product.secondaryImage && (
                              <span className="absolute -bottom-1 -right-1 text-xs bg-green-500 text-white px-1 rounded">2</span>
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.description.substring(0, 50)}...</div>
                          {product.secondaryImage && (
                            <div className="text-xs text-green-600 mt-1">✓ Has secondary image</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getCategoryName(product.category)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.sizeVariants && product.sizeVariants.length > 0 ? (
                        <div className="space-y-1">
                          {product.sizeVariants.map((variant, index) => (
                            <div key={index} className="text-xs">
                              <span className="font-medium">{variant.size}</span>
                              {variant.price && (
                                <span className="ml-2 text-green-600">₹{variant.price}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">No variants</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.active ? 'Active' : 'Inactive'}
                        </span>
                        {product.featured && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-primary-600 hover:text-primary-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
