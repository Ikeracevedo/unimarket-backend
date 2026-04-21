const bycrypt = require('bcryptjs')
const { crearUsuario, buscarPorEmail, buscarPorUsuario } = require('../repositories/auth.repository')
const { generarToken } = require('../utils/jwt.utils')

const registrar = async (datos) => {
    const { nombre_completo, nombre_usuario, email, contrasena, celular, documento_identidad } = datos

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
    const usuarioExistente = await buscarPorUsuario(nombre_usuario)
    if (usuarioExistente) {
        throw new Error('El nombre de usuario ya está registrado')
    }

    // Hashear contraseña
    const salt = await bycrypt.genSalt(10)
    const contrasena_hash = await bycrypt.hash(contrasena, salt)

    // Crear usuario en la base de datos
    const nuevoUsuario = await crearUsuario({
        nombre_completo,
        nombre_usuario,
        email,
        contrasena_hash,
        celular,
        documento_identidad
    })

    return nuevoUsuario   
}

const login = async (identificador, contrasena) => {

    // Buscar por email o por nombre de usuario
    const esEmail = identificador.includes('@')
    const usuario = esEmail ? await buscarPorEmail(identificador) : await buscarPorUsuario(identificador)

    if (!usuario) {
        throw new Error('Usuario o contraseña incorrectos')
    }

    // Verificar contraseña
    const contasenaValida = await bycrypt.compare(contrasena, usuario.contrasena_hash)
    if (!contasenaValida) {
        throw new Error('Credenciales inválidas')
    }

    // Generar token JWT
    const token = generarToken({ id: usuario.id, email: usuario.email })

    return {
        token,
        usuario: {
        id: usuario.id,
        nombre_completo: usuario.nombre_completo,
        nombre_usuario: usuario.nombre_usuario,
        email: usuario.email
        }
    }
}

module.exports = { registrar, login }