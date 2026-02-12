const Categoria = require('../models/modelCategoria');
const db = require('../config/db');

const showGastosForm = async (req, res) => {
    try {
        // CAMBIO: Ya no usamos getByUser(req.user.id). 
        // Llamamos a un método que traiga TODAS las categorías de la familia.
        const [categorias] = await db.execute('SELECT * FROM categorias_gastos ORDER BY nombre ASC');
        
        res.render('gastos/nuevo', { categorias });
    } catch (error) {
        console.error("Error al cargar categorías:", error);
        res.redirect('/');
    }
};

const guardarGasto = async (req, res) => {
    try {
        const { categoria_id, monto, fecha, comentario } = req.body;
        const usuario_id = req.user.id; // Seguimos guardando QUIÉN lo cargó

        if (!categoria_id || !monto || !fecha) {
            return res.status(400).send("Faltan campos obligatorios");
        }

        const query = `
            INSERT INTO gastos (usuario_id, categoria_id, monto, fecha, comentario, pagado) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        await db.execute(query, [usuario_id, categoria_id, monto, fecha, comentario, 1]);
        res.redirect('/'); 

    } catch (error) {
        console.error("Error al guardar el gasto:", error);
        res.status(500).send("Error interno al procesar el gasto");
    }
};

const borrarGasto = async (req, res) => {
    try {
        const { id } = req.params;
        // CAMBIO: Eliminamos "AND usuario_id = ?" para que cualquier 
        // administrador o familiar pueda limpiar el historial si es necesario.
        await db.execute('DELETE FROM gastos WHERE id = ?', [id]);
        
        res.redirect('/reportes/historial');
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al borrar el gasto");
    }
};

module.exports = {
    showGastosForm,
    guardarGasto, 
    borrarGasto
};
