const mysql = require('mysql2');

// Intentamos usar la URL que Railway SÍ te está entregando según tus logs
const rawUrl = process.env.RAILWAY_SERVICE_GASTOSMENSUALESDB_URL;
// Le agregamos el protocolo mysql:// porque a veces Railway lo manda pelado
const dbUri = rawUrl.startsWith('mysql://') ? rawUrl : `mysql://root:${process.env.MYSQLPASSWORD}@${rawUrl}:3306/railway`;

const pool = mysql.createPool({
    uri: dbUri,
    waitForConnections: true,
    connectionLimit: 10
});

console.log('--- INTENTO CON URL DE SERVICIO ---');
console.log('¿Tenemos Password para la URL?:', !!process.env.MYSQLPASSWORD);

module.exports = pool.promise();