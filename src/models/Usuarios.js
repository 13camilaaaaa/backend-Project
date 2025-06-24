// src/models/Usuarios.js
import connection from "../utils/db.js"; // Asegúrate de que la ruta a tu conexión DB sea correcta

export class Usuarios {

    /**
     * @description Busca un usuario por su correo electrónico, incluyendo detalles de identificación y dirección.
     * @param {string} email - El correo electrónico del usuario.
     * @param {boolean} [includePassword=false] - Si es true, incluye el hash de la contraseña (solo para login).
     * @returns {Object|null} - El objeto usuario con sus detalles, o null si no se encuentra.
     */
    static async findByEmail(email, includePassword = false) {
        try {
            let selectFields = `
                u.id,
                u.numero_identificacion,
                u.nombre_usuario,
                u.apellido_usuario,
                u.correo_usuario,
                u.telefono_usuario,
                u.fecha_registro,
                u.refresh_token,
                ti.nombre_tipo AS tipo_identificacion_nombre,
                d.numero_via AS direccion_numero_via,
                d.complemento AS direccion_complemento,
                d.barrio AS direccion_barrio,
                d.ciudad AS direccion_ciudad,
                tv.nombre_tipo_via AS direccion_tipo_via
            `;
            if (includePassword) {
                selectFields += `, u.contrasena`; // Añadir contraseña solo si se solicita explícitamente
            }

            const query = `
                SELECT
                    ${selectFields}
                FROM
                    usuarios u
                LEFT JOIN
                    tipos_identificacion ti ON u.id_tipo_identificacion = ti.id
                LEFT JOIN
                    direcciones d ON u.id_direccion = d.id
                LEFT JOIN
                    tipos_via tv ON d.id_tipo_via = tv.id
                WHERE u.correo_usuario = ?;
            `;
            const [rows] = await connection.query(query, [email]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error(`Error al buscar usuario por email ${email}:`, error);
            throw new Error('Error al buscar usuario.');
        }
    }

    /**
     * @description Crea un nuevo usuario en la base de datos.
     * @param {string} numero_identificacion - Número de identificación del usuario.
     * @param {number} id_tipo_identificacion - ID del tipo de identificación.
     * @param {string} nombre_usuario - Nombre del usuario.
     * @param {string} apellido_usuario - Apellido del usuario.
     * @param {string} contrasena - Contraseña hasheada del usuario.
     * @param {string} correo_usuario - Correo electrónico del usuario.
     * @param {string} telefono_usuario - Teléfono del usuario.
     * @param {number} id_direccion - ID de la dirección asociada al usuario.
     * @returns {number} - El ID del usuario recién creado.
     */
    static async create(numero_identificacion, id_tipo_identificacion, nombre_usuario, apellido_usuario, contrasena, correo_usuario, telefono_usuario, id_direccion) {
        try {
            const [result] = await connection.query(
                `INSERT INTO usuarios (numero_identificacion, id_tipo_identificacion, nombre_usuario, apellido_usuario, contrasena, correo_usuario, telefono_usuario, id_direccion)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [numero_identificacion, id_tipo_identificacion, nombre_usuario, apellido_usuario, contrasena, correo_usuario, telefono_usuario, id_direccion]
            );
            return result.insertId;
        } catch (error) {
            console.error('Error al crear el usuario:', error);
            // Si el error es por email duplicado, puedes lanzar un error más específico
            if (error.code === 'ER_DUP_ENTRY' && error.message.includes('correo_usuario')) {
                throw new Error('El correo electrónico ya está registrado.');
            }
            throw new Error('Error al registrar el usuario.');
        }
    }

    /**
     * @description Actualiza el token de refresco de un usuario.
     * @param {number} id - El ID del usuario.
     * @param {string|null} refreshToken - El nuevo token de refresco o null para limpiarlo.
     */
    static async updateRefreshToken(id, refreshToken) {
        try {
            await connection.query('UPDATE usuarios SET refresh_token = ? WHERE id = ?', [refreshToken, id]);
        } catch (error) {
            console.error(`Error al actualizar refresh token para usuario ${id}:`, error);
            throw new Error('Error al actualizar el token de refresco.');
        }
    }

    // Puedes añadir métodos para obtener usuario por ID, actualizar usuario, eliminar usuario, etc.
    // Siguiendo el patrón de getById en Producto.js, pero para usuario
    static async getById(id, includePassword = false) {
        try {
            let selectFields = `
                u.id,
                u.numero_identificacion,
                u.nombre_usuario,
                u.apellido_usuario,
                u.correo_usuario,
                u.telefono_usuario,
                u.fecha_registro,
                u.refresh_token,
                ti.nombre_tipo AS tipo_identificacion_nombre,
                d.numero_via AS direccion_numero_via,
                d.complemento AS direccion_complemento,
                d.barrio AS direccion_barrio,
                d.ciudad AS direccion_ciudad,
                tv.nombre_tipo_via AS direccion_tipo_via
            `;
            if (includePassword) {
                selectFields += `, u.contrasena`;
            }

            const query = `
                SELECT
                    ${selectFields}
                FROM
                    usuarios u
                LEFT JOIN
                    tipos_identificacion ti ON u.id_tipo_identificacion = ti.id
                LEFT JOIN
                    direcciones d ON u.id_direccion = d.id
                LEFT JOIN
                    tipos_via tv ON d.id_tipo_via = tv.id
                WHERE u.id = ?;
            `;
            const [rows] = await connection.query(query, [id]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error(`Error al buscar usuario por ID ${id}:`, error);
            throw new Error('Error al obtener el usuario.');
        }
    }
}