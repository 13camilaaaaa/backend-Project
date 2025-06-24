import { Router } from 'express';
import colorController from '../controllers/colorController.js'; // Importa tu controlador de colores

const router = Router();

// Rutas para colores
router.get('/', colorController.getAllColores);     // Obtener todos los colores
router.get('/:id', colorController.getColorById);   // Obtener un color por ID

// Opcional: rutas para administración de colores si es necesario
// router.post('/', colorController.createColor);
// router.put('/:id', colorController.updateColor);
// router.delete('/:id', colorController.deleteColor);

// Exporta el router
export default router;