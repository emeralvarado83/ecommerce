'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string()
})

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  })

  const onSubmit = async (data: RegisterFormData) => {
    setError(null)

    if (data.password !== data.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password
        })
      })

      if (!res.ok) {
        const result = await res.json()
        setError(result.error)
        return
      }

      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false
      })

      if (result?.error === 'EMAIL_NOT_VERIFIED') {
        setError('Tu cuenta ha sido creada, recibiras un correo de confirmacion para validar tu cuenta.')
      } else if (result?.error) {
        setError('Error al iniciar sesión')
      } else {
        router.push('/')
        router.refresh()
      }
    } catch {
      setError('Error al registrar usuario')
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
        <Input id="email" type="email" className="h-10 border-gray-300 focus:border-[#0A84FF] focus:ring-[#0A84FF]" {...register('email')} />
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">Contraseña</Label>
        <Input id="password" type="password" className="h-10 border-gray-300 focus:border-[#0A84FF] focus:ring-[#0A84FF]" {...register('password')} />
        {errors.password && (
          <p className="text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirmar Contraseña</Label>
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
        {isSubmitting ? 'Registrando...' : 'Crear Cuenta'}
      </Button>
    </form>
  )
}