'use client'

import { useEffect } from 'react'

export function VisitorTracker() {
  useEffect(() => {
    // Check if visit already recorded in current session
    const visited = sessionStorage.getItem('vaidik_ent_visited')
    if (!visited) {
      fetch('/api/visitors', { method: 'POST' })
        .then(() => {
          sessionStorage.setItem('vaidik_ent_visited', 'true')
        })
        .catch(() => {
          // Ignore network errors silently
        })
    }
  }, [])

  return null
}
