import { NextResponse } from 'next/server'
import dbConnect from '../../../../lib/mongodb'
import Category from '../../../../models/Category'
import Product from '../../../../models/Product'

export async function PUT(request, { params }) {
  try {
    await dbConnect()

    const { name, description, active } = await request.json()
    
    const category = await Category.findByIdAndUpdate(
      params.id,
      { 
        name: name?.trim(),
        description: description?.trim() || '',
        active: active !== undefined ? active : true
      },
      { new: true, runValidators: true }
    )
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(category)
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Category name already exists' },
        { status: 400 }
      )
    }
    console.error('Error updating category:', error)
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect()

    const category = await Category.findById(params.id)
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // Check if category has products (using ObjectId reference)
    const productCount = await Product.countDocuments({ category: params.id })
    
    if (productCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete category. ${productCount} products are using this category.` },
        { status: 400 }
      )
    }

    await Category.findByIdAndDelete(params.id)

    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}
