import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import { z } from 'zod'

const checkoutSchema = z.object({
  addressId: z.string()
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { addressId } = checkoutSchema.parse(body)

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Carrito vacío' },
        { status: 400 }
      )
    }

    const address = await prisma.address.findFirst({
      where: { id: addressId, userId: session.user.id }
    })

    if (!address) {
      return NextResponse.json(
        { error: 'Dirección no encontrada' },
        { status: 404 }
      )
    }

    for (const item of cart.items) {
      if (item.quantity > item.product.stock) {
        return NextResponse.json(
          { error: `Stock insuficiente para ${item.product.name}` },
          { status: 400 }
        )
      }
    }

    const subtotal = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    )
    const taxRate = 0.16
    const tax = subtotal * taxRate
    const total = subtotal + tax

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`

    const order = await prisma.order.create({
      data: {
        orderNumber,
        subtotal,
        tax,
        total,
        status: 'PENDING',
        userId: session.user.id,
        shippingAddressId: addressId,
        billingAddressId: addressId,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price
          }))
        }
      }
    })

    const lineItems = cart.items.map((item) => ({
      price_data: {
        currency: 'mxn',
        product_data: {
          name: item.product.name,
          metadata: {
            productId: item.productId
          }
        },
        unit_amount: Math.round(Number(item.product.price) * 100)
      },
      quantity: item.quantity
    }))

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/orders/${order.id}?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/checkout?canceled=true`,
      customer_email: session.user.email || undefined,
      metadata: {
        orderId: order.id,
        userId: session.user.id
      }
    })

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: stripeSession.id }
    })

    if (!stripeSession.url) {
      return NextResponse.json(
        { error: 'Error al crear sesión de pago' },
        { status: 500 }
      )
    }

    return NextResponse.json({ url: stripeSession.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Error al procesar checkout' },
      { status: 500 }
    )
  }
}