const db = require('../config/db');

const Usuario = {
    // 1. Buscar por email
    findByEmail: async (email) => {
        const query = 'SELECT * FROM usuarios WHERE email = ?';
        const [rows] = await db.execute(query, [email]);
        return rows[0];
    },

    // 2. LA FUNCIÓN QUE TE ESTÁ DANDO ERROR:
    updateOnlineStatus: async (id, status) => {
        const query = 'UPDATE usuarios SET esta_en_linea = ? WHERE id = ?';
        return await db.execute(query, [status, id]);
    },

    // 3. Obtener total activos
    getOnlineCount: async () => {
        const query = 'SELECT COUNT(*) as total FROM usuarios WHERE esta_en_linea = 1';
        const [rows] = await db.execute(query);
        return rows[0].total || 0;
    }
};

// ¡MUY IMPORTANTE!: Exportar el objeto
module.exports = Usuario;