import { NextRequest, NextResponse } from 'next/server'
import {
  getAllAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from '@/lib/db'

export const dynamic = 'force-dynamic'

// 1. GET: List all Admin & Staff users
export async function GET() {
  try {
    const users = await getAllAdminUsers()
    return NextResponse.json({
      success: true,
      users,
    })
  } catch (error: any) {
    console.error('API /api/auth/users GET error:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch admin users' },
      { status: 500 },
    )
  }
}

// 2. POST: Create a new Staff / Admin user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { name, username, password, role } = body

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Both Username and Password are required.' },
        { status: 400 },
      )
    }

    const newUser = await createAdminUser({
      name: name || (role === 'super_admin' ? 'Dr. Vaidik Chauhan' : 'Clinic Reception Staff'),
      username: String(username),
      password: String(password),
      role: role || 'staff',
    })

    return NextResponse.json({
      success: true,
      message: `Staff account "${newUser.username}" created successfully.`,
      user: newUser,
    })
  } catch (error: any) {
    console.error('API /api/auth/users POST error:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create staff account' },
      { status: 400 },
    )
  }
}

// 3. PATCH: Update Staff user details or password
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { id, name, username, password, role } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required for update.' },
        { status: 400 },
      )
    }

    const updated = await updateAdminUser(String(id), {
      name,
      username,
      password,
      role,
    })

    return NextResponse.json({
      success: true,
      message: `Staff account "${updated.username}" updated successfully.`,
      user: updated,
    })
  } catch (error: any) {
    console.error('API /api/auth/users PATCH error:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update staff account' },
      { status: 400 },
    )
  }
}

// 4. DELETE: Delete a staff user
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    let id = searchParams.get('id')

    if (!id) {
      const body = await request.json().catch(() => ({}))
      id = body.id
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required to delete.' },
        { status: 400 },
      )
    }

    const success = await deleteAdminUser(String(id))
    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Staff user removed successfully from database.',
      })
    }

    return NextResponse.json(
      { success: false, error: 'Failed to delete user.' },
      { status: 400 },
    )
  } catch (error: any) {
    console.error('API /api/auth/users DELETE error:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete staff user' },
      { status: 400 },
    )
  }
}
