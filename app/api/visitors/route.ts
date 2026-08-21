import { NextResponse } from 'next/server'
import { getStats, recordVisitor } from '@/lib/db'

export async function GET() {
  try {
    const stats = await getStats()
    return NextResponse.json({ success: true, stats })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch stats' }, { status: 500 })
  }
}

export async function POST() {
  try {
    const visitor = await recordVisitor()
    const stats = await getStats()
    return NextResponse.json({ success: true, visitor, stats })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to record visitor' }, { status: 500 })
  }
}
