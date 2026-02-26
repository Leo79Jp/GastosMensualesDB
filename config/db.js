const mysql = require('mysql2');

// Intentamos primero la variable que Railway SÍ está inyectando según tus logs
// Si no, probamos con la estándar por si acaso
const dbUri = process.env.RAILWAY_SERVICE_GASTOSMENSUALESDB_URL || process.env.DATABASE_URL;

const pool = mysql.createPool({
    uri: dbUri, 
    waitForConnections: true,
    connectionLimit: 10,
    connectTimeout: 20000 
});

console.log('--- INTENTO DE CONEXIÓN DB ---');
if (dbUri) {
    console.log('✅ Usando URL encontrada en el sistema.');
} else {
    console.error('❌ ERROR: No se encontró ninguna URL de base de datos en process.env');
}

module.exports = pool.promise();