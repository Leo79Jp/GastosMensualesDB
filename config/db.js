const mysql = require('mysql2');

const pool = mysql.createPool({
    // PRUEBA ESTO: Usa solo el nombre del servicio si están en el mismo proyecto
    // O usa la variable que Railway genera automáticamente
    host: process.env.MYSQLHOST || 'mysql.railway.internal', 
    user: 'root',
    password: 'gNvEfunyFzUblfeDyhjNQJJViiAjvrto', // La que ya pusiste
    database: 'railway',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    connectTimeout: 20000 // Aumentamos a 20 segundos por si la DB está lenta
});

console.log('--- INTENTO DE CONEXIÓN INTERNA ---');
console.log('Host:', process.env.MYSQLHOST || 'mysql.railway.internal');

module.exports = pool.promise();