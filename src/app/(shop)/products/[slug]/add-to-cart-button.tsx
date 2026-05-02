'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'

interface AddToCartButtonProps {
  productId: string
}

export function AddToCartButton({ productId }: AddToCartButtonProps) {
  const router = useRouter()
  const { status, data: session } = useSession()
  const [loading, setLoading] = useState(false)

  const handleAddToCart = async () => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/cart')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 })
      })

      if (res.ok) {
        router.push('/cart')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleAddToCart} disabled={loading} size="lg" className="bg-[#34C759] hover:bg-[#2BA84A] text-white w-full md:w-auto">
      {loading ? 'Añadiendo...' : 'Añadir al Carrito'}
    </Button>
  )
}