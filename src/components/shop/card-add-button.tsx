'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'

interface CardAddButtonProps {
  productId: string
}

export function CardAddButton({ productId }: CardAddButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleAdd = async () => {
    setLoading(true)
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 })
      })
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      size="sm" 
      className="bg-[rgba(52,199,89,0.5)] hover:bg-[rgba(52,199,89,1)] text-black hover:text-white rounded-[2.5px] px-4 h-10 border border-black/20"
      onClick={handleAdd}
      disabled={loading}
    >
      <ShoppingCart className="w-4 h-4 mr-1" />
      {loading ? 'Agregando...' : 'Agregar'}
    </Button>
  )
}