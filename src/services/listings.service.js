const { crearPublicaciones } = require('../repositories/listings.repository')

const CATEGORIAS_VALIDAS = ['compraventa','servicios','alimentos']

const publicar = async (datos, seller_id) => {
    const { category, title, description, price, image_url, extra_data } = datos

    // Validar categoria
    if (!CATEGORIAS_VALIDAS.includes(category)) {
        throw new Error(`Categoria invalida. Debe ser: ${CATEGORIAS_VALIDAS.join(', ')}`)
    }

    // Validar campos obligatorios
    if (!title || !description || !price) {
        throw new Error('Título, descripción y precio son obligatorios')
    }

    // Validar extra_data según categoría
    if (category === 'alimentos') {
        if (!extra_data?.horario_inicio || !extra_data?.horario_fin) {
        throw new Error('Las publicaciones de alimentos requieren horario_inicio y horario_fin')
        }
    }

    if (category === 'servicios') {
        if (!extra_data?.modalidad) {
            throw new Error('Las publicaciones de servicios requieren modalidad')
        }
    }

    if (category === 'compraventa') {
        if (!extra_data?.condicion) {
            throw new Error('Las publicaciones de compraventa requieren condicion (nuevo/usado)')
        }
    }

    const nuevaPublicacion = await crearPublicaciones({
        seller_id,
        category,
        title,
        description,
        price,
        image_url: image_url || null,
        extra_data: extra_data || {}
    })

    return nuevaPublicacion

}

module.exports = { publicar }