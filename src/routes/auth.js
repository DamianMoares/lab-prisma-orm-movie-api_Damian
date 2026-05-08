const express = require('express')
const router = express.Router()

const { registro, login } = require('../controllers/authController')

// Rutas públicas de autenticación
router.post('/registro', registro) // POST /api/auth/registro
router.post('/login', login) // POST /api/auth/login

module.exports = router
