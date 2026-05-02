import Link from 'next/link'
import { prisma } from '@/lib/db'
import { Button } from '@/components/ui/button'

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

export default async function AdminCategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Categorías</h1>
          <p className="text-gray-600">Gestiona las categorías</p>
        </div>
        <Link href="/admin/categories/new">
          <Button>Nueva Categoría</Button>
        </Link>
      </div>

      <div className="border rounded-[2.5px] overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Slug</th>
              <th className="px-4 py-2 text-left">Productos</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-t">
                <td className="px-4 py-2">
                  <Link href={`/admin/categories/${category.id}`} className="hover:underline">
                    {category.name}
                  </Link>
                </td>
                <td className="px-4 py-2">{category.slug}</td>
                <td className="px-4 py-2">{category._count.products}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}