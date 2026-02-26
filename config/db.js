const mysql = require('mysql2');
// Ya no necesitamos configurar dotenv aquí si lo cargamos en server.js, 
// pero no estorba.

const pool = mysql.createPool({
    // Si Railway inyecta sus variables nativas, las usamos. 
    // Si no, usamos las que tú definiste (DB_HOST).
    // Si no hay ninguna, cae en localhost (tu PC).
    host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
    user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
    password: process.env.MYSQLPASSWORD || process.env.DB_PASS,
    database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'railway',
    port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool.promise();