import { Router } from 'express';
import categoriaController from '../controllers/categoriaController.js'; // Importa tu controlador de categorías

const router = Router();

// Rutas para categorías
router.get('/', categoriaController.getAllCategories); // Obtener todas las categorías
router.get('/:id', categoriaController.getCategoryById); // Obtener una categoría por ID

// Rutas para administración de categorías (podrían requerir autenticación/autorización)
router.post('/', categoriaController.createCategory); // Crear nueva categoría
// router.put('/:id', categoriaController.updateCategory); // Si implementaste update en el controlador
// router.delete('/:id', categoriaController.deleteCategory); // Si implementaste delete en el controlador

// Exporta el router
export default router;