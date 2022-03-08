const express = require('express')
const http = require('http')
const path = require('path')
const router = require('./routers/app.routers')
const { ProductosDaoMongoDb } = require('./models/index')
const { ChatDaoMongoDb } = require('./models/index')

const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server)

const chat = new ChatDaoMongoDb("chat")
const productos = new ProductosDaoMongoDb("productos")
const PORT = process.env.PORT || 8080;


app.use(express.static('public'));

// Rutas
app.get('/', (req, res) => {
  res.sendFile(__dirname +'/public/index.html')
})
app.use(router);

io.on('connection', async (socket) => {
  const lista = await chat.listarAll()
  emitir(lista)

  socket.on("incomingMessage", async (message) =>{
    await chat.guardar(message)
    // console.log(lista)
    emitir(lista)
  })
})

const emitir = (mensajes = []) => io.sockets.emit("chat", mensajes)

server.listen(PORT, () => { console.log(`Running on port: ${PORT}`)})
