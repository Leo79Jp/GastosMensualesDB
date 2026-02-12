const db = require('../config/db');

const Categoria = {
    // Obtener todas las categorías de un usuario
    getByUser: async (userId) => {
        const [rows] = await db.execute(
            'SELECT * FROM categorias_gastos WHERE usuario_id = ? ORDER BY nombre ASC',
            [userId]
        );
        return rows;
    },

    // Crear una nueva categoría personalizada
    create: async (userId, nombre, esFijo) => {
        return await db.execute(
            'INSERT INTO categorias_gastos (usuario_id, nombre, es_fijo) VALUES (?, ?, ?)',
            [userId, nombre, esFijo]
        );
    }
};

module.exports = Categoria;