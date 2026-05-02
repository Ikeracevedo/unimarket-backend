const express = require('express')
const router = express.Router()
const { crearPublicacion } = require('../controllers/listings.controller')
const { autenticar } = require('../middlewares/auth.middleware')

router.post('/', autenticar, crearPublicacion)

module.exports = router