// 1. Cargar variables de entorno (Prioriza el panel de Railway)
require('dotenv').config(); 

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const db = require('./config/db'); 
const Usuario = require('./models/modelUser'); 

const app = express();
const port = process.env.PORT || 3000;

// CONFIGURACIONES
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MIDDLEWARES DE BASE
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// MIDDLEWARE GLOBAL (JWT + Resumen de Gastos + Usuarios Activos)
app.use(async (req, res, next) => {
    res.locals.user = null;
    res.locals.resumen = { balance: 0, gastos: 0 };
    res.locals.usuariosActivos = 0;

    try {
        const token = req.cookies.token;
        const Ingreso = require('./models/modelIngreso'); 

        // Conteo de usuarios (siempre se intenta)
        res.locals.usuariosActivos = await Usuario.getOnlineCount();

        if (token) {
            // Verificamos el token usando la variable del panel
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            res.locals.user = decoded;
            
            const mesActual = new Date().getMonth() + 1;
            const anioActual = new Date().getFullYear();
            
            const totalIngresos = await Ingreso.getTotalGlobalMes(mesActual, anioActual);
            const [gastosRows] = await db.execute(
                'SELECT SUM(monto) as total FROM gastos WHERE MONTH(fecha) = ? AND YEAR(fecha) = ?',
                [mesActual, anioActual]
            );

            const totalGastos = gastosRows[0].total || 0;
            res.locals.resumen = {
                gastos: totalGastos,
                balance: totalIngresos - totalGastos
            };
        }
        
        next();
    } catch (error) {
        console.error("Error en middleware global:", error.message);
        next();
    }
});

// RUTAS
const verificarToken = require('./middleware/authMiddleware');
const routeAuth = require('./routes/routesAuth');
const routeGastos = require('./routes/routesGastos');
const routeIngresos = require('./routes/routesIngresos');
const routeReportes = require('./routes/routesReportes');
const routeCategorias = require('./routes/routesCategorias');
const routeUsuarios = require('./routes/routesUsuarios');

app.use('/', routeAuth);
app.use('/gastos', verificarToken, routeGastos);
app.use('/ingresos', verificarToken, routeIngresos);
app.use('/reportes', verificarToken, routeReportes);
app.use('/categorias', verificarToken, routeCategorias);
app.use('/usuarios', verificarToken, routeUsuarios);

app.get('/', (req, res) => {
    res.render('index'); 
});

// Escuchar en 0.0.0.0 para Railway
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});