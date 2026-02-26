const mysql = require('mysql2');

const pool = mysql.createPool({
    // Aquí NO ponemos valores de respaldo. 
    // Si la variable no está en Railway, el servidor fallará (que es lo correcto por seguridad).
    host: process.env.MYSQLHOST, 
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT || 3306, // El puerto suele ser estándar
    waitForConnections: true,
    connectionLimit: 10,
    connectTimeout: 20000 
});

module.exports = pool.promise();