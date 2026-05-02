import 'dotenv/config'
import { hash } from 'bcryptjs'
import { prisma } from '../src/lib/db'
import { Role } from '@prisma/client'

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminEmail || !adminPassword) {
    console.log('⚠️ ADMIN_EMAIL o ADMIN_PASSWORD no configurados en .env')
    return
  }

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  })

  if (existingAdmin) {
    console.log('⚠️ Admin ya existe:', adminEmail)
    return
  }

  const hashedPassword = await hash(adminPassword, 12)

  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Admin',
      role: 'ADMIN' as Role
    }
  })

  console.log('✅ Admin creado:', adminEmail)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })