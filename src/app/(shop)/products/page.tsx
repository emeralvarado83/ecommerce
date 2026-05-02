import Link from 'next/link'
import { prisma } from '@/lib/db'
import { Prisma } from '@prisma/client'
import type { Product, Category, ProductImage } from '@prisma/client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CardAddButton } from '@/components/shop/card-add-button'
import { Search, X } from 'lucide-react'

export const dynamic = 'force-dynamic'

type ProductWithRelations = Product & {
  category: Category | null
  images: ProductImage[]
}

async function getProducts(searchQuery?: string): Promise<ProductWithRelations[]> {
  const where: Prisma.ProductWhereInput = searchQuery ? {
    isActive: true,
    OR: [
      { name: { contains: searchQuery, mode: 'insensitive' } },
      { description: { contains: searchQuery, mode: 'insensitive' } },
      { category: { name: { contains: searchQuery, mode: 'insensitive' } } }
    ]
  } : { isActive: true }

  const products = await prisma.product.findMany({
    where,
    include: {
      category: true,
      images: { where: { position: 0 }, take: 1 }
    },
    orderBy: { createdAt: 'desc' },
    take: 12
  })
  return products as ProductWithRelations[]
}

export default async function ProductsPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q: searchQuery } = await searchParams
  const products = await getProducts(searchQuery)

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#111111]">Productos</h1>
        {searchQuery ? (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-gray-600">Resultados para:</span>
            <span className="bg-[#0A84FF]/10 text-[#0A84FF] px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
              <Search className="h-4 w-4" />
              {searchQuery}
              <Link href="/products" className="hover:text-[#007AE6]">
                <X className="h-4 w-4" />
              </Link>
            </span>
          </div>
        ) : (
          <p className="text-gray-600 mt-2">
            Explora nuestro catálogo de tecnología
          </p>
        )}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No hay productos disponibles</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden flex flex-col rounded-[2.5px]">
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
                    {product.images[0] ? (
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
          ))}
        </div>
      )}
    </div>
  )
}