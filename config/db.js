const mysql = require('mysql2');

const pool = mysql.createPool({
    // Prioridad 1: Variables nativas de Railway (ignoran el .env.local)
    // Prioridad 2: Tus variables DB_HOST etc.
    // Prioridad 3: Localhost para tu PC
    host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
    user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
    password: process.env.MYSQLPASSWORD || process.env.DB_PASS,
    database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'railway',
    port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool.promise();