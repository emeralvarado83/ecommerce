import Link from 'next/link'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

async function getCategories() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    },
    orderBy: { name: 'asc' }
  })
  return categories
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#111111]">Categorías</h1>
        <p className="text-gray-600 mt-2">
          Explora nuestros productos por categoría
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No hay categorías disponibles</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.slug}`}>
              <Card className="h-full hover:shadow-xl transition-all duration-300 group overflow-hidden cursor-pointer">
                <div className="aspect-video bg-white flex items-center justify-center p-4 group-hover:bg-gray-50 transition-colors">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="max-w-full max-h-full w-auto h-auto"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-4xl text-gray-400 font-bold">
                      {category.name.charAt(0)}
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    {category._count.products} productos
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}