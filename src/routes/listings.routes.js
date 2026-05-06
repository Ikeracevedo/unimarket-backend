const express = require('express')
const router = express.Router()
const { crearPublicacion, listarPublicaciones, obtenerPublicacion, actualizarPublicacion, eliminarPublicacion } = require('../controllers/listings.controller')
const { autenticar } = require('../middlewares/auth.middleware')

router.get('/', listarPublicaciones)
router.get('/:id', obtenerPublicacion)
router.post('/', autenticar, crearPublicacion)
router.patch('/:id', autenticar, actualizarPublicacion)
router.delete('/:id', autenticar, eliminarPublicacion)

module.exports = router