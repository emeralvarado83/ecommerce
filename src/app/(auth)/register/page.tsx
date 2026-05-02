import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RegisterForm } from './register-form'

function RegisterFormFallback() {
  return <div className="animate-pulse h-80 bg-gray-100 rounded-md"></div>
}

export default function RegisterPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Crear Cuenta</CardTitle>
            <CardDescription>
              Regístrate para comprar en nuestra tienda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<RegisterFormFallback />}>
              <RegisterForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}