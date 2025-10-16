import { prisma } from '@/lib/prisma'

// Mock the Prisma client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  })),
}))

describe('Prisma client', () => {
  it('should export a prisma instance', () => {
    expect(prisma).toBeDefined()
    expect(prisma).toHaveProperty('$connect')
    expect(prisma).toHaveProperty('$disconnect')
  })

  it('should be a singleton instance', () => {
    const { prisma: prisma2 } = require('@/lib/prisma')
    expect(prisma).toBe(prisma2)
  })
})
