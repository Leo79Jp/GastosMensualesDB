const mysql = require('mysql2');

// Armamos la conexión manualmente con los datos del panel
const pool = mysql.createPool({
    host: process.env.MYSQLHOST || 'gastosmensualesdb-production.up.railway.app',
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE || 'railway',
    port: process.env.MYSQLPORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log('--- INTENTO DE CONEXIÓN DB ---');
console.log('Host:', process.env.MYSQLHOST || 'Usando fallback');
console.log('Usuario:', process.env.MYSQLUSER || 'Usando fallback');

module.exports = pool.promise();