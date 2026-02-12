const mysql = require('mysql2');
// Si en producción usas Postgres, necesitarías instalar 'pg' y adaptar aquí.
// Pero si usas un servicio que soporta MySQL en ambos, quédate con mysql2.

let pool;

if (process.env.DATABASE_URL) {
    // CONFIGURACIÓN PARA PRODUCCIÓN (Postgres o MySQL remoto)
    // Aquí es donde conectarías a tu DB de producción
    // pool = ...
} else {
    // CONFIGURACIÓN LOCAL (Tu código actual)
    pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10
    });
}

module.exports = pool.promise();