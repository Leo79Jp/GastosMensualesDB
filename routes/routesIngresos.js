const router = require('express').Router();
const protegerRuta = require('../middleware/auth');
const { showIngresoForm, guardarIngreso,borrarIngreso } = require('../controllers/controllerIngresos');

router.get('/nuevo', protegerRuta, showIngresoForm);
router.post('/guardar', protegerRuta, guardarIngreso);
router.post('/borrar/:id', protegerRuta, borrarIngreso);

module.exports = router;