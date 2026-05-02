const bcrypt = require('bcryptjs')
const { crearUsuario, buscarPorEmail, buscarPorUsername } = require('../repositories/auth.repository')
const { generarToken } = require('../utils/jwt.util')

const registrar = async (datos) => {
    const { full_name, username, email, password, celular, documento_identidad } = datos

    // Validar el dominio del email
    if (!email.endsWith('@upb.edu.co')) {
        throw new Error('Solo se permiten correos electrónicos con dominio @upb.edu.co')
    }

    // Verficar que el dominio no exista
    const emailExistente = await buscarPorEmail(email)
    if (emailExistente) {
        throw new Error('El correo electrónico ya está registrado')
    }

    // Verificar que el usuario no exista
    const usuarioExistente = await buscarPorUsername(username)
    if (usuarioExistente) {
        throw new Error('El nombre de usuario ya está registrado')
    }

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10)
    const password_hash = await bcrypt.hash(password, salt)

    // Crear usuario en la base de datos
    const nuevoUsuario = await crearUsuario({
        full_name,
        username,
        email,
        password_hash,
        celular,
        documento_identidad
    })

    return nuevoUsuario   
}

const login = async (identificador, password) => {

    // Buscar por email o por nombre de usuario
    const esEmail = identificador.includes('@')
    const usuario = esEmail ? await buscarPorEmail(identificador) : await buscarPorUsername(identificador)

    if (!usuario) {
        throw new Error('Usuario o contraseña incorrectos')
    }

    // Verificar contraseña
    const contasenaValida = await bcrypt.compare(password, usuario.password_hash)
    if (!contasenaValida) {
        throw new Error('Credenciales inválidas')
    }

    // Generar token JWT
    const token = generarToken({ id: usuario.id, email: usuario.email })

    return {
        token,
        usuario: {
          id: usuario.id,
          full_name: usuario.full_name,
          username: usuario.username,
          email: usuario.email
        }
    }
}

module.exports = { registrar, login }