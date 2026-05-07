const express = require('express')
const router = express.Router()
const { crearPublicacion, listarPublicaciones, obtenerPublicacion, actualizarPublicacion, eliminarPublicacion, actualizarDisponibilidad } = require('../controllers/listings.controller')
const { autenticar } = require('../middlewares/auth.middleware')

router.get('/', listarPublicaciones)
router.get('/:id', obtenerPublicacion)
router.post('/', autenticar, crearPublicacion)
router.patch('/:id', autenticar, actualizarPublicacion)
router.delete('/:id', autenticar, eliminarPublicacion)
router.patch('/:id/disponibilidad', autenticar, actualizarDisponibilidad)

module.exports = router