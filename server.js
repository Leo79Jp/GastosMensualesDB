// 1. CARGA DE CONFIGURACIÓN
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const db = require('./config/db'); 
const Usuario = require('./models/modelUser'); 

const app = express();
const port = process.env.PORT || 8080;

// 2. CONFIGURACIONES
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 3. MIDDLEWARES
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 4. MIDDLEWARE GLOBAL (Para el resumen y usuario)
app.use(async (req, res, next) => {
    res.locals.user = null;
    res.locals.resumen = { balance: 0, gastos: 0 };
    res.locals.usuariosActivos = 0;
    try {
        const token = req.cookies.token;
        const Ingreso = require('./models/modelIngreso'); 
        res.locals.usuariosActivos = await Usuario.getOnlineCount();

        if (token) {
            const secreto = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura_123';
            const decoded = jwt.verify(token, secreto);
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

// 5. IMPORTACIÓN DE RUTAS
const verificarToken = require('./middleware/authMiddleware');
const routeAuth = require('./routes/routesAuth');
const routeGastos = require('./routes/routesGastos');
const routeIngresos = require('./routes/routesIngresos');
const routeReportes = require('./routes/routesReportes');
const routeCategorias = require('./routes/routesCategorias');
const routeUsuarios = require('./routes/routesUsuarios');

// 6. USO DE RUTAS
app.use('/', routeAuth);
app.use('/gastos', verificarToken, routeGastos);
app.use('/ingresos', verificarToken, routeIngresos);
app.use('/reportes', verificarToken, routeReportes);
app.use('/categorias', verificarToken, routeCategorias);
app.use('/usuarios', verificarToken, routeUsuarios);

// Ruta raíz (si routeAuth no maneja el '/')
app.get('/', (req, res) => {
    res.render('index'); 
});

// 7. ARRANQUE
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});