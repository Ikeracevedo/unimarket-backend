const { pool } = require('../config/database')

const crearPublicacion = async (publicacion) => {
        const { seller_id, category, title, description, price, image_url, extra_data} = publicacion

        const resultado = await pool.query(
            `INSERT INTO listings
            (seller_id, category, title, description, price, image_url, extra_data)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [seller_id, category, title, description, price, image_url, JSON.stringify(extra_data)]
        )

        return resultado.rows[0]

}

const obtenerPublicaciones = async ({ category, seller_id, fecha_desde, page, limit }) => {
    const offset = (page - 1) * limit
    const condiciones = []
    const valores = []
    let contador = 1

    if (category) {
        condiciones.push(`category = $${contador} `)
        valores.push(category)
        contador++
    }

    if (seller_id) {
        condiciones.push(`seller_id = $${contador}`)
        valores.push(seller_id)
        contador++
    }

    if (fecha_desde) {
        condiciones.push(`created_at >= $${contador}`)
        valores.push(fecha_desde)
        contador++
    }

    const where = condiciones.length > 0 ? `WHERE ${condiciones.join(' AND ')}` : ''

    const resultado = await pool.query(
        `SELECT * FROM listings ${where} 
         ORDER BY created_at DESC 
         LIMIT $${contador} OFFSET $${contador + 1}`,
        [...valores, limit, offset]
    )

    return resultado.rows

}

const obtenerPublicacionPorId = async (id) => {
    const resultado = await pool.query(
      'SELECT * FROM listings WHERE id = $1',
      [id]
    )
    return resultado.rows[0]
  }
  
  const actualizarPublicacion = async (id, datos) => {
    const { title, description, price, image_url, extra_data, is_available } = datos
  
    const resultado = await pool.query(
      `UPDATE listings 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           price = COALESCE($3, price),
           image_url = COALESCE($4, image_url),
           extra_data = COALESCE($5, extra_data),
           is_available = COALESCE($6, is_available)
       WHERE id = $7
       RETURNING *`,
      [title, description, price, image_url, 
       extra_data ? JSON.stringify(extra_data) : null, 
       is_available, id]
    )
  
    return resultado.rows[0]
  }
  
  const eliminarPublicacion = async (id) => {
    const resultado = await pool.query(
      'DELETE FROM listings WHERE id = $1 RETURNING id',
      [id]
    )
    return resultado.rows[0]
  }


module.exports = { 
  crearPublicacion, 
  obtenerPublicaciones, 
  obtenerPublicacionPorId,
  actualizarPublicacion,
  eliminarPublicacion
}