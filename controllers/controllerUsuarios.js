const jwt = require('jsonwebtoken'); // FUNDAMENTAL para actualizar el Navbar
const db = require('../config/db');
const fs = require('fs');
const path = require('path');

const ListarUsuarios = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM usuarios ORDER BY nombre ASC');
        res.render('usuarios/lista', { usuarios: rows });
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
};

const guardarUsuario = async (req, res) => {
    const { nombre, email, password } = req.body;
    const avatar = req.file ? req.file.filename : 'default.png'; // Nombre del archivo subido

    try {
        await db.execute(
            'INSERT INTO usuarios (nombre, email, password, avatar_url) VALUES (?, ?, ?, ?)',
            [nombre, email, password, avatar]
        );
        res.redirect('/usuarios');
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al crear usuario");
    }
};





const actualizarUsuario = async (req, res) => {
    const { id } = req.params;
    const { nombre, email, password } = req.body;

    try {
        // 1. OBTENER EL AVATAR ACTUAL ANTES DE ACTUALIZAR
        // Esto sirve para saber qué archivo borrar del disco
        const [rows] = await db.execute('SELECT avatar_url FROM usuarios WHERE id = ?', [id]);
        const avatarViejo = rows[0]?.avatar_url;

        let sql = 'UPDATE usuarios SET nombre = ?, email = ?';
        let params = [nombre, email];

        if (password && password.trim() !== "") {
            sql += ', password = ?';
            params.push(password);
        }

        // 2. SI HAY UN ARCHIVO NUEVO
        if (req.file) {
            sql += ', avatar_url = ?';
            params.push(req.file.filename);

            // BORRAR EL ARCHIVO VIEJO DEL DISCO (si no es el default o una URL)
            if (avatarViejo && avatarViejo !== 'default.png' && !avatarViejo.startsWith('http')) {
                const rutaImagenVieja = path.join(__dirname, '../public/img/', avatarViejo);
                
                // Verificamos si el archivo existe antes de intentar borrarlo
                if (fs.existsSync(rutaImagenVieja)) {
                    fs.unlinkSync(rutaImagenVieja);
                    console.log("Archivo viejo eliminado:", avatarViejo);
                }
            }
        }

        sql += ' WHERE id = ?';
        params.push(id);

        await db.execute(sql, params);

        // 3. ACTUALIZAR EL TOKEN (Lo que ya tenemos funcionando)
        if (req.user && req.user.id == id) {
            const avatarParaToken = req.file ? req.file.filename : avatarViejo;
            const nuevoToken = jwt.sign(
                { id, nombre, email, avatar_url: avatarParaToken },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
            res.cookie('token', nuevoToken, { httpOnly: true });
        }

        res.redirect('/usuarios');

    } catch (error) {
        console.error("Error al actualizar y borrar:", error);
        res.status(500).send("Error al actualizar");
    }
};

const borrarUsuario = async (req, res) => {
    const { id } = req.params;

    try {
        // 1. Buscar el nombre de la imagen antes de borrar al usuario
        const [rows] = await db.execute('SELECT avatar_url FROM usuarios WHERE id = ?', [id]);
        const fotoABorrar = rows[0]?.avatar_url;

        // 2. Borrar de la base de datos
        await db.execute('DELETE FROM usuarios WHERE id = ?', [id]);

        // 3. Borrar del disco si existe
        if (fotoABorrar && fotoABorrar !== 'default.png' && !fotoABorrar.startsWith('http')) {
            const ruta = path.join(__dirname, '../public/img/', fotoABorrar);
            if (fs.existsSync(ruta)) {
                fs.unlinkSync(ruta);
            }
        }

        res.redirect('/usuarios');
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al borrar");
    }
};
module.exports = { ListarUsuarios, guardarUsuario, actualizarUsuario, borrarUsuario };