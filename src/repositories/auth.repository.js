const { pool } = require('../config/database')

const crearUsuario = async(usuario) => {
    const { nombre_completo, nombre_usuario, email, contrasena_hash, celular, documento_identidad } = usuario

    const resultado = await pool.query(
        `INSERT INTO usuarios 
        (nombre_completo, nombre_usuario, email, contrasena_hash, celular, documento_identidad) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING id, nombre_completo, nombre_usuario, email, celular, documento_identidad, creado_en`,
        [nombre_completo, nombre_usuario, email, contrasena_hash, celular, documento_identidad]
    )
    return resultado.rows[0]
}

const buscarPorEmail = async (email) => {
    const resultado = await pool.query(
        'SELECT * FROM usuarios where email = $1',
        [email]
    )
    return resultado.rows[0]
}

const buscarPorUsuario = async(nombre_usuario) => {
    const resultado = await pool.query(
        'SELECT * FROM usuarios WHERE nombre_usuario = $1',
        [nombre_usuario]
    )
    return resultado.rows[0]
}

module.exports = {
    crearUsuario,
    buscarPorEmail,
    buscarPorUsuario
}