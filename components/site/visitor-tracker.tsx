'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export function VisitorTracker() {
  const pathname = usePathname()
  const lastTrackedPath = useRef<string | null>(null)

  useEffect(() => {
    // Prevent tracking for admin routes, API routes, or duplicate logging
    if (!pathname || pathname.startsWith('/admin') || pathname.startsWith('/api') || lastTrackedPath.current === pathname) return
    lastTrackedPath.current = pathname

    async function recordVisit() {
      try {
        let publicIp = ''
        try {
          // Attempt quick public IP fetch (1.5s timeout)
          const ipRes = await fetch('https://api.ipify.org?format=json', {
            signal: AbortSignal.timeout ? AbortSignal.timeout(1500) : undefined,
          }).catch(() => null)
          if (ipRes && ipRes.ok) {
            const ipData = await ipRes.json().catch(() => null)
            if (ipData?.ip) publicIp = String(ipData.ip).trim()
          }
        } catch {
          // Fallback to server-side extraction
        }

        const fullPath = typeof window !== 'undefined' ? window.location.pathname || pathname : pathname

        await fetch('/api/visitors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            path: fullPath || '/',
            clientIp: publicIp || undefined,
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
          }),
          cache: 'no-store',
        }).catch(() => {})
      } catch (err) {
        console.error('VisitorTracker error:', err)
      }
    }

    recordVisit()
  }, [pathname])

  return null
}
