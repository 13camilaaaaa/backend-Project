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
router.delete('/eliminar', verifyAuth, CarritoController.eliminarItemDelCarrito);

export default router;