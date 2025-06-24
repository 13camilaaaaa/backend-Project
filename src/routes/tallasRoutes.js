import { Router } from 'express';
import tallaController from '../controllers/tallaController.js'; // Importa tu controlador de tallas

const router = Router();

// Rutas para tallas
router.get('/', tallaController.getAllTallas);     // Obtener todas las tallas
router.get('/:id', tallaController.getTallaById);   // Obtener una talla por ID

// Opcional: rutas para administración de tallas si es necesario
// router.post('/', tallaController.createTalla);
// router.put('/:id', tallaController.updateTalla);
// router.delete('/:id', tallaController.deleteTalla);

// Exporta el router
export default router;