'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const productSchema = z.object({
  name: z.string().min(2, 'Nombre requerido'),
  slug: z.string().min(2, 'Slug requerido'),
  description: z.string().min(10, 'Descripción requerida'),
  price: z.number().min(0.01),
  stock: z.number().int().min(0),
  sku: z.string().optional(),
  categoryId: z.string().optional(),
  isFeatured: z.boolean(),
  isActive: z.boolean()
})

type ProductFormData = z.infer<typeof productSchema>

type Category = {
  id: string
  name: string
}

export default function NewProductPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      isFeatured: false,
      isActive: true
    }
  })

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/admin/categories')
        if (res.ok) {
          const data = await res.json()
          setCategories(data)
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchCategories()
  }, [])

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!res.ok) {
        const result = await res.json()
        setError(result.error)
        return
      }

      router.push('/admin/products')
    } catch {
      setError('Error al crear producto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Nuevo Producto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" {...register('name')} />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input id="slug" {...register('slug')} />
              {errors.slug && (
                <p className="text-sm text-red-600">{errors.slug.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <textarea
                id="description"
                {...register('description')}
                className="w-full min-h-[100px] p-2 border rounded-md"
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Precio</Label>
                <Input id="price" type="number" step="0.01" {...register('price', { valueAsNumber: true })} />
                {errors.price && (
                  <p className="text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input id="stock" type="number" {...register('stock', { valueAsNumber: true })} />
                {errors.stock && (
                  <p className="text-sm text-red-600">{errors.stock.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU (opcional)</Label>
              <Input id="sku" {...register('sku')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryId">Categoría ID</Label>
              <Input 
                id="categoryId" 
                {...register('categoryId')} 
                placeholder="ID de categoría (deja vacío si no tiene)"
                list="categories-list"
              />
              <datalist id="categories-list">
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} label={cat.name} />
                ))}
              </datalist>
              <p className="text-xs text-gray-500">
                Opciones: {categories.map(c => c.name).join(', ') || 'Sin categorías'}
              </p>
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" {...register('isFeatured')} />
                Destacado
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" {...register('isActive')} defaultChecked />
                Activo
              </label>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? 'Guardando...' : 'Crear Producto'}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}