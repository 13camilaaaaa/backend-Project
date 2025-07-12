import express from 'express';
import CarritoController from '../controllers/carritoController.js';
import verifyAuth from '../middlewares/auth/verifyAuth.js';

const router = express.Router();
// Ruta para obtener el carrito del usuario logueado
router.get('/', verifyAuth, CarritoController.obtenerCarrito);

// Ruta para agregar un producto al carrito o actualizar su cantidad si ya existe
router.post('/agregar', verifyAuth, CarritoController.agregarAlCarrito);

// Ruta para actualizar la cantidad de un item específico en el carrito (para botones + y -)
router.put('/actualizar-cantidad', verifyAuth, CarritoController.actualizarCantidadCarrito);

// Ruta para eliminar un item específico del carrito
// Se recomienda usar DELETE y pasar el ID en el cuerpo o en la URL
router.delete('/eliminar', verifyAuth, CarritoController.eliminarItemDelCarrito); 
// Alternativa para DELETE: router.delete('/:id_item_carrito', verifyAuth, CarritoController.eliminarItemDelCarrito);
// Si usas el id en la URL, cambia req.body.id_item_carrito por req.params.id_item_carrito en el controlador

// Ruta para limpiar/vaciar todo el carrito (Opcional)
// router.delete('/limpiar', verifyAuth, CarritoController.limpiarCarrito);

export default router;