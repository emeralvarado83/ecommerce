'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string(),
  price: z.number().min(0.01),
  stock: z.number().int().min(0),
  sku: z.string().optional(),
  brand: z.string().optional(),
  color: z.string().optional(),
  condition: z.string().optional(),
  categoryId: z.string().optional(),
  isFeatured: z.boolean(),
  isActive: z.boolean()
})

type ProductFormData = z.infer<typeof productSchema>

type Category = {
  id: string
  name: string
}

type ProductImage = {
  id: string
  url: string
  position: number
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [images, setImages] = useState<ProductImage[]>([])
  const [newImageUrl, setNewImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema)
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const [productRes, categoriesRes, imagesRes] = await Promise.all([
          fetch(`/api/admin/products/${productId}`),
          fetch('/api/admin/categories'),
          fetch(`/api/admin/products/${productId}/images`)
        ])
        
        if (productRes.ok) {
          const data = await productRes.json()
          reset(data)
        }
        
        if (categoriesRes.ok) {
          const cats = await categoriesRes.json()
          setCategories(cats)
        }

        if (imagesRes.ok) {
          const imgs = await imagesRes.json()
          setImages(imgs)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [productId, reset])

  const onSubmit = async (data: ProductFormData) => {
    setSaving(true)
    setError(null)

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
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
      setError('Error al guardar producto')
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return
    
    setDeleting(true)
    setError(null)

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        const result = await res.json()
        setError(result.error)
        return
      }

      router.push('/admin/products')
    } catch {
      setError('Error al eliminar producto')
    } finally {
      setDeleting(false)
    }
  }

  const addImage = async () => {
    if (!newImageUrl) return
    
    try {
      const res = await fetch(`/api/admin/products/${productId}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: newImageUrl })
      })
      
      if (res.ok) {
        const img = await res.json()
        setImages([...images, img])
        setNewImageUrl('')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const deleteImage = async (imageId: string) => {
    if (!confirm('¿Eliminar imagen?')) return
    
    try {
      const res = await fetch(`/api/admin/products/${productId}/images?imageId=${imageId}`, {
        method: 'DELETE'
      })
      
      if (res.ok) {
        setImages(images.filter(img => img.id !== imageId))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })

      if (res.ok) {
        const data = await res.json()
        
        const imgRes = await fetch(`/api/admin/products/${productId}/images`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: data.url })
        })

        if (imgRes.ok) {
          const img = await imgRes.json()
          setImages([...images, img])
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return <div className="p-8">Cargando...</div>
  }

  return (
    <div className="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Editar Producto</CardTitle>
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Precio</Label>
                <Input id="price" type="number" step="0.01" {...register('price', { valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input id="stock" type="number" {...register('stock', { valueAsNumber: true })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" {...register('sku')} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Marca</Label>
                <Input id="brand" {...register('brand')} placeholder="Ej: Corsair, Samsung" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input id="color" {...register('color')} placeholder="Ej: Negro, Blanco" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">Estado</Label>
              <select
                id="condition"
                {...register('condition')}
                className="w-full p-2 border rounded-md"
              >
                <option value="Nuevo">Nuevo</option>
                <option value="Semi-nuevo">Semi-nuevo</option>
                <option value="Reacondicionado">Reacondicionado</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Categoría ID</Label>
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

            <div className="space-y-2">
              <Label>Imágenes del Producto</Label>
              <div className="grid grid-cols-4 gap-2">
                {images.map((img) => (
                  <div key={img.id} className="relative">
                    <img src={img.url} alt="" className="w-full h-20 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => deleteImage(img.id)}
                      className="absolute top-0 right-0 bg-red-500 text-white text-xs p-1 rounded"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="border rounded p-2"
                />
                {uploading && <span>Subiendo...</span>}
              </div>
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" {...register('isFeatured')} />
                Destacado
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" {...register('isActive')} />
                Activo
              </label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar'}
              </Button>
              <Button type="button" variant="destructive" onClick={onDelete} disabled={deleting}>
                {deleting ? 'Eliminando...' : 'Eliminar'}
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