const db = require('../config/db'); // Tu conexión a MySQL
const User = require('../models/modelUser');
const jwt = require('jsonwebtoken');

// Mostrar la página de login
const showLogin = (req, res) => {
    res.render('login'); 
};


const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findByEmail(email);

        if (!user) {
            return res.render('login', { error: 'El correo no está registrado' });
        }

        if (user.password !== password) {
            return res.render('login', { error: 'Contraseña incorrecta' });
        }

        await User.updateOnlineStatus(user.id, 1);

        // Creamos el token con los datos actuales de la DB
        const token = jwt.sign(
            { 
                id: user.id, 
                nombre: user.nombre, 
                email: user.email,
                avatar_url: user.avatar_url // <--- Usamos el nombre exacto de la DB
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.cookie('token', token, { httpOnly: true });
        return res.redirect('/');

    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).send("Error interno");
    }
};

const logout = async (req, res) => {
    try {
        // 1. Obtenemos el ID desde req.user (inyectado por el middleware global)
        const userId = req.user ? req.user.id : null;

        if (userId) {
            // 2. Usamos el MODELO para marcar como desconectado
            await User.updateOnlineStatus(userId, 0);
        }

        // 3. Limpiamos la cookie del JWT
        res.clearCookie('token');

        // 4. Redirigimos
        return res.redirect('/login');

    } catch (error) {
        console.error("Error en el proceso de logout:", error);
        res.clearCookie('token');
        res.redirect('/login');
    }
};
// En controllers/controllerAuth.js (o donde prefieras)
const getUsuariosConectados = async () => {
    try {
        const [rows] = await db.execute('SELECT COUNT(*) as total FROM usuarios WHERE esta_en_linea = 1');
        return rows[0].total;
    } catch (error) {
        console.error("Error al contar usuarios:", error);
        return 0;
    }
};

module.exports = { showLogin, login, logout };