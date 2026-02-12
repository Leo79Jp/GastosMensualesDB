const db = require('../config/db');

const showReportes = async (req, res) => {
    try {
        const anioActual = new Date().getFullYear();

        // 1. Gastos mensuales de TODA la familia
        const [gastosMensuales] = await db.execute(`
            SELECT MONTH(fecha) as mes, SUM(monto) as total 
            FROM gastos 
            WHERE YEAR(fecha) = ?
            GROUP BY MONTH(fecha)`, [anioActual]);

        // 2. Gastos por categoría de TODA la familia (Mes actual)
        const [gastosPorCategoria] = await db.execute(`
            SELECT c.nombre, SUM(g.monto) as total 
            FROM gastos g
            JOIN categorias_gastos c ON g.categoria_id = c.id
            WHERE MONTH(g.fecha) = MONTH(CURRENT_DATE()) AND YEAR(g.fecha) = YEAR(CURRENT_DATE())
            GROUP BY c.id`);

        // 3. Ingresos mensuales de TODA la familia
        const [ingresosMensuales] = await db.execute(`
            SELECT MONTH(fecha) as mes, SUM(monto) as total 
            FROM ingresos 
            WHERE YEAR(fecha) = ?
            GROUP BY MONTH(fecha)`, [anioActual]);

        res.render('reportes/index', { gastosMensuales, ingresosMensuales, gastosPorCategoria, anioActual });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al generar reportes");
    }
};

const showHistorial = async (req, res) => {
    try {
        // 4. Historial combinado con nombres de usuarios
        const query = `
            SELECT i.id, i.monto, i.descripcion AS detalle, i.fecha, 'ingreso' AS tipo, u.nombre AS usuario
            FROM ingresos i
            JOIN usuarios u ON i.usuario_id = u.id
            
            UNION ALL
            
            SELECT g.id, g.monto, c.nombre AS detalle, g.fecha, 'gasto' AS tipo, u.nombre AS usuario
            FROM gastos g
            JOIN categorias_gastos c ON g.categoria_id = c.id
            JOIN usuarios u ON g.usuario_id = u.id
            
            ORDER BY fecha DESC LIMIT 100`;

        const [movimientos] = await db.execute(query);
        res.render('reportes/historial', { movimientos });
    } catch (error) {
        console.error("Error en el historial:", error);
        res.status(500).send("Error al cargar el historial");
    }
};

module.exports = { showReportes, showHistorial };