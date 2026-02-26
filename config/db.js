const mysql = require('mysql2');
require('dotenv').config(); // Asegúrate de que esté aquí si no lo pusiste en index.js

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306, // Usa el puerto del .env o 3306 por defecto
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool.promise();