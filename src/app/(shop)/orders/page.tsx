import Link from 'next/link'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'

async function getOrders() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')
  
  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: { product: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
  return orders
}

export default async function OrdersPage() {
  const orders = await getOrders()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mis Pedidos</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No tienes pedidos aún</p>
          <Link href="/products" className="text-blue-600 hover:underline">
            Ver productos
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-[2.5px] p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold">{order.orderNumber}</h3>
                  <p className="text-sm text-gray-600">
                    {order.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <Badge
                  variant={
                    order.status === 'PAID'
                      ? 'default'
                      : order.status === 'CANCELLED'
                      ? 'destructive'
                      : 'secondary'
                  }
                >
                  {order.status}
                </Badge>
              </div>

              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.product.name} x{item.quantity}
                    </span>
                    <span>${Number(item.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t mt-4 pt-4 flex justify-between font-bold">
                <span>Total</span>
                <span>${Number(order.total).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}