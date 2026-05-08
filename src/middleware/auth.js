const jwt = require('jsonwebtoken')
const AppError = require('../utils/AppError')

// Middleware para verificar token JWT
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
      throw new AppError('Token de autenticación requerido', 401)
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        throw new AppError('Token inválido o expirado', 403)
      }
      req.user = user
      next()
    })
  } catch (err) {
    next(err)
  }
}

// Middleware para verificar rol de admin
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.rol !== 'admin') {
    return next(new AppError('Se requiere rol de administrador', 403))
  }
  next()
}

// Middleware opcional para verificar rol (puede ser usuario o admin)
const requireAuth = (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Autenticación requerida', 401))
  }
  next()
}

module.exports = {
  authenticateToken,
  requireAdmin,
  requireAuth
}
