const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')

const app = express()

// Middlewares globales
app.use(helmet())           // Cabeceras de seguridad automaticamente
app.use(cors())         // Permite que se conecten a hacer peticiones desde otro dominio
app.use(morgan('dev'))              //Logea cada request en consola 
app.use(express.json())         //Permite leer peticiones en formateo JSON
app.use(express.urlencoded({ extended: true }))         //Pertmite leer datros de formularios HTML

// Ruta de salud del servidor
app.get('/api/health', (req, res) => {
  res.json({ ok: true, mensaje: 'UniMarket API funcionando' })
})

module.exports = app