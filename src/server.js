const http = require('http')
const { Server } = require('socket.io')
require('dotenv').config()

const app = require('./app')
const { conectarDB } = require('./config/database')


const PORT = process.env.PORT || 3000

// Crear servidor HTTP desde Express
const server = http.createServer(app)

// Conectar Socket.io al servidor HTTP
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

// Evento base de Socket.io
io.on('connection', (socket) => {
  console.log(`Cliente conectado: ${socket.id}`)

  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`)
  })
})

// Levantar servidor
server.listen(PORT, async () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
  await conectarDB() // Conectar a la base de datos al iniciar el servidor
})