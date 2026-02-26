const mysql = require('mysql2');

// Railway inyecta DATABASE_URL automáticamente si está vinculada
const pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Cambiamos el log para que sea más informativo
if (process.env.DATABASE_URL) {
    console.log('✅ DATABASE_URL detectada. Intentando conexión...');
} else {
    console.error('❌ ERROR: DATABASE_URL no encontrada en las variables de entorno.');
}

module.exports = pool.promise();