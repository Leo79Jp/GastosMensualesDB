const db = require('../config/db');

const Gasto = {
    // Obtener gastos de un mes específico para un usuario
    getMes: async (userId, mes, anio) => {
        const query = `
            SELECT * FROM gastos 
            WHERE usuario_id = ? 
            AND MONTH(fecha) = ? 
            AND YEAR(fecha) = ?`;
        const [rows] = await db.execute(query, [userId, mes, anio]);
        return rows;
    },

    // Obtener el balance (Ingresos - Gastos)
    getBalance: async (userId, mes, anio) => {
        const [ingresos] = await db.execute(
            'SELECT SUM(monto) as total FROM ingresos WHERE usuario_id = ? AND MONTH(fecha) = ? AND YEAR(fecha) = ?',
            [userId, mes, anio]
        );
        const [gastos] = await db.execute(
            'SELECT SUM(monto) as total FROM gastos WHERE usuario_id = ? AND MONTH(fecha) = ? AND YEAR(fecha) = ?',
            [userId, mes, anio]
        );

        const totalIngresos = ingresos[0].total || 0;
        const totalGastos = gastos[0].total || 0;

        return {
            ingresos: totalIngresos,
            gastos: totalGastos,
            balance: totalIngresos - totalGastos
        };
    }
};

module.exports = Gasto;