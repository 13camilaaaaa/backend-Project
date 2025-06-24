// src/services/VentaService.js
import connection from '../utils/db.js'; // Importa la conexión directa para manejar transacciones
import VentaModel from '../models/Ventas.js'; // Importa el modelo Ventas
import DetalleVentaModel from '../models/DetalleVenta.js'; // Importa el modelo DetalleVenta
import Productos from '../models/Productos.js'; // Para actualizar el stock

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
     * @param {Array<Object>} orderData.productos - Array de objetos de producto en el carrito (ej. [{id: 1, cantidad: 2}, ...])
     * @returns {Object} - El ID de la venta creada y el total final.
     * @throws {Error} - Lanza un error si la transacción falla o el stock es insuficiente.
     */
    async createOrder(orderData) {
        let transactionConnection; // Variable para la conexión de la transacción
        try {
            // Desestructura los datos del pedido
            const { id_usuario, id_direccion_envio, metodo_pago, transaccion_id_pago, comentarios, productos } = orderData;

            if (!productos || productos.length === 0) {
                throw new Error('El pedido no contiene productos.');
            }

            // Obtener una conexión del pool para la transacción
            transactionConnection = await connection.getConnection();
            await transactionConnection.beginTransaction(); // Iniciar la transacción

            let totalVenta = 0;
            const detailedProducts = []; // Para almacenar info completa de los productos comprados

            // 1. Validar stock y calcular el total de la venta
            for (const item of productos) {
                const productDb = await Productos.getById(item.id);

                if (!productDb) {
                    throw new Error(`Producto con ID ${item.id} no encontrado.`);
                }
                if (productDb.stock < item.cantidad) {
                    throw new Error(`Stock insuficiente para el producto: ${productDb.nombre}. Disponible: ${productDb.stock}, Solicitado: ${item.cantidad}`);
                }

                // Guardar la información completa del producto y el precio unitario en el momento de la compra
                detailedProducts.push({
                    ...productDb, // Copia todas las propiedades del producto
                    cantidad_comprada: item.cantidad,
                    precio_unitario_venta: productDb.precio // Precio en el momento de la venta
                });
                totalVenta += productDb.precio * item.cantidad;
            }

            // 2. Crear la venta (cabecera del pedido)
            const ventaId = await VentaModel.create(
                {
                    id_usuario,
                    total: totalVenta,
                    estado_pedido: 'Pendiente', // Estado inicial
                    id_direccion_envio,
                    metodo_pago,
                    transaccion_id_pago,
                    comentarios
                }
            );

            // 3. Insertar detalles de venta y actualizar stock
            for (const item of detailedProducts) {
                // Insertar en detalle_venta
                await DetalleVentaModel.create(
                    ventaId,
                    item.id,
                    item.cantidad_comprada,
                    item.precio_unitario_venta,
                    item.talla_nombre, // Usar el nombre que viene con el JOIN del modelo Producto
                    item.color_nombre  // Ídem
                );

                // Actualizar stock del producto
                await ProductoModel.updateStock(item.id, -item.cantidad_comprada); // Restar la cantidad comprada
            }

            // Si todo lo anterior fue exitoso, confirmar la transacción
            await transactionConnection.commit();
            console.log(`Venta ${ventaId} creada exitosamente y stock actualizado.`);
            return { ventaId, totalVenta };

        } catch (error) {
            // Si ocurre algún error, revertir la transacción
            if (transactionConnection) {
                await transactionConnection.rollback();
                console.error('Transacción de venta revertida debido a un error.');
            }
            console.error('[VentaService] Error al crear pedido:', error.message);
            throw error; // Propaga el error al controlador
        } finally {
            // Siempre liberar la conexión al pool
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
            const ventas = await VentaModel.getAll();
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
            const venta = await VentaModel.getById(ventaId);
            if (!venta) {
                return null;
            }
            // Obtener los detalles de los productos en esta venta
            const detalles = await DetalleVentaModel.getByVentaId(ventaId);
            venta.productos = detalles; // Añadir los productos como una propiedad de la venta
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
            const isUpdated = await VentaModel.updateStatus(ventaId, newStatus, fechaPago);
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
            const isDeleted = await VentaModel.delete(ventaId);
            return isDeleted;
        } catch (error) {
            console.error(`[VentaService] Error al eliminar venta con ID ${ventaId}:`, error.message);
            throw error;
        }
    }
}

export default new VentaService();