import { NextResponse } from 'next/server'
import dbConnect from '../../../../../lib/mongodb'
import Admin from '../../../../../models/Admin'
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'

// Helper function to verify admin token
async function verifyAdmin(request) {
  const token = request.cookies.get('admin-token')?.value
  if (!token) {
    throw new Error('No token provided')
  }
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key')
  return decoded
}

export async function PUT(request, { params }) {
  try {
    const currentAdmin = await verifyAdmin(request)
    const targetUserId = params.id
    
    await dbConnect()

    const { username, email, role, active, currentPassword, newPassword } = await request.json()

    // Check permissions
    const isSelfUpdate = currentAdmin.id === targetUserId
    const isSuperAdmin = currentAdmin.role === 'superadmin'

    if (!isSelfUpdate && !isSuperAdmin) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    const targetUser = await Admin.findById(targetUserId)
    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const updateData = {}

    // Self-updates or superadmin updates
    if (username && username.trim() !== targetUser.username) {
      updateData.username = username.trim()
    }

    if (email && email.trim().toLowerCase() !== targetUser.email) {
      updateData.email = email.trim().toLowerCase()
    }

    // Only superadmins can change roles and active status of others
    if (!isSelfUpdate && isSuperAdmin) {
      if (role && role !== targetUser.role) {
        updateData.role = role
      }
      if (active !== undefined && active !== targetUser.active) {
        updateData.active = active
      }
    }

    // Password change (requires current password for self-updates)
    if (newPassword) {
      if (isSelfUpdate) {
        if (!currentPassword) {
          return NextResponse.json(
            { error: 'Current password is required' },
            { status: 400 }
          )
        }

        const isCurrentPasswordValid = await targetUser.comparePassword(currentPassword)
        if (!isCurrentPasswordValid) {
          return NextResponse.json(
            { error: 'Current password is incorrect' },
            { status: 400 }
          )
        }
      }

      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: 'New password must be at least 6 characters' },
          { status: 400 }
        )
      }

      updateData.password = await bcryptjs.hash(newPassword, 12)
    }

    const updatedUser = await Admin.findByIdAndUpdate(
      targetUserId,
      updateData,
      { new: true, runValidators: true }
    )

    const { password: _, ...userData } = updatedUser.toObject()

    return NextResponse.json(userData)
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0]
      return NextResponse.json(
        { error: `${field} already exists` },
        { status: 400 }
      )
    }
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const currentAdmin = await verifyAdmin(request)
    
    if (currentAdmin.role !== 'superadmin') {
      return NextResponse.json(
        { error: 'Access denied. Superadmin role required.' },
        { status: 403 }
      )
    }

    if (currentAdmin.id === params.id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      )
    }

    await dbConnect()

    const user = await Admin.findByIdAndDelete(params.id)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}
