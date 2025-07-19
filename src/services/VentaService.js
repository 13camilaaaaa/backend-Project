import connection from '../utils/db.js';
import Ventas from '../models/Ventas.js';
import DetalleVenta from '../models/DetalleVenta.js';
import Productos from '../models/Productos.js';
import Carrito from '../models/Carrito.js';
class VentaService {
    /**
     * @description Crea un nuevo pedido/venta, incluyendo sus detalles y actualizando el stock.
     * Toda la operación se envuelve en una transacción para asegurar la consistencia de los datos.
     * @param {Object} orderData - Datos del pedido.
     * @param {number|null} orderData.id_usuario - ID del usuario o null para invitado.
     * @param {number} orderData.id_direccion_envio - ID de la dirección de envío.
     * @param {string} orderData.metodo_pago - Método de pago.
     * @param {string} [orderData.transaccion_id_pago] - ID de la transacción de la pasarela de pago (si aplica).
     * @param {string} [orderData.comentarios] - Comentarios adicionales del pedido.
     * @param {Array<Object>} orderData.productos - Array de objetos de producto en el carrito (ej. [{id_producto: 1, cantidad: 2, precio_unitario: 100}, ...])
     * @returns {Object} - El ID de la venta creada y el total final.
     * @throws {Error} - Lanza un error si la transacción falla o el stock es insuficiente.
     */
    async createOrder(orderData) {
        let transactionConnection;
        try {
            const { id_usuario, id_direccion_envio, metodo_pago, transaccion_id_pago, comentarios, productos } = orderData;
            if (!id_usuario) {
                throw new Error('ID de usuario es obligatorio para crear el pedido.');
            }
            if (!productos || productos.length === 0) {
                throw new Error('El pedido debe contener al menos un producto.');
            }
            if (!id_direccion_envio) {
                throw new Error('La dirección de envío es obligatoria.');
            }
            if (!metodo_pago) {
                throw new Error('El método de pago es obligatorio.');
            }
            transactionConnection = await connection.getConnection();
            await transactionConnection.beginTransaction();

            let totalVenta = 0;
            const detailedProductsForOrder = [];

            for (const item of productos) {
                const productDb = await Productos.getById(item.id_producto);
                if (!productDb) {
                    throw new Error(`Producto con ID ${item.id_producto} no encontrado.`);
                }
                if (productDb.stock < item.cantidad) {
                    throw new Error(`Stock insuficiente para el producto: ${productDb.nombre}. Disponible: ${productDb.stock}, Solicitado: ${item.cantidad}`);
                }

                console.log("item recibido del frontend:", item);

                detailedProductsForOrder.push({
                    id_producto: item.id_producto,
                    cantidad_comprada: item.cantidad,
                    precio_unitario_venta: item.precio_unitario || productDb.precio,
                    talla: item.talla || item.talla_nombre_al_momento || null,
                    color: item.color || item.color_nombre_al_momento || null
                });
                totalVenta += productDb.precio * item.cantidad;
            }
            // 2. Crear la venta (cabecera del pedido)
            const ventaId = await Ventas.create(
                {
                    id_usuario,
                    total: totalVenta,
                    estado_pedido: 'Pendiente',
                    id_direccion_envio,
                    metodo_pago,
                    transaccion_id_pago,
                    comentarios
                },
                transactionConnection
            );

            for (const item of detailedProductsForOrder) {
                await DetalleVenta.create(
                    ventaId,
                    item.id_producto,
                    item.cantidad_comprada,
                    item.precio_unitario_venta,
                    item.talla,
                    item.color,
                    transactionConnection
                );

                await Productos.updateStock(item.id_producto, -item.cantidad_comprada, transactionConnection);
            }

            // 4. Eliminar productos del carrito del usuario
            const carritoUsuario = await Carrito.obtenerCarritoActivo(id_usuario);
            const carritoId = carritoUsuario ? carritoUsuario.id : null;

            if (carritoId) {
                await Carrito.deleteItemsByCarritoId(carritoId, transactionConnection);
                await Carrito.delete(carritoId, transactionConnection);
            }
            await transactionConnection.commit();
            console.log(`Venta ${ventaId} creada exitosamente, stock actualizado y carrito vaciado.`);
            return { ventaId, totalVenta };

        } catch (error) {
            if (transactionConnection) {
                await transactionConnection.rollback();
                console.error('Transacción de venta revertida debido a un error.');
            }
            console.error('[VentaService] Error al crear pedido:', error.message);
            throw error;
        } finally {
            if (transactionConnection) {
                transactionConnection.release();
            }
        }
    }

    /**
     * @description Obtiene todas las ventas/pedidos.
     * @returns {Array} - Un array de objetos de venta con detalles completos.
     */
    async getAllVentas() {
        try {
            const ventas = await Ventas.getAll();
            return ventas;
        } catch (error) {
            console.error('[VentaService] Error al obtener todas las ventas:', error.message);
            throw error;
        }
    }

    /**
     * @description Obtiene una venta/pedido por su ID, incluyendo sus detalles de productos.
     * @param {number} ventaId - El ID de la venta.
     * @returns {Object|null} - El objeto de venta con sus detalles o null si no se encuentra.
     */
    async getVentaById(ventaId) {
        try {
            const venta = await Ventas.getById(ventaId);
            if (!venta) {
                return null;
            }
            const detalles = await DetalleVenta.getByVentaId(ventaId);
            venta.productos = detalles;
            return venta;
        } catch (error) {
            console.error(`[VentaService] Error al obtener venta con ID ${ventaId}:`, error.message);
            throw error;
        }
    }

    /**
     * @description Actualiza el estado de un pedido.
     * @param {number} ventaId - ID de la venta.
     * @param {string} newStatus - Nuevo estado del pedido (ej. 'Enviado', 'Entregado y Pagado').
     * @param {string} [fechaPago] - Fecha y hora de pago si el estado implica pago.
     * @returns {boolean} - True si se actualizó, false si no se encontró la venta.
     */
    async updateVentaStatus(ventaId, newStatus, fechaPago = null) {
        try {
            const isUpdated = await Ventas.updateStatus(ventaId, newStatus, fechaPago);
            return isUpdated;
        } catch (error) {
            console.error(`[VentaService] Error al actualizar estado de venta ${ventaId}:`, error.message);
            throw error;
        }
    }

    /**
     * @description Elimina una venta/pedido.
     * @param {number} ventaId - ID de la venta.
     * @returns {boolean} - True si se eliminó, false si no se encontró.
     */
    async deleteVenta(ventaId) {
        try {
            const isDeleted = await Ventas.delete(ventaId);
            return isDeleted;
        } catch (error) {
            console.error(`[VentaService] Error al eliminar venta con ID ${ventaId}:`, error.message);
            throw error;
        }
    }
}

export default new VentaService();