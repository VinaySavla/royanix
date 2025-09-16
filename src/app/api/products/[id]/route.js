import { NextResponse } from 'next/server'
import dbConnect from '../../../../lib/mongodb'
import Product from '../../../../models/Product'
import Category from '../../../../models/Category'

export async function GET(request, { params }) {
  try {
    await dbConnect()
    
    const { id } = await params
    const product = await Product.findById(id).populate('category', 'name')

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect()

    const { id } = await params
    const body = await request.json()
    
    // Validate that category exists if provided
    if (body.category) {
      const categoryExists = await Category.findById(body.category)
      if (!categoryExists) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 400 }
        )
      }
    }

    const product = await Product.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    ).populate('category', 'name')

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect()
    
    const { id } = await params
    const product = await Product.findByIdAndDelete(id)

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
