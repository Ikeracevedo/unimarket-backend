const { publicar, listar, obtenerUna, actualizar, eliminar } = require('../services/listings.service')

const crearPublicacion = async (req, res) => {
  try {
    const publicacion = await publicar(req.body, req.usuario.id)
    res.status(201).json({ ok: true, mensaje: 'Publicación creada exitosamente', datos: publicacion })
  } catch (error) {
    res.status(400).json({ ok: false, mensaje: error.message, datos: null })
  }
}

const listarPublicaciones = async (req, res) => {
  try {
    const publicaciones = await listar(req.query)
    res.status(200).json({ ok: true, mensaje: 'Publicaciones obtenidas', datos: publicaciones })
  } catch (error) {
    res.status(400).json({ ok: false, mensaje: error.message, datos: null })
  }
}

const obtenerPublicacion = async (req, res) => {
  try {
    const publicacion = await obtenerUna(req.params.id)
    res.status(200).json({ ok: true, mensaje: 'Publicación obtenida', datos: publicacion })
  } catch (error) {
    res.status(404).json({ ok: false, mensaje: error.message, datos: null })
  }
}

const actualizarPublicacion = async (req, res) => {
  try {
    const publicacion = await actualizar(req.params.id, req.body, req.usuario.id)
    res.status(200).json({ ok: true, mensaje: 'Publicación actualizada', datos: publicacion })
  } catch (error) {
    const status = error.message === 'Publicación no encontrada' ? 404 : 400
    res.status(status).json({ ok: false, mensaje: error.message, datos: null })
  }
}

const eliminarPublicacion = async (req, res) => {
  try {
    await eliminar(req.params.id, req.usuario.id)
    res.status(200).json({ ok: true, mensaje: 'Publicación eliminada', datos: null })
  } catch (error) {
    const status = error.message === 'Publicación no encontrada' ? 404 : 400
    res.status(status).json({ ok: false, mensaje: error.message, datos: null })
  }
}

module.exports = { crearPublicacion, listarPublicaciones, obtenerPublicacion, actualizarPublicacion, eliminarPublicacion }