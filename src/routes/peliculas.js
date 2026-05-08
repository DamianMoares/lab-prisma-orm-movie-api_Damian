const express = require('express')
const router = express.Router()

// Importar el controlador actualizado con Prisma
const {
  listarPeliculas,
  obtenerPelicula,
  crearPelicula,
  actualizarPelicula,
  eliminarPelicula
} = require('../controllers/peliculasPrismaController')

// Middleware de autenticación (para endpoints protegidos)
const { authenticateToken } = require('../middleware/auth')

// Rutas públicas
router.get('/', listarPeliculas) // GET /api/peliculas
router.get('/:id', obtenerPelicula) // GET /api/peliculas/:id

// Rutas protegidas (requieren autenticación)
router.post('/', authenticateToken, crearPelicula) // POST /api/peliculas
router.put('/:id', authenticateToken, actualizarPelicula) // PUT /api/peliculas/:id
router.delete('/:id', authenticateToken, eliminarPelicula) // DELETE /api/peliculas/:id

module.exports = router
