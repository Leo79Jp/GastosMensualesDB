const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'shuttle.proxy.rlwy.net', 
    user: 'root',
    password: 'gNvEfunyFzUblfeDyhjNQJJViiAjvrto',
    database: 'railway',
    port: 25127, // <--- El puerto mágico que encontramos
    waitForConnections: true,
    connectionLimit: 10,
    connectTimeout: 20000 
});

module.exports = pool.promise();