import connection from "../utils/db.js";
export class Usuarios {

    /**
     * @description Busca un usuario por su correo electrónico, incluyendo detalles de identificación y dirección.
     * @param {string} email - El correo electrónico del usuario.
     * @param {boolean} [includePassword=false] - Si es true, incluye el hash de la contraseña (solo para login).
     * @returns {Object|null} - El objeto usuario con sus detalles, o null si no se encuentra.
     */
    static findByEmail = async (email, includePassword = false) => {
        try {
            let selectFields = `
            u.id,
            u.numero_identificacion,
            u.nombre_usuario,
            u.apellido_usuario,
            u.correo_usuario,
            u.telefono_usuario,
            u.fecha_registro,
            u.token_refresco,
            u.id_tipo_identificacion,
            ti.nombre_tipo AS tipo_identificacion_nombre,
            
            d.id AS id_direccion,
            d.numero_via AS direccion_numero_via,
            d.complemento AS direccion_complemento,
            d.barrio AS direccion_barrio,

            d.id_ciudad AS direccion_ciudad_id,
            c.nombre_ciudad AS direccion_ciudad,

            c.id_departamento AS direccion_departamento_id,
            dep.nombre_departamento AS direccion_departamento,
            
            dep.id_pais AS direccion_pais_id,
            p.nombre_pais AS direccion_pais,

            d.id_tipo_via AS direccion_tipo_via_id,
            tv.nombre_tipo_via AS direccion_tipo_via
        `;
            if (includePassword) {
                selectFields += `, u.contrasena`;
            }
            const query = `
            SELECT ${selectFields}
            FROM usuarios u
            LEFT JOIN tipos_identificacion ti ON u.id_tipo_identificacion = ti.id
            LEFT JOIN direcciones d ON u.id_direccion = d.id
            LEFT JOIN tipos_via tv ON d.id_tipo_via = tv.id
            LEFT JOIN ciudades c ON d.id_ciudad = c.id
            LEFT JOIN departamentos dep ON c.id_departamento = dep.id
            LEFT JOIN paises p ON dep.id_pais = p.id
            WHERE u.correo_usuario = ?;
        `;
            const [rows] = await connection.query(query, [email]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error(`Error al buscar usuario por email ${email}:`, error);
            throw new Error('Error al buscar usuario.');
        }
    };

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
    static create = async (nombre_usuario, apellido_usuario, contrasena, correo_usuario, telefono_usuario) => {
        try {
            const [result] = await connection.query(
                `INSERT INTO usuarios (nombre_usuario, apellido_usuario, contrasena, correo_usuario, telefono_usuario)
                VALUES (?, ?, ?, ?, ?)`,
                [nombre_usuario, apellido_usuario, contrasena, correo_usuario, telefono_usuario]
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
    static updateRefreshToken = async (id, refreshToken) => {
        try {
            await connection.query('UPDATE usuarios SET token_refresco = ? WHERE id = ?', [refreshToken, id]);
        } catch (error) {
            console.error(`Error al actualizar refresh token para usuario ${id}:`, error);
            throw new Error('Error al actualizar el token de refresco.');
        }
    }

    /**
     * @description Busca un usuario por su número de identificación.
     * @param {string} numeroIdentificacion - El número de identificación a buscar.
     * @returns {Object|null} - El objeto usuario encontrado (con id y numero_identificacion) o null.
     */
    static findByNumeroIdentificacion = async (numeroIdentificacion) => {
        try {
            const [rows] = await connection.query(
                'SELECT id, numero_identificacion FROM usuarios WHERE numero_identificacion = ?',
                [numeroIdentificacion]
            );
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error(`Error al buscar usuario por número de identificación ${numeroIdentificacion}:`, error);
            throw new Error('Error al buscar usuario por identificación.');
        }
    };

    static update = async (id, datos) => {
        const { nombre_usuario, apellido_usuario, numero_identificacion, telefono_usuario, id_tipo_identificacion } = datos;

        try {
            const [result] = await connection.query(
                `UPDATE usuarios
            SET nombre_usuario = ?, apellido_usuario = ?, numero_identificacion = ?, telefono_usuario = ?, id_tipo_identificacion = ?
            WHERE id = ?`,
                [nombre_usuario, apellido_usuario, numero_identificacion, telefono_usuario, id_tipo_identificacion, id]
            );
            return result;
        } catch (error) {
            console.error(`Error en el modelo al actualizar el usuario con ID ${id}:`, error);
            throw new Error('Error al actualizar el usuario.');
        }
    };

    static getById = async (id, includePassword = false) => {
        try {
            let selectFields = `
                u.id,
                u.numero_identificacion,
                u.nombre_usuario,
                u.apellido_usuario,
                u.correo_usuario,
                u.telefono_usuario,
                u.fecha_registro,
                u.token_refresco,
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

    static async actualizarDireccion(idUsuario, idDireccion) {
        try {
            const [result] = await connection.query(
                `UPDATE usuarios SET id_direccion = ? WHERE id = ?`,
                [idDireccion, idUsuario]
            );
            return result;
        } catch (error) {
            console.error(`Error al actualizar dirección del usuario con ID ${idUsuario}:`, error);
            throw new Error('Error al actualizar la dirección del usuario.');
        }
    }

    static actualizarContrasena = async (id, nuevaContrasenaHasheada) => {
        try {
            const [result] = await connection.query(
                `UPDATE usuarios SET contrasena = ? WHERE id = ?`,
                [nuevaContrasenaHasheada, id]
            );

            return result.affectedRows > 0;
        } catch (error) {
            console.error(`[Usuarios] Error al actualizar contraseña para ID ${id}:`, error.message);
            throw error;
        }
    };

    static actualizarCorreo = async (id, nuevoCorreo) => {
        try {
            const [result] = await connection.query(
                `UPDATE usuarios SET correo_usuario = ? WHERE id = ?`,
                [nuevoCorreo, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error(`Error al actualizar el correo para ID ${id}:`, error.message);
            throw error;
        }
    };
}