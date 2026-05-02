import Link from 'next/link'
import { prisma } from '@/lib/db'
import type { Product, Category, ProductImage } from '@prisma/client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CardAddButton } from '@/components/shop/card-add-button'
import { FavoriteButton } from '@/components/shop/favorite-button'

export const dynamic = 'force-dynamic'

type ProductWithRelations = Product & {
  category: Category | null
  images: ProductImage[]
}

async function getCategoryBySlug(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug }
  })
  return category
}

async function getProductsByCategory(categoryId: string): Promise<ProductWithRelations[]> {
  const products = await prisma.product.findMany({
    where: { isActive: true, categoryId },
    include: {
      category: true,
      images: { where: { position: 0 }, take: 1 }
    },
    orderBy: { createdAt: 'desc' }
  })
  return products as ProductWithRelations[]
}

interface Props {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Categoría no encontrada</h1>
      </div>
    )
  }

  const products = await getProductsByCategory(category.id)

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#111111]">{category.name}</h1>
        {category.description && (
          <p className="text-gray-600 mt-2">{category.description}</p>
        )}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No hay productos en esta categoría</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
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
              <div className="mt-auto p-3 pt-0 flex justify-between gap-2">
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