'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido')
})

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema)
  })

  const onSubmit = async (data: ForgotPasswordData) => {
    setError(null)
    setSuccess(false)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (res.ok) {
        setSuccess(true)
      } else {
        const result = await res.json()
        setError(result.error || 'Error al enviar el correo')
      }
    } catch {
      setError('Error al procesar la solicitud')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7] p-4">
      <div className="bg-white p-8 rounded-[2.5px] shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-2">Recuperar contraseña</h1>
        <p className="text-gray-600 text-center mb-6 text-sm">
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        {success ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">
              Si el correo existe en nuestro sistema, recibirás un enlace de recuperación en breve.
            </p>
            <Link href="/login">
              <Button className="bg-[#0A84FF] hover:bg-[#007AE6] text-white">
                Volver al login
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
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                className="h-10 border-gray-300 focus:border-[#0A84FF] focus:ring-[#0A84FF]"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full bg-[#0A84FF] hover:bg-[#007AE6] text-white h-10" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar enlace de recuperación'}
            </Button>

            <div className="text-center">
              <Link href="/login" className="text-sm text-[#0A84FF] hover:underline">
                Volver al login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}