const jwt = require('jsonwebtoken');

const protegerRuta = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        // Si no hay token, lo mandamos al login
        return res.redirect('/login');
    }

    try {
        // Verificamos si el token es real y no ha expirado
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 1. Lo guardamos en req para usarlo en los controladores
        req.user = decoded; 
        
        // 2. IMPORTANTE: Lo guardamos en res.locals para que esté disponible en las vistas (Navbar)
        res.locals.user = decoded; 
        
        next(); // ¡Adelante, puedes pasar!
    } catch (error) {
        // Si el token es falso o expiró, limpiamos la cookie y al login
        res.clearCookie('token');
        return res.redirect('/login');
    }
};

module.exports = protegerRuta;