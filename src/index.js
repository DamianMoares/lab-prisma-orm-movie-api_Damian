require('dotenv').config() // Cargar variables de entorno
const express = require('express')
const cors = require('cors')

// Importar rutas
const peliculasRoutes = require('./routes/peliculas')
const authRoutes = require('./routes/auth')

// Importar middleware de errores
const AppError = require('./utils/AppError')

// Crear app Express
const app = express()
const PORT = process.env.PORT || 3002

// Middleware globales
app.use(cors()) // Habilitar CORS para todas las rutas
app.use(express.json()) // Parsear JSON en el body

// Rutas de la API
app.use('/api/peliculas', peliculasRoutes)
app.use('/api/auth', authRoutes)

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    mensaje: 'API de Películas con Prisma ORM',
    version: '1.0.0',
    endpoints: {
      peliculas: '/api/peliculas',
      auth: '/api/auth',
      documentacion: 'Revisa README.md para más detalles'
    }
  })
})

// Middleware para manejar rutas no encontradas (404)
app.use('*', (req, res, next) => {
  next(new AppError(`Ruta ${req.originalUrl} no encontrada`, 404))
})

// Middleware global de manejo de errores
app.use((err, req, res, next) => {
  // Si el error no es operativo, lo convertimos en uno
  if (!err.isOperational) {
    console.error('ERROR 💥:', err)
    err.statusCode = 500
    err.status = 'error'
  }

  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`)
  console.log(`📚 API disponible en: http://localhost:${PORT}/api`)
  console.log(`🎬 Películas: http://localhost:${PORT}/api/peliculas`)
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth`)
})

// Manejar cierre graceful del proceso
process.on('SIGINT', async () => {
  console.log('\n👋 Cerrando servidor...')
  process.exit(0)
})

module.exports = app
