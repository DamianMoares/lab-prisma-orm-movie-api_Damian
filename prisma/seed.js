const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de datos para la API de Películas...')

  // Limpiar datos existentes
  await prisma.favorito.deleteMany()
  await prisma.resena.deleteMany()
  await prisma.pelicula.deleteMany()
  await prisma.usuario.deleteMany()
  await prisma.director.deleteMany()
  await prisma.genero.deleteMany()

  console.log('🗑️ Datos existentes eliminados')

  // Crear géneros
  const generos = await Promise.all([
    prisma.genero.create({
      data: { nombre: 'Ciencia Ficción', slug: 'ciencia-ficcion' }
    }),
    prisma.genero.create({
      data: { nombre: 'Acción', slug: 'accion' }
    }),
    prisma.genero.create({
      data: { nombre: 'Drama', slug: 'drama' }
    }),
    prisma.genero.create({
      data: { nombre: 'Comedia', slug: 'comedia' }
    }),
    prisma.genero.create({
      data: { nombre: 'Terror', slug: 'terror' }
    })
  ])

  console.log('🎭 Géneros creados:', generos.length)

  // Crear directores
  const directores = await Promise.all([
    prisma.director.create({
      data: { nombre: 'Christopher Nolan' }
    }),
    prisma.director.create({
      data: { nombre: 'Denis Villeneuve' }
    }),
    prisma.director.create({
      data: { nombre: 'Jordan Peele' }
    }),
    prisma.director.create({
      data: { nombre: 'Greta Gerwig' }
    }),
    prisma.director.create({
      data: { nombre: 'Quentin Tarantino' }
    })
  ])

  console.log('🎬 Directores creados:', directores.length)

  // Crear usuarios
  const usuarios = await Promise.all([
    prisma.usuario.create({
      data: {
        nombre: 'Admin User',
        email: 'admin@peliculas.com',
        passwordHash: '$2b$10$K8ZpdrKjQ6jQKQKQKQKQKO8ZpdrKjQ6jQKQKQKQKO8ZpdrKjQ6jQKQK', // password: admin123
        rol: 'admin'
      }
    }),
    prisma.usuario.create({
      data: {
        nombre: 'Regular User',
        email: 'usuario@peliculas.com',
        passwordHash: '$2b$10$K8ZpdrKjQ6jQKQKQKQKQKO8ZpdrKjQ6jQKQKQKQKO8ZpdrKjQ6jQKQK', // password: user123
        rol: 'usuario'
      }
    })
  ])

  console.log('👥 Usuarios creados:', usuarios.length)

  // Crear películas
  const peliculas = await Promise.all([
    prisma.pelicula.create({
      data: {
        titulo: 'Inception',
        anio: 2010,
        nota: 8.8,
        destacada: true,
        directorId: directores[0].id, // Christopher Nolan
        generoId: generos[0].id // Ciencia Ficción
      }
    }),
    prisma.pelicula.create({
      data: {
        titulo: 'Dune',
        anio: 2021,
        nota: 8.0,
        destacada: true,
        directorId: directores[1].id, // Denis Villeneuve
        generoId: generos[0].id // Ciencia Ficción
      }
    }),
    prisma.pelicula.create({
      data: {
        titulo: 'Get Out',
        anio: 2017,
        nota: 7.7,
        destacada: false,
        directorId: directores[2].id, // Jordan Peele
        generoId: generos[4].id // Terror
      }
    }),
    prisma.pelicula.create({
      data: {
        titulo: 'Barbie',
        anio: 2023,
        nota: 7.0,
        destacada: true,
        directorId: directores[3].id, // Greta Gerwig
        generoId: generos[3].id // Comedia
      }
    }),
    prisma.pelicula.create({
      data: {
        titulo: 'Pulp Fiction',
        anio: 1994,
        nota: 8.9,
        destacada: true,
        directorId: directores[4].id, // Quentin Tarantino
        generoId: generos[1].id // Acción
      }
    })
  ])

  console.log('🎥 Películas creadas:', peliculas.length)

  // Crear reseñas
  const resenas = await Promise.all([
    prisma.resena.create({
      data: {
        peliculaId: peliculas[0].id, // Inception
        autor: 'Crítico Cine',
        texto: 'Una obra maestra de la ciencia ficción con una trama compleja y fascinante.',
        puntuacion: 9
      }
    }),
    prisma.resena.create({
      data: {
        peliculaId: peliculas[0].id, // Inception
        autor: 'Fan del Cine',
        texto: 'Nolan supera todas las expectativas con este thriller psicológico.',
        puntuacion: 10
      }
    }),
    prisma.resena.create({
      data: {
        peliculaId: peliculas[1].id, // Dune
        autor: 'Experto en Sci-Fi',
        texto: 'Una adaptación espectacular de la novela clásica de Herbert.',
        puntuacion: 8
      }
    }),
    prisma.resena.create({
      data: {
        peliculaId: peliculas[2].id, // Get Out
        autor: 'Crítico de Terror',
        texto: 'Jordan Peele crea una obra maestra del terror social.',
        puntuacion: 8
      }
    })
  ])

  console.log('📝 Reseñas creadas:', resenas.length)

  // Crear favoritos
  const favoritos = await Promise.all([
    prisma.favorito.create({
      data: {
        usuarioId: usuarios[1].id, // Regular User
        peliculaId: peliculas[0].id // Inception
      }
    }),
    prisma.favorito.create({
      data: {
        usuarioId: usuarios[1].id, // Regular User
        peliculaId: peliculas[1].id // Dune
      }
    }),
    prisma.favorito.create({
      data: {
        usuarioId: usuarios[1].id, // Regular User
        peliculaId: peliculas[4].id // Pulp Fiction
      }
    })
  ])

  console.log('❤️ Favoritos creados:', favoritos.length)

  console.log('\n✅ Seed completado exitosamente!')
  console.log('\n📊 Resumen de datos creados:')
  console.log(`   - Géneros: ${generos.length}`)
  console.log(`   - Directores: ${directores.length}`)
  console.log(`   - Usuarios: ${usuarios.length}`)
  console.log(`   - Películas: ${peliculas.length}`)
  console.log(`   - Reseñas: ${resenas.length}`)
  console.log(`   - Favoritos: ${favoritos.length}`)
  
  console.log('\n🔑 Credenciales de prueba:')
  console.log('   Admin: admin@peliculas.com / admin123')
  console.log('   Usuario: usuario@peliculas.com / user123')
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
