// Script para probar la configuración de Prisma
const { PrismaClient } = require('@prisma/client');

async function testPrisma() {
  try {
    console.log('🔍 Probando configuración de Prisma...');
    
    // Intentar crear cliente Prisma
    const prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error']
    });
    
    console.log('✅ Cliente Prisma creado exitosamente');
    
    // Intentar conectar a la base de datos
    console.log('🔗 Intentando conectar a la base de datos...');
    await prisma.$connect();
    console.log('✅ Conexión exitosa a la base de datos');
    
    // Desconectar
    await prisma.$disconnect();
    console.log('👋 Desconexión exitosa');
    
  } catch (error) {
    console.error('❌ Error en la configuración:', error.message);
    
    if (error.message.includes('DATABASE_URL') || error.message.includes('connection')) {
      console.log('\n📝 SOLUCIÓN:');
      console.log('1. Copia .env.example a .env');
      console.log('2. Configura tu DATABASE_URL en .env');
      console.log('3. Asegúrate de que PostgreSQL esté corriendo');
      console.log('4. Ejecuta: npm run migrate --name init');
    }
    
    process.exit(1);
  }
}

testPrisma();
