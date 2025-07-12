// src/models/DetalleVenta.js
import connection from '../utils/db.js'; // Asegúrate de que la ruta a tu conexión DB sea correcta

class DetalleVenta {
    /**
     * @description Crea un nuevo registro de detalle de venta.
     * @param {number} venta_id - ID de la venta a la que pertenece este detalle.
     * @param {number} producto_id - ID del producto en el detalle.
     * @param {number} cantidad - Cantidad del producto.
     * @param {number} precio_unitario - Precio unitario del producto en el momento de la venta.
     * @param {string} [talla_seleccionada] - Talla del producto comprada.
     * @param {string} [color_seleccionado] - Color del producto comprado.
     * @returns {number} - El ID del detalle de venta creado.
     */
    async create(venta_id, producto_id, cantidad, precio_unitario, talla_seleccionada = null, color_seleccionado = null, conn) {
        try {
            const [result] = await conn.query(
                `INSERT INTO detalle_venta (venta_id, producto_id, cantidad, precio_unitario, talla_seleccionada, color_seleccionado)
            VALUES (?, ?, ?, ?, ?, ?)`,
                [venta_id, producto_id, cantidad, precio_unitario, talla_seleccionada, color_seleccionado]
            );
            return result.insertId;
        } catch (error) {
            console.error('Error al crear el detalle de venta:', error);
            throw new Error('Error al crear el detalle de venta.');
        }
    }

    /**
     * @description Obtiene todos los detalles de venta para una venta/pedido específica.
     * @param {number} venta_id - El ID de la venta.
     * @returns {Array} - Un array de objetos de detalle de venta.
     */
    async getByVentaId(venta_id) {
        try {
            const query = `
                SELECT
                    dv.id,
                    dv.venta_id,
                    dv.producto_id,
                    dv.cantidad,
                    dv.precio_unitario,
                    dv.talla_seleccionada,
                    dv.color_seleccionado,
                    p.nombre AS nombre_producto,
                    p.imagen AS imagen_producto
                FROM
                    detalle_venta dv
                JOIN
                    productos p ON dv.producto_id = p.id
                WHERE dv.venta_id = ?;
            `;
            const [rows] = await connection.query(query, [venta_id]);
            return rows;
        } catch (error) {
            console.error(`Error al obtener detalles de venta para la venta ${venta_id}:`, error);
            throw new Error('Error al obtener los detalles de la venta.');
        }
    }

    async getDetallesByVentaId(id_venta) {
        const [rows] = await connection.query(`
        SELECT dv.cantidad, dv.precio_unitario, p.nombre AS nombre_producto
        FROM detalle_venta dv
        JOIN productos p ON p.id = dv.producto_id
        WHERE dv.venta_id = ?
    `, [id_venta]);
        return rows;
    }

}

export default new DetalleVenta(); // Exporta una instancia de la clase