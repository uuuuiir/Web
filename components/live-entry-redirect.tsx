'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLive } from '@/lib/live'

export function LiveEntryRedirect() {
  const router = useRouter()
  const { data, checking } = useLive()

  useEffect(() => {
    if (!checking && data.live) {
      router.replace('/sondeos')
    }
  }, [checking, data.live, router])

  return null
}
