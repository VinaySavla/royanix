import { NextResponse } from 'next/server'
import dbConnect from '../../../lib/mongodb'
import Category from '../../../models/Category'
import Product from '../../../models/Product'

export async function GET() {
  try {
    await dbConnect()

    const categories = await Category.find({}).sort({ name: 1 })

    // Update product count for each category
    for (let category of categories) {
      const count = await Product.countDocuments({ category: category._id, active: true })
      if (category.productCount !== count) {
        category.productCount = count
        await category.save()
      }
    }

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    await dbConnect()

    const { name, description } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      )
    }

    const category = await Category.create({
      name: name.trim(),
      description: description?.trim() || ''
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Category already exists' },
        { status: 400 }
      )
    }
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}
