import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {}

main()
  .catch(() => {
    process.exit(1)
  })
  .finally(() => {
    void prisma.$disconnect()
  })
