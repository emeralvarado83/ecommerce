'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import type { CartItem } from '@prisma/client'

interface CartItemWithProduct extends CartItem {
  product: {
    id: string
    name: string
    price: number
    stock: number
    images: { url: string }[]
  }
}

export default function CartPage() {
  const { status, data: session } = useSession()
  const router = useRouter()
  const [items, setItems] = useState<CartItemWithProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/cart')
      return
    }

    if (status === 'authenticated') {
      fetch('/api/cart')
        .then((res) => res.json())
        .then((data) => {
          setItems(data.items || [])
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [status, router])

  const updateQuantity = async (itemId: string, quantity: number) => {
    await fetch('/api/cart', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, quantity })
    })

    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    )
  }

  const removeItem = async (itemId: string) => {
    await fetch('/api/cart', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId })
    })

    setItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  )

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse h-96 bg-gray-100 rounded-[2.5px]"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-[#111111]">Carrito de Compras</h1>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Tu carrito está vacío</p>
          <Link href="/products">
            <Button className="bg-[#0A84FF] hover:bg-[#007AE6] text-white">Ver Productos</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="border-gray-200">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      {item.product.images[0] ? (
                        <img
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          Sin imagen
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <Link
                        href={`/products/${item.product.id}`}
                        className="font-semibold text-gray-900 hover:text-[#0A84FF] transition-colors"
                      >
                        {item.product.name}
                      </Link>

                      <p className="text-xl font-bold mt-2 text-[#111111]">
                        ${Number(item.product.price).toFixed(2)}
                      </p>

                      <div className="flex items-center gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            item.quantity > 1 &&
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          -
                        </Button>
                        <span className="font-medium w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            item.quantity < item.product.stock &&
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.product.stock}
                        >
                          +
                        </Button>

                        <Button
                          variant="ghost"
                          className="ml-auto text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeItem(item.id)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Resumen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-bold text-[#111111]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Envío</span>
                  <span className="text-sm text-gray-500">Calculado en checkout</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button className="w-full h-12 bg-[#34C759] hover:bg-[#2BA84A] text-white text-base font-semibold" size="lg">
                  <Link href="/checkout" className="w-full">
                    Proceder al Pago
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}