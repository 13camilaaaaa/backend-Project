import connection from '../utils/db.js';

class Generos {
    /**
     * @description Obtiene todos los géneros disponibles.
     * @returns {Array} - Un array de objetos de género.
     */
    async getAll() {
        try {
            const [rows] = await connection.query('SELECT * FROM generos ORDER BY nombre_genero ASC');
            return rows;
        } catch (error) {
            console.error('Error al obtener géneros:', error);
            throw new Error('Error al obtener el listado de géneros.');
        }
    }

    /**
     * @description Obtiene un género por su ID.
     * @param {number} id - El ID del género.
     * @returns {Object|null} - El objeto de género o null si no se encuentra.
     */
    async getById(id) {
        try {
            const [rows] = await connection.query('SELECT * FROM generos WHERE id = ?', [id]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error(`Error al obtener género con ID ${id}:`, error);
            throw new Error('Error al obtener el género.');
        }
    }

    // Opcional: Métodos para crear, actualizar, eliminar géneros si tu aplicación lo requiere
    // async create(nombre_genero) { ... }
    // async update(id, nombre_genero) { ... }
    // async delete(id) { ... }
}

export default new Generos();
