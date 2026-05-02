const { verificarToken } = require('../utils/jwt.util')

const autenticar = async (req, res, next) => {
    try {
        
        const authHeader = req.headers['authorization']

        // Validacion de token
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                ok: false,
                mensaje: 'No se proporcionó un token de autenticación',
                datos: null
            })
        }

        const token = authHeader.split(' ')[1]
        const payload = verificarToken(token)
        req.usuario = payload
        next()    
    
    } catch (error) {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token invalido o ya expiró',
            datos: null
        })
    }
}

module.exports = { autenticar }