
const router = require('express').Router();
const protegerRuta = require('./../middleware/auth');
const { ListarCategorias, guardarCategoria, borrarCategoria, actualizarCategoria } = require('../controllers/controllerCategorias');

router.get('/', protegerRuta, ListarCategorias);
router.post('/guardar', protegerRuta, guardarCategoria);
router.post('/borrar/:id', protegerRuta, borrarCategoria);
router.post('/actualizar/:id', protegerRuta, actualizarCategoria);

module.exports = router;