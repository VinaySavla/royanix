import { NextResponse } from 'next/server'
import dbConnect from '../../../../lib/mongodb'
import Admin from '../../../../models/Admin'
import jwt from 'jsonwebtoken'

// Helper function to verify admin token
async function verifyAdmin(request) {
  const token = request.cookies.get('admin-token')?.value
  if (!token) {
    throw new Error('No token provided')
  }
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key')
  return decoded
}

export async function GET(request) {
  try {
    const admin = await verifyAdmin(request)
    
    if (admin.role !== 'superadmin') {
      return NextResponse.json(
        { error: 'Access denied. Superadmin role required.' },
        { status: 403 }
      )
    }

    await dbConnect()

    const users = await Admin.find({}, { password: 0 }).sort({ createdAt: -1 })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const admin = await verifyAdmin(request)
    
    if (admin.role !== 'superadmin') {
      return NextResponse.json(
        { error: 'Access denied. Superadmin role required.' },
        { status: 403 }
      )
    }

    await dbConnect()

    const { username, email, password, role } = await request.json()

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      )
    }

    const newAdmin = await Admin.create({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: role || 'admin'
    })

    const { password: _, ...adminData } = newAdmin.toObject()

    return NextResponse.json(adminData, { status: 201 })
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0]
      return NextResponse.json(
        { error: `${field} already exists` },
        { status: 400 }
      )
    }
    console.error('Error creating admin:', error)
    return NextResponse.json(
      { error: 'Failed to create admin' },
      { status: 500 }
    )
  }
}
