'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { ShoppingCart } from 'lucide-react'

export function CartIndicator() {
  const { status } = useSession()
  const [count, setCount] = useState(0)

  const fetchCartCount = useCallback(async () => {
    if (status === 'authenticated') {
      try {
        const res = await fetch('/api/cart/count', { cache: 'no-store' })
        const data = await res.json()
        setCount(data.count || 0)
      } catch {
        setCount(0)
      }
    } else {
      setCount(0)
    }
  }, [status])

  useEffect(() => {
    fetchCartCount()
  }, [fetchCartCount])

  useEffect(() => {
    if (status !== 'authenticated') return

    const handleFocus = () => fetchCartCount()

    window.addEventListener('focus', handleFocus)

    const interval = setInterval(fetchCartCount, 3000)

    return () => {
      window.removeEventListener('focus', handleFocus)
      clearInterval(interval)
    }
  }, [status, fetchCartCount])

  if (count === 0) return null

  return (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
      {count > 99 ? '99+' : count}
    </span>
  )
}