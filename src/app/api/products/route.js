import { NextResponse } from 'next/server'
import dbConnect from '../../../lib/mongodb'
import Product from '../../../models/Product'
import Category from '../../../models/Category'

export async function GET(request) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const categoryId = searchParams.get('category')

    let query = { active: true }
    
    if (featured === 'true') {
      query.featured = true
    }
    
    if (categoryId) {
      query.category = categoryId
    }

    const products = await Product.find(query)
      .populate('category', 'name')
      .sort({ createdAt: -1 })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    await dbConnect()

    const body = await request.json()
    
    // Validate that category exists
    if (body.category) {
      const categoryExists = await Category.findById(body.category)
      if (!categoryExists) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 400 }
        )
      }
    }

    const product = await Product.create(body)
    const populatedProduct = await Product.findById(product._id).populate('category', 'name')

    return NextResponse.json(populatedProduct, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
