'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CardAddButton } from '@/components/shop/card-add-button'
import { FavoriteButton } from '@/components/shop/favorite-button'
import { Heart } from 'lucide-react'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  images: { url: string }[]
  category: { name: string } | null
}

interface FavoriteWithProduct {
  id: string
  product: Product
}

export default function FavoritesPage() {
  const { data: session, status } = useSession()
  const [favorites, setFavorites] = useState<FavoriteWithProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      window.location.href = '/login'
      return
    }

    if (status === 'authenticated') {
      const fetchFavorites = async () => {
        try {
          const res = await fetch('/api/favorites')
          const data = await res.json()
          setFavorites(data.favorites || [])
        } catch (error) {
          console.error('Error fetching favorites:', error)
        } finally {
          setLoading(false)
        }
      }

      fetchFavorites()
    }
  }, [status])

  const removeFavorite = (productId: string) => {
    setFavorites(prev => prev.filter(p => p.id !== productId))
  }

  if (loading || status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center text-gray-600">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#111111]">Mis Favoritos</h1>
        <p className="text-gray-600 mt-2">
          Productos que has guardado como favoritos
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-4">No tienes productos en favoritos</p>
          <Link href="/products">
            <Button className="bg-[#0A84FF] hover:bg-[#007AE6] text-white">
              Ver Productos
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((favorite) => {
            const product = favorite.product
            return (
            <Card key={product.id} className="shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden flex flex-col rounded-[2.5px] relative">
              <FavoriteButton productId={product.id} />
              <div className="p-3 pb-0">
                {product.category && (
                  <Badge variant="secondary" className="w-fit bg-[#F5F5F7] text-gray-600">
                    {product.category.name}
                  </Badge>
                )}
              </div>
              <CardContent className="p-3">
                <Link href={`/products/${product.slug}`}>
                  <div className="relative aspect-square bg-white rounded-[2.5px] overflow-hidden flex items-center justify-center p-4 group-hover:bg-gray-50 transition-colors">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="max-w-full max-h-full w-auto h-auto object-contain"
                      />
                    ) : (
                      <span className="text-gray-400">Sin imagen</span>
                    )}
                  </div>
                </Link>
              </CardContent>
              <div className="px-7 pb-7">
                <Link href={`/products/${product.slug}`} className="block">
                  <h3 className="line-clamp-2 text-sm font-semibold text-[#111111] hover:text-[#0A84FF] transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <div className="mt-1">
                  <span className="inline-block bg-[#FDCB66] text-black px-3 py-1 rounded-md text-sm font-semibold">
                    ${Number(product.price).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="mt-auto p-7 pt-0 pb-0 flex justify-between gap-2">
                <Button size="sm" className="bg-[rgba(10,132,255,0.5)] hover:bg-[rgba(10,132,255,1)] text-black hover:text-white rounded-[2.5px] px-4 h-10 border border-black/20">
                  <Link href={`/products/${product.slug}`}>Ver Detalles</Link>
                </Button>
                <CardAddButton productId={product.id} />
              </div>
            </Card>
          )})}
        </div>
      )}
    </div>
  )
}