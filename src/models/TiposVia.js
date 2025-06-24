import connection from '../utils/db.js';

class TiposVia {
    /**
     * @description Obtiene todos los tipos de vía.
     * @returns {Array} - Un array de objetos de tipo de vía.
     */
    async getAll() {
        try {
            const [rows] = await connection.query('SELECT * FROM tipos_via ORDER BY nombre_tipo_via ASC');
            return rows;
        } catch (error) {
            console.error('Error al obtener tipos de vía:', error);
            throw new Error('Error al obtener los tipos de vía.');
        }
    }

    /**
     * @description Obtiene un tipo de vía por su ID.
     * @param {number} id - El ID del tipo de vía.
     * @returns {Object|null} - El objeto de tipo de vía o null si no se encuentra.
     */
    async getById(id) {
        try {
            const [rows] = await connection.query('SELECT * FROM tipos_via WHERE id = ?', [id]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error(`Error al obtener tipo de vía con ID ${id}:`, error);
            throw new Error('Error al obtener el tipo de vía.');
        }
    }
}

export default new TiposVia();