'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida')
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginFormData) => {
    setError(null)

    const result = await signIn('credentials', {
      ...data,
      redirect: false
    })

    if (result?.error) {
      if (result.error === 'EMAIL_NOT_VERIFIED') {
        setError('Debes verificar tu correo electrónico antes de iniciar sesión.')
      } else {
        setError('Email o contraseña incorrectos')
      }
    } else {
      router.push(callbackUrl)
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
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

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">Contraseña</Label>
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

      <Button type="submit" className="w-full bg-[#0A84FF] hover:bg-[#007AE6] text-white h-10" disabled={isSubmitting}>
        {isSubmitting ? 'Ingresando...' : 'Iniciar Sesión'}
      </Button>

      <div className="text-center">
        <Link href="/forgot-password" className="text-sm text-[#0A84FF] hover:underline">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>
    </form>
  )
}