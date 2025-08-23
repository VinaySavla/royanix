import { NextResponse } from 'next/server'
import dbConnect from '../../../../lib/mongodb'
import Product from '../../../../models/Product'

export async function GET() {
  try {
    await dbConnect()

    const totalProducts = await Product.countDocuments({ active: true })
    const featuredProducts = await Product.countDocuments({ active: true, featured: true })

    return NextResponse.json({
      totalProducts,
      featuredProducts,
      categories: 6
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
