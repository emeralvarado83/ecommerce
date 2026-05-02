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

const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  image: z.string().optional()
})

type CategoryFormData = z.infer<typeof categorySchema>

export default function EditCategoryPage() {
  const router = useRouter()
  const params = useParams()
  const categoryId = params.id as string
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema)
  })

  const imageUrl = watch('image')

  useEffect(() => {
    async function fetchCategory() {
      try {
        const res = await fetch(`/api/admin/categories/${categoryId}`)
        if (res.ok) {
          const data = await res.json()
          reset(data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchCategory()
  }, [categoryId, reset])

  const onSubmit = async (data: CategoryFormData) => {
    setSaving(true)
    setError(null)

    try {
      const res = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!res.ok) {
        const result = await res.json()
        setError(result.error)
        return
      }

      router.push('/admin/categories')
    } catch {
      setError('Error al guardar categoría')
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta categoría?')) return
    if (!confirm('ADVERTENCIA: Todos los productos de esta categoría quedarán sin categoría.')) return
    
    setDeleting(true)
    setError(null)

    try {
      const res = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        const result = await res.json()
        setError(result.error)
        return
      }

      router.push('/admin/categories')
    } catch {
      setError('Error al eliminar categoría')
    } finally {
      setDeleting(false)
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
        setValue('image', data.url)
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
          <CardTitle>Editar Categoría</CardTitle>
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
                className="w-full min-h-[80px] p-2 border rounded-md"
              />
            </div>

            <div className="space-y-2">
              <Label>Imagen de Categoría</Label>
              {imageUrl && (
                <div className="mb-2">
                  <img src={imageUrl} alt="Categoría" className="w-32 h-32 object-cover rounded" />
                </div>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileUpload}
                disabled={uploading}
                className="border rounded p-2 w-full"
              />
              {uploading && <span>Subiendo...</span>}
              <Input 
                id="image" 
                {...register('image')} 
                placeholder="O pega una URL de imagen"
                className="mt-2"
              />
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