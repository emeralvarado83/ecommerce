import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { randomBytes } from 'crypto'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { sendVerificationEmail } from '@/lib/email'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = registerSchema.parse(body)

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 400 }
      )
    }

    const hashedPassword = await hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword
      }
    })

    const verificationToken = randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: verificationToken,
        expires
      }
    })

    await sendVerificationEmail(email, verificationToken)

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      message: 'Registro exitoso. Por favor verifica tu correo electrónico.'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0]
      return NextResponse.json(
        { error: firstError?.message || 'Validation error' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error al registrar usuario' },
      { status: 500 }
    )
  }
}