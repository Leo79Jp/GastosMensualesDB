const mysql = require('mysql2');

// Usamos las variables del panel. Si no existen, fallará con un error claro.
const pool = mysql.createPool({
    host: process.env.MYSQLHOST || process.env.RAILWAY_SERVICE_GASTOSMENSUALESDB_URL,
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE || 'railway',
    port: process.env.MYSQLPORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log('--- CONEXIÓN DB DETECTADA ---');
console.log('Host detectado:', process.env.MYSQLHOST ? 'SÍ ✅' : 'NO (Usando URL de servicio) 🔍');
console.log('Password detectada:', process.env.MYSQLPASSWORD ? 'SÍ ✅' : 'NO ❌');

module.exports = pool.promise();