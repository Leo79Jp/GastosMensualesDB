const mysql = require('mysql2');

// Vamos a poner los datos que me pasaste directo aquí 
// para asegurar que NO use localhost bajo ninguna circunstancia
const pool = mysql.createPool({
    host: 'mysql.railway.internal', 
    user: 'root',
    password: 'gNvEfunyFzUblfeDyhjNQJJViiAjvrto',
    database: 'railway',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    connectTimeout: 20000 // Aumentamos a 20 seg por si acaso
});

module.exports = pool.promise();