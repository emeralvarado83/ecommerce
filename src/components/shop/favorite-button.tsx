'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FavoriteButtonProps {
  productId: string
}

export function FavoriteButton({ productId }: FavoriteButtonProps) {
  const { data: session, status } = useSession()
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      setLoading(false)
      return
    }

    if (status === 'authenticated') {
      const checkFavorite = async () => {
        try {
          const res = await fetch('/api/favorites')
          const data = await res.json()
          const product = data.favorites?.find((f: { product: { id: string } }) => f.product.id === productId)
          setIsFavorite(!!product)
        } catch (error) {
          console.error('Error checking favorite:', error)
        } finally {
          setLoading(false)
        }
      }

      checkFavorite()
    }
  }, [status, productId])

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (status === 'unauthenticated') {
      window.location.href = '/login'
      return
    }

    if (status === 'loading') {
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      })

      if (res.ok) {
        const data = await res.json()
        setIsFavorite(data.isFavorite)
      } else {
        console.error('Failed to toggle favorite:', res.status)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-[#F5F5F7] cursor-wait"
        disabled
      >
        <Heart className="h-4 w-4 text-gray-400" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-[#F5F5F7] hover:bg-[#F5F5F7]/80 cursor-pointer"
      onClick={toggleFavorite}
    >
      <Heart
        className={`h-4 w-4 transition-all ${isFavorite ? 'fill-[#0A84FF] text-[#0A84FF]' : 'text-gray-500 hover:text-[#0A84FF]'}`}
      />
    </Button>
  )
}