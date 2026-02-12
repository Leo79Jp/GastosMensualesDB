const Ingreso = require('../models/modelIngreso');

const showIngresoForm = (req, res) => {
    res.render('ingresos/nuevo'); // Creamos una vista simple
};

const guardarIngreso = async (req, res) => {
    try {
        const { monto, descripcion, fecha } = req.body;
        const userId = req.user.id; // Registramos quién aporta el dinero

        // Usamos el método create de tu modelo
        await Ingreso.create(userId, monto, descripcion, fecha);
        
        res.redirect('/'); 
    } catch (error) {
        console.error("Error al guardar ingreso:", error);
        res.status(500).send("Error al procesar el ingreso");
    }
};

const borrarIngreso = async (req, res) => {
    try {
        const { id } = req.params;
        // CAMBIO: Quitamos "AND usuario_id = ?" para que sea un historial familiar compartido
        await db.execute('DELETE FROM ingresos WHERE id = ?', [id]);
        
        res.redirect('/reportes/historial');
    } catch (error) {
        console.error("Error al borrar el ingreso:", error);
        res.status(500).send("Error al borrar el ingreso");
    }
};
module.exports = { showIngresoForm, guardarIngreso, borrarIngreso };