import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const cartItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().min(1).default(1)
})

const updateCartItemSchema = z.object({
  itemId: z.string(),
  quantity: z.number().min(1)
})

const deleteCartItemSchema = z.object({
  itemId: z.string()
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
    const { productId, quantity } = cartItemSchema.parse(body)

    const product = await prisma.product.findUnique({
      where: { id: productId, isActive: true }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { error: 'Stock insuficiente' },
        { status: 400 }
      )
    }

    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id }
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.user.id }
      })
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId
        }
      }
    })

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity

      if (newQuantity > product.stock) {
        return NextResponse.json(
          { error: 'Stock insuficiente' },
          { status: 400 }
        )
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity }
      })
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Cart error:', error)
    return NextResponse.json(
      { error: 'Error al añadir al carrito' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { itemId, quantity } = updateCartItemSchema.parse(body)

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id }
    })

    if (!cart) {
      return NextResponse.json(
        { error: 'Carrito no encontrado' },
        { status: 404 }
      )
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id }
    })

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Item no encontrado' },
        { status: 404 }
      )
    }

    const product = await prisma.product.findUnique({
      where: { id: cartItem.productId }
    })

    if (!product || product.stock < quantity) {
      return NextResponse.json(
        { error: 'Stock insuficiente' },
        { status: 400 }
      )
    }

    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Cart error:', error)
    return NextResponse.json(
      { error: 'Error al actualizar cantidad' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { itemId } = deleteCartItemSchema.parse(body)

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id }
    })

    if (!cart) {
      return NextResponse.json(
        { error: 'Carrito no encontrado' },
        { status: 404 }
      )
    }

    await prisma.cartItem.deleteMany({
      where: { id: itemId, cartId: cart.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Cart error:', error)
    return NextResponse.json(
      { error: 'Error al eliminar item' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ items: [] })
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { position: 0 }, take: 1 }
              }
            }
          }
        }
      }
    })

    return NextResponse.json({ items: cart?.items || [] })
  } catch (error) {
    console.error('Cart error:', error)
    return NextResponse.json(
      { error: 'Error al obtener el carrito' },
      { status: 500 }
    )
  }
}