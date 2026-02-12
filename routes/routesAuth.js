const router = require('express').Router();
const protegerRuta = require('./../middleware/auth');
const { 
    showLogin, 
    login,
    logout
} = require('../controllers/controllerAuth');

// RUTAS PÚBLICAS (Sin protegerRuta)
// Necesitas que cualquier persona pueda ver el formulario y enviar sus datos
router.get('/login', showLogin);
router.post('/login', login);

// RUTAS PROTEGIDAS
// Solo alguien que ya inició sesión puede cerrar sesión o ver contenido privado
router.get('/logout', protegerRuta, logout);

// Ejemplo de una futura ruta protegida
// router.get('/dashboard', protegerRuta, showDashboard);

module.exports = router;