const mysql = require('mysql2');

const pool = mysql.createPool({
    // Usamos las variables exactas que me acabas de pasar
    host: process.env.MYSQLHOST || 'localhost',
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD || '',
    database: process.env.MYSQLDATABASE || 'railway',
    port: process.env.MYSQLPORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    connectTimeout: 10000
});

module.exports = pool.promise();