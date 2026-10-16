'use client'

import { useEffect } from 'react'

export function NetworkRecovery() {
  useEffect(() => {
    let wasOffline = !navigator.onLine
    let reloadTimer: number | undefined

    const handleOffline = () => {
      wasOffline = true
    }

    const handleOnline = () => {
      if (!wasOffline || reloadTimer !== undefined) return
      reloadTimer = window.setTimeout(() => {
        window.location.reload()
      }, 350)
    }

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
      if (reloadTimer !== undefined) window.clearTimeout(reloadTimer)
    }
  }, [])

  return null
}
