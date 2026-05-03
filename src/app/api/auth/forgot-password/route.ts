import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { randomBytes } from 'crypto'
import { sendPasswordResetEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email requerido' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json({ message: 'Si el correo existe, recibirás un enlace de recuperación' }, { status: 200 })
    }

    const token = randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 60 * 60 * 1000)

    await prisma.verificationToken.deleteMany({
      where: { identifier: email }
    })

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires
      }
    })

    await sendPasswordResetEmail(email, token)

    return NextResponse.json({ message: 'Si el correo existe, recibirás un enlace de recuperación' })
  } catch (error) {
    console.error('Error in forgot-password:', error)
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 })
  }
}