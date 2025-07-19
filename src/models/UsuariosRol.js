import connection from '../utils/db.js';

class UsuariosRol {
    /**
     * @description Asigna un rol a un usuario.
     * @param {number} id_usuario - El ID del usuario.
     * @param {number} id_rol - El ID del rol a asignar.
     * @returns {Object} - Objeto con el resultado de la inserción.
     */
    async assignRole(id_usuario, id_rol) {
        try {
            const [existing] = await connection.query(
                'SELECT 1 FROM usuario_rol WHERE id_usuario = ? AND id_rol = ?',
                [id_usuario, id_rol]
            );
            if (existing.length > 0) {
                return { success: true, message: 'El rol ya está asignado a este usuario.' };
            }

            const [result] = await connection.query(
                'INSERT INTO usuario_rol (id_usuario, id_rol) VALUES (?, ?)',
                [id_usuario, id_rol]
            );
            return { success: true, insertId: result.insertId, message: 'Rol asignado exitosamente.' };
        } catch (error) {
            console.error('Error al asignar rol a usuario:', error);
            throw new Error('Error al asignar el rol al usuario.');
        }
    }

    /**
     * @description Elimina un rol asignado a un usuario.
     * @param {number} id_usuario - El ID del usuario.
     * @param {number} id_rol - El ID del rol a eliminar de la asignación.
     * @returns {boolean} - True si la eliminación fue exitosa, false si no se encontró la asignación.
     */
    async removeRole(id_usuario, id_rol) {
        try {
            const [result] = await connection.query(
                'DELETE FROM usuario_rol WHERE id_usuario = ? AND id_rol = ?',
                [id_usuario, id_rol]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al remover rol de usuario:', error);
            throw new Error('Error al remover el rol del usuario.');
        }
    }

    /**
     * @description Obtiene todos los roles de un usuario específico.
     * @param {number} id_usuario - El ID del usuario.
     * @returns {Array} - Un array de objetos de rol asignados al usuario.
     */
    async getRolesByUserId(id_usuario) {
        try {
            const query = `
                SELECT
                    r.id,
                    r.nombre_rol
                FROM
                    roles r
                JOIN
                    usuario_rol ur ON r.id = ur.id_rol
                WHERE ur.id_usuario = ?;
            `;
            const [rows] = await connection.query(query, [id_usuario]);
            return rows;
        } catch (error) {
            console.error(`Error al obtener roles para el usuario ${id_usuario}:`, error);
            throw new Error('Error al obtener los roles del usuario.');
        }
    }

    /**
     * @description Obtiene todos los usuarios con un rol específico.
     * @param {number} id_rol - El ID del rol.
     * @returns {Array} - Un array de objetos de usuario con ese rol.
     */
    async getUsersByRoleId(id_rol) {
        try {
            const query = `
                SELECT
                    u.id,
                    u.nombre_usuario,
                    u.apellido_usuario,
                    u.correo_usuario
                    -- No incluyas contraseñas u otros datos sensibles aquí directamente
                FROM
                    usuarios u
                JOIN
                    usuario_rol ur ON u.id = ur.id_usuario
                WHERE ur.id_rol = ?;
            `;
            const [rows] = await connection.query(query, [id_rol]);
            return rows;
        } catch (error) {
            console.error(`Error al obtener usuarios para el rol ${id_rol}:`, error);
            throw new Error('Error al obtener usuarios por rol.');
        }
    }
}
export default new UsuariosRol();