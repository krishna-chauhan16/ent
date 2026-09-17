import { NextRequest, NextResponse } from 'next/server'
import { validateAdminCredentials, updateAdminCredentials } from '@/lib/db'

export const dynamic = 'force-dynamic'

// 1. POST: Authenticate Admin User from Database
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Both Username and Password are required' },
        { status: 400 },
      )
    }

    const matchedUser = await validateAdminCredentials(String(username), String(password))

    if (matchedUser) {
      return NextResponse.json({
        success: true,
        message: 'Authentication successful',
        token: `auth_dr_${Date.now()}`,
        username: matchedUser.username,
        doctorName: matchedUser.name,
        role: matchedUser.role,
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid Username or Password. Please check your credentials.' },
      { status: 401 },
    )
  } catch (error) {
    console.error('API /api/auth POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Authentication request failed' },
      { status: 500 },
    )
  }
}

// 2. PATCH: Update Admin Username and/or Password in Database
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { currentUsername, currentPassword, newUsername, newPassword } = body

    if (!currentUsername || !currentPassword) {
      return NextResponse.json(
        { success: false, error: 'Current Username and Current Password are required' },
        { status: 400 },
      )
    }

    if (!newPassword && !newUsername) {
      return NextResponse.json(
        { success: false, error: 'Please provide a New Username or New Password to update' },
        { status: 400 },
      )
    }

    const result = await updateAdminCredentials({
      currentUsername: String(currentUsername),
      currentPassword: String(currentPassword),
      newUsername: newUsername ? String(newUsername) : undefined,
      newPassword: newPassword ? String(newPassword) : undefined,
    })

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        username: result.username,
      })
    }

    return NextResponse.json(
      { success: false, error: result.message },
      { status: 400 },
    )
  } catch (error: any) {
    console.error('API /api/auth PATCH error:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update credentials in database' },
      { status: 500 },
    )
  }
}
