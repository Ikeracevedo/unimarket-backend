const { pool } = require('../config/database')

const crearPublicaciones = async (publicacion) => {
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

module.exports = { crearPublicaciones }
