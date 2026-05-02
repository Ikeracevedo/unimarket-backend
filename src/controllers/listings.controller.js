const { publicar } = require('../services/listings.service')

const crearPublicacion = async (req, res) => {
    try {
        const publicacion = await publicar(req.body, req.usuario.id)
        res.status(201).json({
            ok: true,
            mensaje: 'Publicacion creada exitosamente.',
            datos: publicacion
        })
    } catch (error) {
        res.status(400).json({
            ok: false,
            mensaje: error.mensaje,
            datos: null
        })
    }
}

module.exports = { crearPublicacion }