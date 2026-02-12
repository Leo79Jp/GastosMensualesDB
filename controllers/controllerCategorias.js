const db = require('../config/db');

const ListarCategorias = async (req, res) => {
    try {
        // Quitamos el WHERE para que traiga TODAS las categorías del sistema
        const [rows] = await db.execute(
            'SELECT * FROM categorias_gastos ORDER BY es_fijo DESC, nombre ASC'
        );
        res.render('gastos/categorias', { categorias: rows });
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
};

const actualizarCategoria = async (req, res) => {
    const { id } = req.params;
    const { nombre, es_fijo } = req.body;
    try {
        // Quitamos el "AND usuario_id = ?" para poder editar categorías del grupo
        await db.execute(
            'UPDATE categorias_gastos SET nombre = ?, es_fijo = ? WHERE id = ?',
            [nombre, es_fijo, id]
        );
        res.redirect('/categorias');
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al actualizar");
    }
};

const guardarCategoria = async (req, res) => {
    const { nombre, es_fijo } = req.body;
    try {
        // Seguimos guardando el req.user.id para saber qué usuario la creó originalmente
        await db.execute(
            'INSERT INTO categorias_gastos (usuario_id, nombre, es_fijo) VALUES (?, ?, ?)',
            [req.user.id, nombre, es_fijo]
        );
        res.redirect('/categorias');
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al guardar");
    }
};

const borrarCategoria = async (req, res) => {
    const { id } = req.params;
    try {
        // Quitamos el filtro de usuario para permitir el borrado global
        await db.execute('DELETE FROM categorias_gastos WHERE id = ?', [id]);
        res.redirect('/categorias');
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al borrar");
    }
};

module.exports = { ListarCategorias, guardarCategoria, borrarCategoria, actualizarCategoria };