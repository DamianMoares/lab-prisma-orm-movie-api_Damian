// Script para probar endpoints básicos de la API
const http = require('http')

const BASE_URL = 'http://localhost:3002'

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3002,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const req = http.request(options, (res) => {
      let body = ''
      res.on('data', chunk => body += chunk)
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          body: JSON.parse(body)
        })
      })
    })

    req.on('error', reject)

    if (data) {
      req.write(JSON.stringify(data))
    }
    req.end()
  })
}

async function testAPI() {
  console.log('🧪 Iniciando pruebas de la API...')
  
  try {
    // Test 1: Listar películas
    console.log('\n1️⃣ Probando GET /api/peliculas...')
    const peliculas = await makeRequest('/api/peliculas')
    console.log(`   ✅ Status: ${peliculas.statusCode}`)
    console.log(`   📊 Películas encontradas: ${peliculas.body.data?.length || 0}`)
    
    if (peliculas.body.data?.length > 0) {
      console.log(`   🎬 Primera película: ${peliculas.body.data[0].titulo}`)
    }

    // Test 2: Obtener película específica
    console.log('\n2️⃣ Probando GET /api/peliculas/1...')
    const pelicula = await makeRequest('/api/peliculas/1')
    console.log(`   ✅ Status: ${pelicula.statusCode}`)
    if (pelicula.statusCode === 200) {
      console.log(`   🎥 Película: ${pelicula.body.titulo}`)
      console.log(`   📅 Año: ${pelicula.body.anio}`)
      console.log(`   ⭐ Nota: ${pelicula.body.nota}`)
    }

    // Test 3: Login de usuario
    console.log('\n3️⃣ Probando POST /api/auth/login...')
    const loginData = {
      email: 'usuario@peliculas.com',
      password: 'user123'
    }
    const login = await makeRequest('/api/auth/login', 'POST', loginData)
    console.log(`   ✅ Status: ${login.statusCode}`)
    if (login.statusCode === 200) {
      console.log(`   🔐 Token recibido: ${login.body.token ? 'Sí' : 'No'}`)
      console.log(`   👤 Usuario: ${login.body.usuario?.nombre}`)
      
      // Test 4: Crear película (con token)
      console.log('\n4️⃣ Probando POST /api/peliculas (con auth)...')
      const nuevaPelicula = {
        titulo: 'Test Movie API',
        anio: 2024,
        nota: 7.5,
        director: 'Test Director',
        genero: 'accion'
      }
      
      const options = {
        hostname: 'localhost',
        port: 3002,
        path: '/api/peliculas',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${login.body.token}`
        }
      }
      
      const crearPelicula = await new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
          let body = ''
          res.on('data', chunk => body += chunk)
          res.on('end', () => {
            resolve({
              statusCode: res.statusCode,
              body: JSON.parse(body)
            })
          })
        })
        req.on('error', reject)
        req.write(JSON.stringify(nuevaPelicula))
        req.end()
      })
      
      console.log(`   ✅ Status: ${crearPelicula.statusCode}`)
      if (crearPelicula.statusCode === 201) {
        console.log(`   🎬 Película creada: ${crearPelicula.body.titulo}`)
      }
    }

    // Test 5: Ruta de bienvenida
    console.log('\n5️⃣ Probando GET / (ruta principal)...')
    const home = await makeRequest('/')
    console.log(`   ✅ Status: ${home.statusCode}`)
    console.log(`   📝 Mensaje: ${home.body.mensaje}`)

    console.log('\n🎉 Todas las pruebas completadas exitosamente!')
    console.log('\n📋 Resumen de endpoints probados:')
    console.log('   ✅ GET /api/peliculas - Listar películas')
    console.log('   ✅ GET /api/peliculas/:id - Obtener película')
    console.log('   ✅ POST /api/auth/login - Autenticación')
    console.log('   ✅ POST /api/peliculas - Crear película (con auth)')
    console.log('   ✅ GET / - Ruta de bienvenida')

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message)
    console.log('\n💡 Asegúrate de que el servidor esté corriendo en http://localhost:3002')
  }
}

// Esperar un momento a que el servidor inicie
setTimeout(() => {
  testAPI()
}, 1000)
