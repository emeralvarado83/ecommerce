'use client'

import { Suspense, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
})

type ResetPasswordData = z.infer<typeof resetPasswordSchema>

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema)
  })

  const onSubmit = async (data: ResetPasswordData) => {
    if (!token) {
      setError('Token inválido')
      return
    }

    setError(null)

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: data.password })
      })

      if (res.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } else {
        const result = await res.json()
        setError(result.error || 'Error al restablecer la contraseña')
      }
    } catch {
      setError('Error al procesar la solicitud')
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7] p-4">
        <div className="bg-white p-8 rounded-[2.5px] shadow-md max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Enlace inválido</h1>
          <p className="text-gray-600 mb-6">El enlace de recuperación ha expirado o es inválido.</p>
          <Link href="/forgot-password">
            <Button className="bg-[#0A84FF] hover:bg-[#007AE6] text-white">
              Solicitar nuevo enlace
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7] p-4">
      <div className="bg-white p-8 rounded-[2.5px] shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-2">Nueva contraseña</h1>
        <p className="text-gray-600 text-center mb-6 text-sm">
          Ingresa tu nueva contraseña.
        </p>

        {success ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">
              Tu contraseña ha sido restablecida correctamente.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Serás redirigido al login en unos segundos...
            </p>
            <Link href="/login">
              <Button className="bg-[#0A84FF] hover:bg-[#007AE6] text-white">
                Ir al login
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Nueva contraseña</Label>
              <Input
                id="password"
                type="password"
                className="h-10 border-gray-300 focus:border-[#0A84FF] focus:ring-[#0A84FF]"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirmar contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                className="h-10 border-gray-300 focus:border-[#0A84FF] focus:ring-[#0A84FF]"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full bg-[#0A84FF] hover:bg-[#007AE6] text-white h-10" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Restablecer contraseña'}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7] p-4">
        <div className="bg-white p-8 rounded-[2.5px] shadow-md max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A84FF] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}