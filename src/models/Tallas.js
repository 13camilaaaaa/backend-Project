import connection from '../utils/db.js';

class Tallas {
    /**
     * @description Obtiene todas las tallas disponibles.
     * @returns {Array} - Un array de objetos de talla.
     */
    async getAll() {
        try {
            const [rows] = await connection.query('SELECT * FROM tallas ORDER BY nombre_talla ASC');
            return rows;
        } catch (error) {
            console.error('Error al obtener tallas:', error);
            throw new Error('Error al obtener el listado de tallas.');
        }
    }

    /**
     * @description Obtiene una talla por su ID.
     * @param {number} id - El ID de la talla.
     * @returns {Object|null} - El objeto de talla o null si no se encuentra.
     */
    async getById(id) {
        try {
            const [rows] = await connection.query('SELECT * FROM tallas WHERE id = ?', [id]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error(`Error al obtener talla con ID ${id}:`, error);
            throw new Error('Error al obtener la talla.');
        }
    }
}

export default new Tallas();