const { pool } = require('../config/database')

const crearUsuario = async(usuario) => {

  const { full_name, username, email, password_hash, celular, documento_identidad } = usuario;

  const resultado = await pool.query(
    `INSERT INTO users
     (full_name, username, email, password_hash, celular, documento_identidad)
    Values($1, $2, $3, $4, $5, $6)
    RETURNING id, full_name, username, email, celular, documento_identidad, created_at`,
    [full_name, username, email, password_hash, celular, documento_identidad]
  )
  return resultado.rows[0];

}


const buscarPorEmail = async (email) => {
  const resultado = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  )
  return resultado.rows[0];
}

const buscarPorUsername = async (username) => {
  const resultado = await pool.query(
    'SELECT * FROM users where username = $1',
    [username]
  )
  return resultado.rows[0];
}

module.exports = { crearUsuario, buscarPorEmail, buscarPorUsername}