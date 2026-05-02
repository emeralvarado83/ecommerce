import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

async function getAddresses() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')
  
  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: { isDefault: 'desc' }
  })
  return addresses
}

export default async function AccountPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')
  
  const addresses = await getAddresses()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mi Cuenta</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Nombre:</strong> {session.user.name || 'No registrado'}</p>
              <p><strong>Email:</strong> {session.user.email}</p>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Direcciones</CardTitle>
            </CardHeader>
            <CardContent>
              {addresses.length === 0 ? (
                <p className="text-gray-600">No hay direcciones guardadas</p>
              ) : (
                <div className="space-y-2">
                  {addresses.map((address) => (
                    <div key={address.id} className="p-2 border rounded">
                      <p>{address.name}</p>
                      <p className="text-sm text-gray-600">{address.address}</p>
                      <p className="text-sm text-gray-600">
                        {address.city}, {address.state} {address.postal}
                      </p>
                      {address.isDefault && (
                        <span className="text-xs bg-blue-100 px-2 py-1 rounded">
                          Principal
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <Button variant="outline" className="mt-4">
                Añadir Dirección
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}