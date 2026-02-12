const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];

    if (!token) {
        // Para rutas de API podrías dejar el 403, 
        // pero si es para navegación, mejor redirigir al login
        return res.redirect('/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = decoded; 
        
        // ESTA LÍNEA ES LA QUE TE FALTA PARA EL NAVBAR:
        res.locals.user = decoded; 

        next();
    } catch (error) {
        res.clearCookie('token');
        return res.redirect('/login');
    }
};

module.exports = verificarToken;