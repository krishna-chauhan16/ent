'use client'

import { useEffect, useState, useRef } from 'react'
import { Users } from 'lucide-react'

interface VisitorStats {
  total: number
  todayCount: number
}

export function VisitorCounter({ className = '' }: { className?: string }) {
  const [stats, setStats] = useState<VisitorStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [displayCount, setDisplayCount] = useState<number | null>(null)
  const previousTargetRef = useRef<number | null>(null)

  useEffect(() => {
    let isMounted = true

    // Function to record the visit (IP, Date, Full URL) on page load and receive live stats
    async function recordVisitOnPageLoad() {
      try {
        let publicIp = ''
        try {
          // Attempt to fetch public dynamic IP (with 1.5s timeout for fast fallback)
          const ipRes = await fetch('https://api.ipify.org?format=json', {
            signal: AbortSignal.timeout ? AbortSignal.timeout(1500) : undefined,
          }).catch(() => null)
          if (ipRes && ipRes.ok) {
            const ipData = await ipRes.json().catch(() => null)
            if (ipData?.ip) publicIp = String(ipData.ip).trim()
          }
        } catch {
          // Silent fallback to server-side extraction
        }

        const fullUrl = typeof window !== 'undefined' ? window.location.href : '/'

        const res = await fetch('/api/visitors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            path: fullUrl,
            clientIp: publicIp || undefined,
          }),
          cache: 'no-store',
        })

        const data = await res.json()
        if (isMounted && data?.success && data?.stats) {
          const total = Number(data.stats.visitorsTotal) || 0
          const today = Number(data.stats.visitorsToday) || 0
          setStats({ total, todayCount: today })
        }
      } catch (err) {
        console.error('Error logging visit:', err)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    // Function for periodic background refresh (fetches latest dynamic count)
    async function refreshStatsInBackground() {
      try {
        const res = await fetch('/api/visitors', {
          method: 'GET',
          cache: 'no-store',
        })
        const data = await res.json()
        if (isMounted && data?.success && data?.stats) {
          const total = Number(data.stats.visitorsTotal) || 0
          const today = Number(data.stats.visitorsToday) || 0
          setStats({ total, todayCount: today })
        }
      } catch (err) {
        console.error('Error refreshing visitor stats:', err)
      }
    }

    // Record visit with IP and Current Date immediately on page load
    recordVisitOnPageLoad()

    // Poll live counts in background every 15 seconds to keep numbers dynamic across sessions
    const interval = setInterval(refreshStatsInBackground, 15000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  // Smooth number count-up animation when dynamic count is received or updated
  useEffect(() => {
    if (!stats || stats.total <= 0) return

    const target = stats.total
    const prev = previousTargetRef.current

    // If first load, animate from (target - 30) or 0; if subsequent live update, animate from previous number
    const startCount = prev !== null ? prev : Math.max(0, target - 30)
    previousTargetRef.current = target

    const duration = prev !== null ? 500 : 900
    let startTimestamp: number | null = null

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      const easeOutQuad = 1 - (1 - progress) * (1 - progress)
      const current = Math.floor(startCount + easeOutQuad * (target - startCount))

      setDisplayCount(current)

      if (progress < 1) {
        requestAnimationFrame(step)
      } else {
        setDisplayCount(target)
      }
    }

    requestAnimationFrame(step)
  }, [stats])

  if (loading || !stats) {
    return (
      <div
        className={`inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3.5 py-1.5 text-xs text-primary-foreground/90 backdrop-blur-md dark:border-border dark:bg-card/70 dark:text-muted-foreground ${className}`}
      >
        <span className="relative flex size-2 items-center justify-center">
          <span className="relative inline-flex size-2 rounded-full bg-emerald-500/60 animate-pulse" />
        </span>
        <Users className="size-3.5 text-accent animate-pulse" />
        <span className="text-[11px] font-semibold tracking-wider uppercase text-primary-foreground/70 dark:text-muted-foreground">
          Visitors:
        </span>
        <span className="inline-block h-3.5 w-10 animate-pulse rounded bg-accent/30" />
      </div>
    )
  }

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3.5 py-1.5 text-xs text-primary-foreground/90 backdrop-blur-md transition-all hover:bg-primary-foreground/15 hover:border-primary-foreground/30 dark:border-border dark:bg-card/70 dark:text-muted-foreground dark:hover:text-foreground dark:hover:bg-card ${className}`}
      title={`Live Dynamic Visitor Counter: ${stats.total.toLocaleString()} Total Visits (${stats.todayCount} Today)`}
    >
      {/* Pulse live green dot indicator */}
      <span className="relative flex size-2 items-center justify-center">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
      </span>

      {/* Users Icon & Dynamic Count */}
      <span className="flex items-center gap-1.5 font-medium">
        <Users className="size-3.5 text-accent" />
        <span className="text-[11px] uppercase tracking-wider text-primary-foreground/75 dark:text-muted-foreground font-semibold">
          Visitors:
        </span>
        <span className="font-mono font-bold text-accent dark:text-accent tracking-wide text-xs">
          {(displayCount ?? stats.total).toLocaleString()}
        </span>
      </span>

      {/* Dynamic Today pill */}
      {stats.todayCount > 0 && (
        <span className="hidden sm:inline-flex items-center rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-semibold text-accent dark:bg-accent/15 dark:text-accent">
          +{stats.todayCount} today
        </span>
      )}
    </div>
  )
}
