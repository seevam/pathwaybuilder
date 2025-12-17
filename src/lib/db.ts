import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Validate required environment variables
function validateDatabaseConfig() {
  const requiredEnvVars = ['POSTGRES_PRISMA_URL', 'POSTGRES_URL_NON_POOLING']
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar])

  if (missing.length > 0) {
    console.error(`Missing required database environment variables: ${missing.join(', ')}`)
    console.error('Please ensure your database is properly configured in your environment variables.')
    // Return false to allow graceful handling rather than throwing
    return false
  }

  return true
}

// Create PrismaClient with enhanced error handling
function createPrismaClient() {
  // Validate configuration
  if (!validateDatabaseConfig()) {
    console.warn('Database configuration incomplete. Prisma client may fail to connect.')
  }

  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      errorFormat: 'pretty',
    })
  } catch (error) {
    console.error('Failed to create Prisma client:', error)
    throw error
  }
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}
