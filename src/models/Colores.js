import connection from '../utils/db.js';
class Colores {
    /**
     * @description Obtiene todos los colores disponibles.
     * @returns {Array} - Un array de objetos de color.
     */
    async getAll() {
        try {
            const [rows] = await connection.query('SELECT * FROM colores ORDER BY nombre_color ASC');
            return rows;
        } catch (error) {
            console.error('Error al obtener colores:', error);
            throw new Error('Error al obtener el listado de colores.');
        }
    }
    /**
     * @description Obtiene un color por su ID.
     * @param {number} id - El ID del color.
     * @returns {Object|null} - El objeto de color o null si no se encuentra.
     */
    async getById(id) {
        try {
            const [rows] = await connection.query('SELECT * FROM colores WHERE id = ?', [id]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error(`Error al obtener color con ID ${id}:`, error);
            throw new Error('Error al obtener el color.');
        }
    }
}
export default new Colores();