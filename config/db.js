const mysql = require('mysql2');

// Ponemos los datos directamente para saltarnos el fallo del panel
const pool = mysql.createPool({
    host: 'gastosmensualesdb-production.up.railway.app',
    user: 'root',
    password: 'gNvEfunyFzUblfeDyhjNQJJViiAjvrto', 
    database: 'railway',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10
});

console.log('--- INTENTO DE EMERGENCIA ---');
console.log('Conectando directamente con datos fijos...');

module.exports = pool.promise();