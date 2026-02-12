const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const { ListarUsuarios, guardarUsuario, actualizarUsuario, borrarUsuario } = require('../controllers/controllerUsuarios');
const verificarToken = require('./../middleware/authMiddleware'); // El que corregimos antes

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/img/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get('/', verificarToken, ListarUsuarios);
router.post('/guardar', upload.single('avatar'), guardarUsuario, verificarToken);

// 2. AGREGA 'verificarToken' ANTES DE 'upload'
router.post('/actualizar/:id', verificarToken, upload.single('avatar'), actualizarUsuario);

router.post('/borrar/:id', borrarUsuario, verificarToken);

module.exports = router;