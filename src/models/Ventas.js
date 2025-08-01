import connection from '../utils/db.js';

class Ventas {
    /**
     * @description Obtiene todas las ventas/pedidos, opcionalmente con uniones para mostrar más detalles.
     * @returns {Array} - Un array de objetos de venta.
     */
    async getAll() {
        try {
            const query = `
                SELECT
                    v.id,
                    v.fecha,  -- Asegúrate de que este es el nombre de la columna para la fecha de creación
                    v.total,
                    v.estado_pedido,
                    v.metodo_pago,
                    v.transaccion_id_pago,
                    v.fecha_pago,
                    v.comentarios,
                    u.nombre_usuario,
                    u.apellido_usuario,
                    u.correo_usuario,
                    d.numero_via AS direccion_numero_via,
                    d.complemento AS direccion_complemento,
                    d.barrio AS direccion_barrio,
                    d.ciudad AS direccion_ciudad,
                    tv.nombre_tipo_via AS direccion_tipo_via
                FROM
                    ventas v
                LEFT JOIN
                    usuarios u ON v.id_usuario = u.id
                LEFT JOIN
                    direcciones d ON v.id_direccion_envio = d.id
                LEFT JOIN
                    tipos_via tv ON d.id_tipo_via = tv.id
                ORDER BY v.fecha DESC;
            `;
            const [rows] = await connection.query(query);
            return rows;
        } catch (error) {
            console.error('Error al obtener las ventas:', error);
            throw new Error('Error al obtener el listado de ventas.');
        }
    }

    /**
     * @description Obtiene una venta/pedido por su ID.
     * @param {number} id - El ID de la venta.
     * @returns {Object|null} - El objeto de venta o null si no se encuentra.
     */
    async getById(id) {
        try {
            const query = `
                SELECT
                    v.id,
                    v.fecha,
                    v.total,
                    v.estado_pedido,
                    v.metodo_pago,
                    v.transaccion_id_pago,
                    v.fecha_pago,
                    v.comentarios,
                    u.nombre_usuario,
                    u.apellido_usuario,
                    u.correo_usuario,
                    u.numero_identificacion,
                    d.numero_via AS direccion_numero_via,
                    d.complemento AS direccion_complemento,
                    d.barrio AS direccion_barrio,
                    d.ciudad AS direccion_ciudad,
                    tv.nombre_tipo_via AS direccion_tipo_via
                FROM
                    ventas v
                LEFT JOIN
                    usuarios u ON v.id_usuario = u.id
                LEFT JOIN
                    direcciones d ON v.id_direccion_envio = d.id
                LEFT JOIN
                    tipos_via tv ON d.id_tipo_via = tv.id
                WHERE v.id = ?;
            `;
            const [rows] = await connection.query(query, [id]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error(`Error al obtener la venta con ID ${id}:`, error);
            throw new Error('Error al obtener la venta.');
        }
    }

    /**
     * @description Crea una nueva venta/pedido.
     * @param {Object} ventaData - Objeto con los datos de la venta.
     * @param {number|null} ventaData.id_usuario - ID del usuario o null para invitados.
     * @param {number} ventaData.total - El total de la venta.
     * @param {string} ventaData.estado_pedido - El estado inicial del pedido (ej. 'Pendiente').
     * @param {number} ventaData.id_direccion_envio - ID de la dirección de envío.
     * @param {string} [ventaData.metodo_pago] - Método de pago.
     * @param {string} [ventaData.transaccion_id_pago] - ID de transacción de la pasarela.
     * @param {string} [ventaData.comentarios] - Comentarios adicionales.
     * @param {Object} [conn=connection] - Conexión de la base de datos (para transacciones).
     * @returns {number} - El ID de la venta recién creada.
     */
    async create(ventaData, conn = connection) { // Acepta 'conn' como parámetro opcional
        try {
            const {
                id_usuario,
                total,
                estado_pedido = 'Pendiente', // Valor por defecto si no se proporciona
                id_direccion_envio,
                metodo_pago,
                transaccion_id_pago,
                comentarios
            } = ventaData;
            const [result] = await conn.query(
                `INSERT INTO ventas (id_usuario, total, estado_pedido, id_direccion_envio, metodo_pago, transaccion_id_pago, comentarios, fecha)VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
                [id_usuario, total, estado_pedido, id_direccion_envio, metodo_pago || null, transaccion_id_pago || null, comentarios || null]
            );
            return result.insertId;
        } catch (error) {
            console.error('Error al crear la venta en el modelo:', error);
            throw new Error('Error al crear la venta.');
        }
    }

    /**
     * @description Actualiza el estado de una venta/pedido.
     * @param {number} id - El ID de la venta a actualizar.
     * @param {string} nuevoEstado - El nuevo estado del pedido.
     * @param {string} [fechaPago] - Opcional: fecha de pago si se actualiza a un estado de pagado.
     * @param {Object} [conn=connection] - Conexión de la base de datos (para transacciones).
     * @returns {boolean} - True si la actualización fue exitosa, false si la venta no se encontró.
     */
    async updateStatus(id, nuevoEstado, fechaPago = null, conn = connection) {
        try {
            let query = 'UPDATE ventas SET estado_pedido = ?';
            const params = [nuevoEstado];

            if (nuevoEstado === 'Entregado y Pagado' || fechaPago) {
                query += ', fecha_pago = ?';
                params.push(fechaPago || new Date());
            }

            query += ' WHERE id = ?';
            params.push(id);

            const [result] = await conn.query(query, params);
            return result.affectedRows > 0;
        } catch (error) {
            console.error(`Error al actualizar el estado de la venta ${id} en el modelo:`, error);
            throw new Error('Error al actualizar el estado de la venta.');
        }
    }

    /**
     * @description Elimina una venta/pedido por su ID.
     * @param {number} id - El ID de la venta a eliminar.
     * @param {Object} [conn=connection] - Conexión de la base de datos (para transacciones).
     * @returns {boolean} - True si la eliminación fue exitosa, false si la venta no se encontró.
     */
    async delete(id, conn = connection) { // Acepta 'conn'
        try {
            // Usa la conexión proporcionada (conn) para la consulta
            const [result] = await conn.query('DELETE FROM ventas WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error(`Error al eliminar la venta ${id} en el modelo:`, error);
            throw new Error('Error al eliminar la venta.');
        }
    }

    async getVentasByUsuarioId(id_usuario) {
        const [rows] = await connection.query(`
    SELECT id, fecha, total, estado_pedido
    FROM ventas
    WHERE id_usuario = ?
    ORDER BY fecha DESC
`, [id_usuario]);
        return rows;
    }
}

export default new Ventas();