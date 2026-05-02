const { registrar, login } = require('../services/auth.service')

const registrarUsuario = async (req, res) => {
  try {
    const usuario = await registrar(req.body)
    res.status(201).json({
      ok: true,
      mensaje: 'Usuario registrado exitosamente',
      datos: usuario
    })
  } catch (error) {
    res.status(400).json({
      ok: false,
      mensaje: error.message,
      datos: null
    })
  }
}

const loginUsuario = async (req, res) => {
  try {
    const { identificador, password } = req.body
    const resultado = await login(identificador, password)
    res.status(200).json({
      ok: true,
      mensaje: 'Login exitoso',
      datos: resultado
    })
  } catch (error) {
    res.status(401).json({
      ok: false,
      mensaje: error.message,
      datos: null
    })
  }
}

module.exports = { registrarUsuario, loginUsuario }