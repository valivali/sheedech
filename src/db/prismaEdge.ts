import { PrismaClient } from "@prisma/client/edge"
import { withAccelerate } from "@prisma/extension-accelerate"

const globalForPrisma = globalThis as unknown as {
  prismaEdge: any
}

const createPrismaClient = () =>
  new PrismaClient().$extends(withAccelerate())

export const prisma = globalForPrisma.prismaEdge ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaEdge = prisma
}

