// src/models/Ventas.js
import connection from '../utils/db.js'; // Asegúrate de que la ruta a tu conexión DB sea correcta

class Venta {
    /**
     * @description Obtiene todas las ventas/pedidos, opcionalmente con uniones para mostrar más detalles.
     * @returns {Array} - Un array de objetos de venta.
     */
    async getAll() {
        try {
            // Ejemplo de consulta para obtener ventas con nombre de usuario y dirección de envío
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
     * @returns {number} - El ID de la venta recién creada.
     */
    async create(ventaData) {
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

            const [result] = await connection.query(
                `INSERT INTO ventas (id_usuario, total, estado_pedido, id_direccion_envio, metodo_pago, transaccion_id_pago, comentarios)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [id_usuario, total, estado_pedido, id_direccion_envio, metodo_pago, transaccion_id_pago, comentarios]
            );
            return result.insertId; // Retorna el ID de la venta creada
        } catch (error) {
            console.error('Error al crear la venta:', error);
            throw new Error('Error al crear la venta.');
        }
    }

    /**
     * @description Actualiza el estado de una venta/pedido.
     * @param {number} id - El ID de la venta a actualizar.
     * @param {string} nuevoEstado - El nuevo estado del pedido.
     * @param {string} [fechaPago] - Opcional: fecha de pago si se actualiza a un estado de pagado.
     * @returns {boolean} - True si la actualización fue exitosa, false si la venta no se encontró.
     */
    async updateStatus(id, nuevoEstado, fechaPago = null) {
        try {
            let query = 'UPDATE ventas SET estado_pedido = ?, ultima_actualizacion = NOW()'; // Asume que tienes un campo ultima_actualizacion
            const params = [nuevoEstado];

            if (nuevoEstado === 'Entregado y Pagado' || fechaPago) { // O cualquier estado que implique pago
                query += ', fecha_pago = ?';
                params.push(fechaPago || new Date()); // Usa la fecha proporcionada o la actual
            }

            query += ' WHERE id = ?';
            params.push(id);

            const [result] = await connection.query(query, params);
            return result.affectedRows > 0;
        } catch (error) {
            console.error(`Error al actualizar el estado de la venta ${id}:`, error);
            throw new Error('Error al actualizar el estado de la venta.');
        }
    }

    // Puedes añadir más métodos de actualización según necesites (ej. actualizar método de pago, etc.)

    /**
     * @description Elimina una venta/pedido por su ID.
     * @param {number} id - El ID de la venta a eliminar.
     * @returns {boolean} - True si la eliminación fue exitosa, false si la venta no se encontró.
     */
    async delete(id) {
        try {
            const [result] = await connection.query('DELETE FROM ventas WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error(`Error al eliminar la venta ${id}:`, error);
            throw new Error('Error al eliminar la venta.');
        }
    }
}

export default new Venta(); // Exporta una instancia de la clase