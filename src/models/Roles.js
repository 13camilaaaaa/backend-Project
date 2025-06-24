import connection from '../utils/db.js';

class Roles {
    /**
     * @description Obtiene todos los roles disponibles.
     * @returns {Array} - Un array de objetos de rol.
     */
    async getAll() {
        try {
            const [rows] = await connection.query('SELECT * FROM roles ORDER BY nombre_rol ASC');
            return rows;
        } catch (error) {
            console.error('Error al obtener roles:', error);
            throw new Error('Error al obtener el listado de roles.');
        }
    }

    /**
     * @description Obtiene un rol por su ID.
     * @param {number} id - El ID del rol.
     * @returns {Object|null} - El objeto de rol o null si no se encuentra.
     */
    async getById(id) {
        try {
            const [rows] = await connection.query('SELECT * FROM roles WHERE id = ?', [id]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error(`Error al obtener rol con ID ${id}:`, error);
            throw new Error('Error al obtener el rol.');
        }
    }

    // Opcional: Métodos para crear, actualizar, eliminar roles si tu aplicación lo requiere
    // async create(nombre_rol) { ... }
    // async update(id, nombre_rol) { ... }
    // async delete(id) { ... }
}

export default new Roles();