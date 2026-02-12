const router = require('express').Router();
const protegerRuta = require('./../middleware/auth');
const { showGastosForm, guardarGasto,borrarGasto } = require('../controllers/controllerGastos');

router.get('/nuevo', protegerRuta, showGastosForm);
router.post('/guardar', protegerRuta, guardarGasto); // <--- Esta es la que recibe el formulario
router.post('/borrar/:id', protegerRuta, borrarGasto);

module.exports = router;