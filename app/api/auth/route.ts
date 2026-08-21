import { NextRequest, NextResponse } from 'next/server'

// Valid admin credentials for Dr. Vaidik Chauhan & staff
const VALID_ACCOUNTS = [
  { username: 'admin', password: 'drvaidik2026' },
  { username: 'drvaidik', password: 'drvaidik2026' },
  { username: 'admin', password: 'admin123' },
  { username: 'drvc2527@gmail.com', password: 'drvaidik2026' },
  { username: 'drvaidik', password: 'admin123' },
  { username: 'vaidik', password: 'drvaidik2026' },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Both Username and Password are required' },
        { status: 400 },
      )
    }

    const matched = VALID_ACCOUNTS.find(
      (acc) =>
        acc.username.toLowerCase() === username.trim().toLowerCase() &&
        acc.password === password.trim(),
    )

    if (matched) {
      return NextResponse.json({
        success: true,
        message: 'Authentication successful',
        token: `auth_dr_${Date.now()}`,
        username: matched.username,
        doctorName: 'Dr. Vaidik Chauhan',
        role: 'Director & Head / Clinic Admin',
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid Username or Password. Please try again.' },
      { status: 401 },
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Authentication request failed' },
      { status: 500 },
    )
  }
}
