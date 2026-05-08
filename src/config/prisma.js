const { PrismaClient } = require('@prisma/client')

// Configuración del cliente Prisma con logs en desarrollo
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error']
})

module.exports = prisma
