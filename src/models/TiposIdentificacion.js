import connection from '../utils/db.js';

class TiposIdentificacion {
    /**
     * @description Obtiene todos los tipos de identificación.
     * @returns {Array} - Un array de objetos de tipo de identificación.
     */
    async getAll() {
        try {
            const [rows] = await connection.query('SELECT * FROM tipos_identificacion ORDER BY nombre_tipo ASC');
            return rows;
        } catch (error) {
            console.error('Error al obtener tipos de identificación:', error);
            throw new Error('Error al obtener los tipos de identificación.');
        }
    }

    /**
     * @description Obtiene un tipo de identificación por su ID.
     * @param {number} id - El ID del tipo de identificación.
     * @returns {Object|null} - El objeto de tipo de identificación o null si no se encuentra.
     */
    async getById(id) {
        try {
            const [rows] = await connection.query('SELECT * FROM tipos_identificacion WHERE id = ?', [id]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error(`Error al obtener tipo de identificación con ID ${id}:`, error);
            throw new Error('Error al obtener el tipo de identificación.');
        }
    }
}

export default new TiposIdentificacion();