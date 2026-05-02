import Link from 'next/link'
import { prisma } from '@/lib/db'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

async function getOrders() {
  const orders = await prisma.order.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' }
  })
  return orders
}

export default async function AdminOrdersPage() {
  const orders = await getOrders()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pedidos</h1>
        <p className="text-gray-600">Gestiona los pedidos</p>
      </div>

      <div className="border rounded-[2.5px] overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Orden</th>
              <th className="px-4 py-2 text-left">Usuario</th>
              <th className="px-4 py-2 text-left">Total</th>
              <th className="px-4 py-2 text-left">Estado</th>
              <th className="px-4 py-2 text-left">Fecha</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="px-4 py-2">{order.orderNumber}</td>
                <td className="px-4 py-2">{order.user.name || order.user.email}</td>
                <td className="px-4 py-2">${Number(order.total).toFixed(2)}</td>
                <td className="px-4 py-2">
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
                </td>
                <td className="px-4 py-2">
                  {order.createdAt.toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  <Link href={`/admin/orders/${order.id}`}>
                    <Button variant="ghost" size="sm">
                      Ver
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}