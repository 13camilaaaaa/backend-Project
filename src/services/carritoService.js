// src/services/CarritoService.js
import Carrito from '../models/Carrito.js'; // Importa el modelo Carrito

const CarritoService = {
    async obtenerOCrearCarritoActivo(id_usuario) {
        let carrito = await Carrito.obtenerCarritoActivo(id_usuario);
        if (!carrito) {
            carrito = await Carrito.crearCarrito(id_usuario);
        }
        return carrito;
    },

    async agregarOActualizarItem(id_carrito, id_producto, cantidad, precio, talla, color) {
        const itemExistente = await Carrito.obtenerItemCarrito(id_carrito, id_producto);

        if (itemExistente) {
            // Si ya existe, actualizar la cantidad
            const nuevaCantidad = itemExistente.cantidad + cantidad;
            await Carrito.actualizarItemCarrito(
                itemExistente.id,
                nuevaCantidad,
                precio, // Puedes decidir si actualizas estos o los mantienes
                talla,
                color
            );
        } else {
            // Si no existe, insertar nuevo
            await Carrito.insertarItemCarrito(
                id_carrito,
                id_producto,
                cantidad,
                precio,
                talla,
                color
            );
        }
        return { id_carrito, id_producto }; // Podrías devolver el item completo o el carrito actualizado
    },

    async actualizarCantidadItem(id_item_carrito, nuevaCantidad) {
        await Carrito.actualizarCantidadItemCarrito(id_item_carrito, nuevaCantidad);
    },

    async eliminarItem(id_item_carrito) {
        await Carrito.eliminarItemCarrito(id_item_carrito);
    },

    async obtenerDetallesCarrito(id_usuario) {
        const carrito = await this.obtenerOCrearCarritoActivo(id_usuario);
        if (!carrito) {
            return { id: null, items: [] }; // No hay carrito, no hay items
        }
        const items = await Carrito.obtenerTodosLosItemsDeUnCarrito(carrito.id);
        return { id: carrito.id, items: items };
    }
};

export default CarritoService;
