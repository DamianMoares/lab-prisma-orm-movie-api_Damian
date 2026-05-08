const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const prisma = require('../config/prisma')
const AppError = require('../utils/AppError')

const SALT_ROUNDS = 10

// Función para generar token JWT
const generarToken = (usuario) =>
  jwt.sign(
    { id: usuario.id, email: usuario.email, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  )

// POST /api/auth/registro
const registro = async (req, res, next) => {
  try {
    const { nombre, email, password, rol } = req.body

    // Validaciones básicas
    if (!nombre || !email || !password) {
      throw new AppError('nombre, email y password son obligatorios', 400)
    }

    if (password.length < 6) {
      throw new AppError('La contraseña debe tener al menos 6 caracteres', 400)
    }

    // Verificar que el email no exista
    const existe = await prisma.usuario.findUnique({ where: { email } })
    if (existe) {
      throw new AppError('Ya existe un usuario con ese email', 409)
    }

    // Encriptar contraseña
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

    // Crear usuario con Prisma
    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        email,
        passwordHash,
        rol: rol === 'admin' ? 'admin' : 'usuario' // Solo permitir rol admin si se especifica explícitamente
      },
      select: { // Excluir el passwordHash de la respuesta
        id: true, 
        nombre: true, 
        email: true, 
        rol: true, 
        createdAt: true 
      }
    })

    // Generar token y devolver respuesta
    res.status(201).json({ 
      token: generarToken(usuario), 
      usuario 
    })
  } catch (err) {
    next(err)
  }
}

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Validaciones básicas
    if (!email || !password) {
      throw new AppError('email y password son obligatorios', 400)
    }

    // Buscar usuario activo por email
    const usuario = await prisma.usuario.findFirst({
      where: { email, activo: true }
    })

    // Verificar credenciales
    if (!usuario || !(await bcrypt.compare(password, usuario.passwordHash))) {
      throw new AppError('Credenciales incorrectas', 401)
    }

    // Devolver token y datos del usuario (sin passwordHash)
    res.json({
      token: generarToken(usuario),
      usuario: { 
        id: usuario.id, 
        nombre: usuario.nombre, 
        email: usuario.email, 
        rol: usuario.rol 
      }
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { registro, login }
