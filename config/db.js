const mysql = require('mysql2');

const pool = mysql.createPool({
    // Si Railway inyecta sus variables internas (MYSQLHOST), úsalas. 
    // Esto ignora cualquier cosa que diga el archivo .env.local
    host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
    user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
    password: process.env.MYSQLPASSWORD || process.env.DB_PASS,
    database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'railway',
    port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool.promise();