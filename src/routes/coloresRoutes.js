import { Router } from 'express';
import colorController from '../controllers/colorController.js';

const router = Router();

// Rutas para colores
router.get('/', colorController.getAllColores);     // Obtener todos los colores
router.get('/:id', colorController.getColorById);   // Obtener un color por ID

// Exporta el router
export default router;