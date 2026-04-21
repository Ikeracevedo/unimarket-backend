const { Pool } = require('pg')
require('dotenv').config()

// Conectar a la base de datos utilizando las variables de entorno
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: {
        rejectUnauthorized: false               // Render.com requiere SSL, pero no verifica el certificado
    }
})

// Funcion para arrancar la conexión a la base de datos al inciar el servidor
const conectarDB = async () => {
    try {
        const client = await pool.connect()
        client.release()
        console.log('Conexión a la base de datos establecida')    
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error.message)
        process.exit(1)
    }
}

module.exports = { pool, conectarDB }