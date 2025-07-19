import { Router } from 'express';
import ventaController from '../controllers/ventaController.js';
import verifyToken from '../middlewares/auth/verifyAuth.js';

const router = Router();

// Rutas para ventas/pedidos
router.post('/', ventaController.createOrder);          // Crear un nuevo pedido
router.get('/mis-pedidos', verifyToken, ventaController.getVentasDelUsuario);
router.get('/', ventaController.getAllVentas);          // Obtener todas las ventas (útil para administración)
router.get('/:id', ventaController.getVentaById);       // Obtener una venta por ID con sus detalles
router.put('/:id/status', ventaController.updateVentaStatus); // Actualizar el estado de una venta
router.delete('/:id', ventaController.deleteVenta);     // Eliminar una venta

export default router;