const db = require('../config/db');

const Ingreso = {
    // Guardar un nuevo ingreso (Sigue igual)
    create: async (userId, monto, descripcion, fecha) => {
        const query = 'INSERT INTO ingresos (usuario_id, monto, descripcion, fecha) VALUES (?, ?, ?, ?)';
        return await db.execute(query, [userId, monto, descripcion, fecha]);
    },

    // Obtener total de ingresos del mes para un usuario específico (Individual)
    getTotalMes: async (userId, mes, anio) => {
        const query = `
            SELECT SUM(monto) as total 
            FROM ingresos 
            WHERE usuario_id = ? AND MONTH(fecha) = ? AND YEAR(fecha) = ?`;
        const [rows] = await db.execute(query, [userId, mes, anio]);
        return rows[0].total || 0;
    },

    // --- NUEVA FUNCIÓN: Obtener total de ingresos de TODA la familia ---
    getTotalGlobalMes: async (mes, anio) => {
        const query = `
            SELECT SUM(monto) as total 
            FROM ingresos 
            WHERE MONTH(fecha) = ? AND YEAR(fecha) = ?`;
        const [rows] = await db.execute(query, [mes, anio]);
        return rows[0].total || 0;
    }
};

module.exports = Ingreso;