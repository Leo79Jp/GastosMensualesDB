const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: parseInt(process.env.MYSQLPORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10
});

// Esto nos dirá en el log qué valores está intentando usar (SIN la contraseña)
console.log('Intentando conectar a DB en:', process.env.MYSQLHOST, 'Puerto:', process.env.MYSQLPORT);

module.exports = pool.promise();