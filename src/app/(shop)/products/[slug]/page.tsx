import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import type { Product, Category, ProductImage } from '@prisma/client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AddToCartButton } from './add-to-cart-button'
import { ProductGallery } from './product-gallery'

export const dynamic = 'force-dynamic'

type ProductWithRelations = Product & {
  category: Category | null
  images: ProductImage[]
}

interface Props {
  params: Promise<{ slug: string }>
}

async function getProductBySlug(slug: string): Promise<ProductWithRelations | null> {
  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      category: true,
      images: { orderBy: { position: 'asc' } }
    }
  })
  return product as ProductWithRelations | null
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Link href="/products" className="text-[#0A84FF] hover:underline font-medium">
          ← Volver a productos
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <ProductGallery images={product.images} productName={product.name} />

        <div>
          {product.category && (
            <Badge variant="secondary" className="mb-4 bg-[#F5F5F7] text-gray-600">
              {product.category.name}
            </Badge>
          )}

          <h1 className="text-3xl font-bold mb-4 text-[#111111]">{product.name}</h1>

          <div className="text-3xl font-bold mb-6 text-[#111111]">
            ${Number(product.price).toFixed(2)}
          </div>

          {product.stock > 0 ? (
            <p className="text-green-600 mb-6 font-medium">En stock ({product.stock} unidades)</p>
          ) : (
            <p className="text-red-600 mb-6 font-medium">Agotado</p>
          )}

          <div className="prose mb-8 text-gray-600">
            <p>{product.description}</p>
          </div>

          {product.stock > 0 && (
            <AddToCartButton productId={product.id} />
          )}
        </div>
      </div>
    </div>
  )
}