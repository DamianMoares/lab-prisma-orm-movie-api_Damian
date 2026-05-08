// Script para iniciar servidor y ejecutar pruebas
const { spawn } = require('child_process')

console.log('🚀 Iniciando servidor y pruebas...')

// Iniciar servidor
const server = spawn('node', ['src/index.js'], { stdio: 'pipe' })
let serverReady = false

server.stdout.on('data', (data) => {
  const output = data.toString()
  console.log('Servidor:', output.trim())
  
  if (output.includes('Servidor corriendo') && !serverReady) {
    serverReady = true
    console.log('🎯 Servidor listo, ejecutando pruebas...')
    
    // Esperar y ejecutar pruebas
    setTimeout(() => {
      const test = spawn('node', ['test-api.js'], { stdio: 'pipe' })
      
      test.stdout.on('data', (data) => {
        console.log('Test:', data.toString().trim())
      })
      
      test.stderr.on('data', (data) => {
        console.error('Test Error:', data.toString().trim())
      })
      
      test.on('close', (code) => {
        console.log(`\n📊 Pruebas finalizadas con código: ${code}`)
        server.kill()
      })
    }, 1000)
  }
})

server.stderr.on('data', (data) => {
  console.error('Error servidor:', data.toString().trim())
  server.kill()
})

// Timeout
setTimeout(() => {
  if (!serverReady) {
    console.log('⏰ Timeout: el servidor no inició a tiempo')
    server.kill()
  }
}, 10000)
