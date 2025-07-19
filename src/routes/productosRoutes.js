import { Router } from 'express';
import productoController from '../controllers/productoController.js';
import { productoValidation, verifyAuth } from '../middlewares/index.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const router = Router();

// Rutas públicas para ver productos (no necesitan autenticación/validación específica de ruta)
router.get('/', productoController.getAllProducts);
router.get('/genero/:nombre', productoController.getProductosByGenero);
router.get('/:id', productoValidation.getById, productoController.getProductById); // Valida el ID del parámetro
// Rutas protegidas que requieren autenticación y rol de 'admin'
router.post('/', verifyAuth, roleMiddleware(['admin']), productoValidation.create, productoController.createProduct);
router.put('/:id', verifyAuth, roleMiddleware(['admin']), productoValidation.update, productoController.updateProduct);
router.delete('/:id', verifyAuth, roleMiddleware(['admin']), productoValidation.delete, productoController.deleteProduct);

export default router;