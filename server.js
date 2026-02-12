// 1. Cargar variables de entorno (SIEMPRE PRIMERO)
require('dotenv').config({ path: '.env.local' }); 

const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken'); // <--- ¡IMPORTANTE: Faltaba esta línea!
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
app.use(cookieParser()); // <--- cookieParser debe ir antes del middleware global

// OPCIONAL: Ya no necesitas express-session si usas JWT al 100%, 
// pero si la dejas, que sea antes de las rutas.

// MIDDLEWARE GLOBAL (JWT + Usuarios Activos)
// app.use(async (req, res, next) => {
//     try {
//         const token = req.cookies.token;
//         let user = null;
//         let resumen = { balance: 0, gastos: 0 };
//         const Ingreso = require('./models/modelIngreso'); 

//         if (token) {
//             user = jwt.verify(token, process.env.JWT_SECRET);
            
//             const mesActual = new Date().getMonth() + 1;
//             const anioActual = new Date().getFullYear();

//             // 1. Primero ejecutamos las consultas (Ojo al orden)
//             const totalIngresos = await Ingreso.getTotalMes(user.id, mesActual, anioActual);
            
//             const [gastosRows] = await db.execute(
//                 'SELECT SUM(monto) as total FROM gastos WHERE usuario_id = ? AND MONTH(fecha) = ? AND YEAR(fecha) = ?',
//                 [user.id, mesActual, anioActual]
//             );

//             // 2. Ahora sí, asignamos los valores una sola vez
//             const totalGastos = gastosRows[0].total || 0;
            
//             resumen.gastos = totalGastos;
//             resumen.balance = totalIngresos - totalGastos;
//         }

//         res.locals.user = user;
//         res.locals.resumen = resumen;
//         // Solo intentamos contar activos si el modelo Usuario está importado
//         res.locals.usuariosActivos = (typeof Usuario !== 'undefined') ? await Usuario.getOnlineCount() : 0;
        
//         next();
//     } catch (error) {
//         // Si el token expira o falla, limpiamos todo
//         res.locals.user = null;
//         res.locals.resumen = { balance: 0, gastos: 0 };
//         next();
//     }
// });

app.use(async (req, res, next) => {
    // 1. Definimos valores por defecto SIEMPRE
    res.locals.user = null;
    res.locals.resumen = { balance: 0, gastos: 0 };
    res.locals.usuariosActivos = 0; // <--- Aquí evitamos el "is not defined"

    try {
        const token = req.cookies.token;
        const Ingreso = require('./models/modelIngreso'); 

        // 2. Intentamos el conteo global (Independiente de si hay token o no)
        // Usamos el modelo que me acabas de pasar
        res.locals.usuariosActivos = await Usuario.getOnlineCount();

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            res.locals.user = decoded;
            
            // ... resto de tu lógica de resumen (balance y gastos) ...
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
        // No hace falta limpiar res.locals aquí porque ya tienen valores por defecto arriba
        next();
    }
});

const verificarToken = require('./middleware/authMiddleware'); // El que corregimos antes
// RUTAS
const routeAuth = require('./routes/routesAuth');
const routeGastos = require('./routes/routesGastos');
const routeIngresos = require('./routes/routesIngresos');
const routeReportes = require('./routes/routesReportes');
const routeCategorias = require('./routes/routesCategorias');
const routeUsuarios = require('./routes/routesUsuarios');
app.use('/', routeAuth);
app.use('/gastos', verificarToken, routeGastos );
app.use('/ingresos', verificarToken, routeIngresos);
app.use('/reportes', verificarToken, routeReportes);
app.use('/categorias', verificarToken, routeCategorias);
app.use('/usuarios', verificarToken, routeUsuarios);

app.get('/', (req, res) => {
    res.render('index'); 
});

app.listen(port, () => {
    console.log(`Servidor en http://localhost:${port}`);
});