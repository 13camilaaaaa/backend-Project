import VentaService from '../services/VentaService.js';
import ResponseProvider from '../providers/ResponseProvider.js'; // Importa tu ResponseProvider
import  Ventas  from '../models/Ventas.js';
import  DetalleVenta  from '../models/DetalleVenta.js'; // si usas esto también


class VentaController {
    /**
     * @description Crea un nuevo pedido/venta.
     * @param {Object} req - Objeto de solicitud de Express.
     * @param {Object} res - Objeto de respuesta de Express.
     */
    async createOrder(req, res) {
        try {
            const orderData = req.body;

            if (!orderData.productos || orderData.productos.length === 0) {
                return ResponseProvider.badRequest(res, 'El pedido debe contener al menos un producto.');
            }
            if (!orderData.id_direccion_envio || !orderData.metodo_pago) {
                return ResponseProvider.badRequest(res, 'Faltan datos obligatorios para crear el pedido (dirección de envío, método de pago).');
            }

            const result = await VentaService.createOrder(orderData);

            ResponseProvider.success(res, 201, 'Pedido creado exitosamente.', {
                ventaId: result.ventaId,
                totalVenta: result.totalVenta
            });
        } catch (error) {
            console.error('[ventaController] Error al crear el pedido:', error.message);
            if (error.message.includes('Producto no encontrado') || error.message.includes('Stock insuficiente')) {
                return ResponseProvider.badRequest(res, error.message);
            }
            ResponseProvider.internalError(res, 'Error interno del servidor al crear el pedido.');
        }
    }

    /**
     * @description Obtiene todas las ventas/pedidos.
     * @param {Object} req - Objeto de solicitud de Express.
     * @param {Object} res - Objeto de respuesta de Express.
     */
    async getAllVentas(req, res) {
        try {
            const ventas = await VentaService.getAllVentas();
            ResponseProvider.success(res, 200, 'Ventas obtenidas exitosamente.', ventas);
        } catch (error) {
            console.error('[ventaController] Error al obtener ventas:', error.message);
            ResponseProvider.internalError(res, 'Error interno del servidor al obtener las ventas.');
        }
    }

    /**
     * @description Obtiene una venta/pedido por su ID, incluyendo sus detalles de productos.
     * @param {Object} req - Objeto de solicitud de Express.
     * @param {Object} res - Objeto de respuesta de Express.
     */
    async getVentaById(req, res) {
        try {
            const ventaId = parseInt(req.params.id);
            if (isNaN(ventaId)) {
                return ResponseProvider.badRequest(res, 'ID de venta inválido.');
            }

            const venta = await VentaService.getVentaById(ventaId);
            if (!venta) {
                return ResponseProvider.notFound(res, 'Venta/Pedido no encontrado.');
            }
            ResponseProvider.success(res, 200, 'Venta/Pedido obtenido exitosamente.', venta);
        } catch (error) {
            console.error(`[ventaController] Error al obtener venta ${req.params.id}:`, error.message);
            ResponseProvider.internalError(res, 'Error interno del servidor al obtener la venta.');
        }
    }

    /**
     * @description Actualiza el estado de una venta/pedido.
     * @param {Object} req - Objeto de solicitud de Express.
     * @param {Object} res - Objeto de respuesta de Express.
     */
    async updateVentaStatus(req, res) {
        try {
            const ventaId = parseInt(req.params.id);
            if (isNaN(ventaId)) {
                return ResponseProvider.badRequest(res, 'ID de venta inválido.');
            }

            const { estado_pedido, fecha_pago } = req.body;
            if (!estado_pedido) {
                return ResponseProvider.badRequest(res, 'Se requiere el campo "estado_pedido" para actualizar.');
            }

            const isUpdated = await VentaService.updateVentaStatus(ventaId, estado_pedido, fecha_pago);
            if (!isUpdated) {
                return ResponseProvider.notFound(res, 'Venta/Pedido no encontrado para actualizar estado.');
            }
            ResponseProvider.success(res, 200, 'Estado de venta/pedido actualizado exitosamente.');
        } catch (error) {
            console.error(`[ventaController] Error al actualizar estado de venta ${req.params.id}:`, error.message);
            ResponseProvider.internalError(res, 'Error interno del servidor al actualizar el estado de la venta.');
        }
    }

    /**
     * @description Elimina una venta/pedido.
     * @param {Object} req - Objeto de solicitud de Express.
     * @param {Object} res - Objeto de respuesta de Express.
     */
    async deleteVenta(req, res) {
        try {
            const ventaId = parseInt(req.params.id);
            if (isNaN(ventaId)) {
                return ResponseProvider.badRequest(res, 'ID de venta inválido.');
            }

            const isDeleted = await VentaService.deleteVenta(ventaId);
            if (!isDeleted) {
                return ResponseProvider.notFound(res, 'Venta/Pedido no encontrado para eliminar.');
            }
            ResponseProvider.success(res, 200, 'Venta/Pedido eliminado exitosamente.');
        } catch (error) {
            console.error(`[ventaController] Error al eliminar venta ${req.params.id}:`, error.message);
            ResponseProvider.internalError(res, 'Error interno del servidor al eliminar la venta.');
        }
    }

    async getVentasDelUsuario (req, res) {
        try {
            const id_usuario = req.user.id;
            console.log("Usuario autenticado:", req.user);

            // Obtener todas las ventas de ese usuario
            const ventas = await Ventas.getVentasByUsuarioId(id_usuario);

            // Para cada venta, obtener su detalle
            const ventasConDetalle = await Promise.all(ventas.map(async venta => {
                const detalle = await DetalleVenta.getDetallesByVentaId(venta.id);

                return {
                    ...venta,
                    detalle: detalle.map(d => ({
                        nombre: d.nombre_producto, // asegúrate que lo devuelva tu JOIN
                        cantidad: d.cantidad,
                        precio_unitario: d.precio_unitario
                    }))
                };
            }));

            res.json({
                success: true,
                pedidos: ventasConDetalle
            });

        } catch (error) {
            console.error("Error al obtener pedidos del usuario:", error);
            res.status(500).json({
                success: false,
                message: "Error al obtener tus pedidos."
            });
        }
    }
}

export default new VentaController();
