// 1. CARGA DE CONFIGURACIÓN (Solo en local)
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// 2. INSPECCIÓN DE SEGURIDAD (Para ver en los logs de Railway)
console.log("--- CHEQUEO DE ENTORNO ---");
console.log("DATABASE_URL detectada:", process.env.DATABASE_URL ? "SÍ ✅" : "NO ❌");
console.log("JWT_SECRET detectado:", process.env.JWT_SECRET ? "SÍ ✅" : "NO ❌");
console.log("Variables detectadas:", Object.keys(process.env).filter(key => key.includes('MYSQL') || key.includes('JWT')));

// 3. IMPORTS DE MÓDULOS
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const db = require('./config/db'); 
const Usuario = require('./models/modelUser'); 

const app = express();
const port = process.env.PORT || 8080; // Railway suele usar el 8080 por defecto

// --- EL RESTO DE TU CÓDIGO (CONFIGURACIONES, MIDDLEWARES, RUTAS) SIGUE IGUAL ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ... (Aquí pegas el resto de tus middlewares y rutas que ya tenías)

app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});