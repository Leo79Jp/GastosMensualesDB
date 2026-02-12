const router = require('express').Router();
const protegerRuta = require('../middleware/auth');
const { showReportes, showHistorial } = require('../controllers/controllerReportes'); // <--- Apuntando al unificado

router.get('/', protegerRuta, showReportes);
router.get('/historial', protegerRuta, showHistorial);

module.exports = router;