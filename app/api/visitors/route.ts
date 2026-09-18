import { NextRequest, NextResponse } from 'next/server'
import { getStats, recordVisitor, getRecentVisitorLogs, deleteVisitorLog } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function extractClientIp(req: NextRequest): string {
  // 1. Check X-Forwarded-For (standard proxy header)
  const forwardedFor = req.headers.get('x-forwarded-for')
  if (forwardedFor) {
    const rawIp = forwardedFor.split(',')[0].trim().replace(/^::ffff:/, '')
    if (rawIp === '::1') return '127.0.0.1'
    if (rawIp) return rawIp
  }

  // 2. Check X-Real-IP
  const realIp = req.headers.get('x-real-ip')
  if (realIp) {
    const rawIp = realIp.trim().replace(/^::ffff:/, '')
    if (rawIp === '::1') return '127.0.0.1'
    if (rawIp) return rawIp
  }

  // 3. Check Cloudflare & other CDN headers
  const cfConnectingIp = req.headers.get('cf-connecting-ip')
  if (cfConnectingIp) return cfConnectingIp.trim()

  const trueClientIp = req.headers.get('true-client-ip')
  if (trueClientIp) return trueClientIp.trim()

  const xClientIp = req.headers.get('x-client-ip')
  if (xClientIp) return xClientIp.trim()

  const forwarded = req.headers.get('forwarded')
  if (forwarded) {
    const match = forwarded.match(/for="?([^";,]+)/i)
    if (match?.[1]) {
      const rawIp = match[1].trim().replace(/^::ffff:/, '')
      if (rawIp === '::1') return '127.0.0.1'
      return rawIp
    }
  }

  // Default fallback
  return '127.0.0.1'
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const includeLogs = searchParams.get('logs') === 'true'
    const stats = await getStats()
    const logs = includeLogs ? await getRecentVisitorLogs(50) : undefined

    return NextResponse.json(
      { success: true, stats, logs },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      },
    )
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch stats' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    let ip = extractClientIp(req)
    let userAgent = req.headers.get('user-agent') || ''
    const referer = req.headers.get('referer') || ''

    let path = referer || '/'
    try {
      const body = await req.json().catch(() => ({}))
      if (body && typeof body === 'object') {
        if (body.path) {
          path = String(body.path).trim() || path
        }
        if (body.clientIp && (ip === '127.0.0.1' || ip === '::1')) {
          const rawClientIp = String(body.clientIp).trim()
          if (rawClientIp && rawClientIp.length <= 45) {
            ip = rawClientIp
          }
        }
        if (body.userAgent && typeof body.userAgent === 'string' && body.userAgent.trim()) {
          userAgent = body.userAgent.trim()
        }
      }
    } catch {
      path = referer || '/'
    }

    // Never log admin or internal API routes
    const lowerPath = path.toLowerCase()
    if (lowerPath.includes('/admin') || lowerPath.startsWith('/api')) {
      const stats = await getStats()
      return NextResponse.json(
        { success: true, ignored: true, stats },
        {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        },
      )
    }

    const visitor = await recordVisitor({ ip, userAgent, path })
    const stats = await getStats()

    return NextResponse.json(
      { success: true, visitor, stats },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      },
    )
  } catch (error) {
    console.error('API /api/visitors POST error:', error)
    return NextResponse.json({ success: false, error: 'Failed to record visitor' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (id) {
      const logId = parseInt(id, 10)
      if (!isNaN(logId)) {
        await deleteVisitorLog(logId)
        return NextResponse.json({ success: true, message: 'Visitor log deleted' })
      }
    }

    return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 })
  } catch (error) {
    console.error('API /api/visitors DELETE error:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete log' }, { status: 500 })
  }
}
