import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hash } from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()

    if (!token || !password) {
      return NextResponse.json({ error: 'Token y contraseña requeridos' }, { status: 400 })
    }

    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token }
    })

    if (!verificationToken) {
      return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 400 })
    }

    if (verificationToken.expires < new Date()) {
      await prisma.verificationToken.delete({
        where: { token }
      })
      return NextResponse.json({ error: 'El enlace ha expirado' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 400 })
    }

    const hashedPassword = await hash(password, 12)

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    })

    await prisma.verificationToken.delete({
      where: { token }
    })

    return NextResponse.json({ message: 'Contraseña actualizada correctamente' })
  } catch (error) {
    console.error('Error in reset-password:', error)
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 })
  }
}