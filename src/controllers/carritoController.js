// src/controllers/carritoController.js
import Carrito from "../models/Carrito.js";
import ResponseProvider from "../providers/ResponseProvider.js";
// import connection from '../utils/db.js'; // Ya no lo necesitamos directamente si el modelo lo maneja

class CarritoController {

    static obtenerCarrito = async (req, res) => {
        try {
            const id_usuario = req.user.id; // Asumiendo que req.user.id viene del middleware de autenticación

            let carrito = await Carrito.obtenerCarritoActivo(id_usuario);

            // Si no hay carrito activo, retornar un carrito vacío
            if (!carrito) {
                return res.json({ success: true, carrito: { id: null, items: [] } });
            }

            const items = await Carrito.obtenerTodosLosItemsDeUnCarrito(carrito.id);

            return res.status(200).json({
                success: true,
                carrito: {
                    id: carrito.id,
                    items: items
                }
            });
        } catch (error) {
            console.error("[obtenerCarrito] Error:", error);
            return ResponseProvider.internalError(res, "No se pudo obtener el carrito");
        }
    }

    static async agregarAlCarrito(req, res) {
        const id_usuario = req.user.id;
        const {
            id_producto,
            cantidad,
            precio_unitario_al_momento,
            talla_nombre_al_momento,
            color_nombre_al_momento
        } = req.body;

        if (!id_producto || !cantidad || cantidad <= 0 || !precio_unitario_al_momento) {
            return ResponseProvider.badRequest(res, "Datos de producto inválidos.");
        }

        try {
            let carrito = await Carrito.obtenerCarritoActivo(id_usuario);
            if (!carrito) {
                carrito = await Carrito.crearCarrito(id_usuario);
            }

            const item = await Carrito.obtenerItemCarrito(carrito.id, id_producto);

            if (item) {
                const nuevaCantidad = item.cantidad + cantidad;
                await Carrito.actualizarItemCarrito(
                    item.id,
                    nuevaCantidad,
                    precio_unitario_al_momento,
                    talla_nombre_al_momento,
                    color_nombre_al_momento
                );
            } else {
                await Carrito.insertarItemCarrito(
                    carrito.id,
                    id_producto,
                    cantidad,
                    precio_unitario_al_momento,
                    talla_nombre_al_momento,
                    color_nombre_al_momento
                );
            }

            const updatedItems = await Carrito.obtenerTodosLosItemsDeUnCarrito(carrito.id);

            res.status(200).json({
                success: true,
                message: 'Producto agregado al carrito exitosamente.',
                carrito: {
                    id: carrito.id,
                    items: updatedItems
                }
            });

        } catch (error) {
            console.error('Error en agregarAlCarrito:', error);
            return ResponseProvider.internalError(res, 'Error al agregar al carrito.');
        }
    }

    // --- NUEVAS FUNCIONES ---

    static async actualizarCantidadCarrito(req, res) {
        const id_usuario = req.user.id;
        const { id_item_carrito, cantidad } = req.body;

        if (!id_item_carrito || !cantidad || cantidad <= 0) {
            return ResponseProvider.badRequest(res, "ID del item o cantidad inválidos.");
        }

        try {
            const carrito = await Carrito.obtenerCarritoActivo(id_usuario);
            if (!carrito) {
                return ResponseProvider.notFound(res, "Carrito no encontrado.");
            }

            const item = await Carrito.obtenerItemPorId(id_item_carrito);

            if (!item || item.id_carrito !== carrito.id) {
                return ResponseProvider.forbidden(res, "Item no encontrado en su carrito.");
            }

            await Carrito.actualizarCantidadItemCarrito(id_item_carrito, cantidad);

            const updatedItems = await Carrito.obtenerTodosLosItemsDeUnCarrito(carrito.id);

            res.status(200).json({
                success: true,
                message: 'Cantidad del producto actualizada exitosamente.',
                carrito: {
                    id: carrito.id,
                    items: updatedItems
                }
            });

        } catch (error) {
            console.error('Error en actualizarCantidadCarrito:', error);
            return ResponseProvider.internalError(res, 'Error al actualizar la cantidad del carrito.');
        }
    }

    static async eliminarItemDelCarrito(req, res) {
        const id_usuario = req.user.id;
        const { id_item_carrito } = req.body;

        if (!id_item_carrito) {
            return ResponseProvider.badRequest(res, "ID del item a eliminar no proporcionado.");
        }

        try {
            const carrito = await Carrito.obtenerCarritoActivo(id_usuario);
            if (!carrito) {
                return ResponseProvider.notFound(res, "Carrito no encontrado.");
            }

            const item = await Carrito.obtenerItemPorId(id_item_carrito);

            if (!item || item.id_carrito !== carrito.id) {
                return ResponseProvider.forbidden(res, "Item no encontrado en su carrito o no pertenece a usted.");
            }

            await Carrito.eliminarItemCarrito(id_item_carrito);

            const updatedItems = await Carrito.obtenerTodosLosItemsDeUnCarrito(carrito.id);

            res.status(200).json({
                success: true,
                message: 'Producto eliminado del carrito exitosamente.',
                carrito: {
                    id: carrito.id,
                    items: updatedItems
                }
            });

        } catch (error) {
            console.error('Error en eliminarItemDelCarrito:', error);
            return ResponseProvider.internalError(res, 'Error al eliminar el producto del carrito.');
        }
    }

    // --- OPCIONAL: Limpiar un carrito completo ---
    static async limpiarCarrito(req, res) {
        const id_usuario = req.user.id;

        try {
            const carrito = await Carrito.obtenerCarritoActivo(id_usuario);
            if (!carrito) {
                return ResponseProvider.notFound(res, "Carrito no encontrado.");
            }

            await connection.query(`DELETE FROM items_carrito WHERE id_carrito = ?`, [carrito.id]);

            res.status(200).json({
                success: true,
                message: 'Carrito limpiado exitosamente.',
                carrito: {
                    id: carrito.id,
                    items: []
                }
            });

        } catch (error) {
            console.error('Error en limpiarCarrito:', error);
            return ResponseProvider.internalError(res, 'Error al limpiar el carrito.');
        }
    }
}

export default CarritoController;