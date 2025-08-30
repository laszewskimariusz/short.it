import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'demo@example.com'
  const password = 'password123'
  const passwordHash = await bcrypt.hash(password, 10)

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash }
  })

  // Create a couple of links
  await prisma.link.upsert({
    where: { slug: 'hello' },
    update: {},
    create: {
      userId: user.id,
      slug: 'hello',
      originalUrl: 'https://example.com',
      title: 'Example Domain',
    }
  })

  await prisma.link.upsert({
    where: { slug: 'next' },
    update: {},
    create: {
      userId: user.id,
      slug: 'next',
      originalUrl: 'https://nextjs.org',
      title: 'Next.js',
    }
  })

  console.log('Seeded demo user:', email, 'password:', password)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

