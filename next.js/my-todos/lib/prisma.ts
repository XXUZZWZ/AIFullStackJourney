import { PrismaClient } from '@prisma/client'

/**
 * Prisma客户端单例
 * 在开发环境中，每次代码更改时会创建新的实例
 * 在生产环境中，确保只有一个实例以避免连接池耗尽
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
