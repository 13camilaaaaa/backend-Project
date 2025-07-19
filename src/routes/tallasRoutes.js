import { Router } from 'express';
import tallaController from '../controllers/tallaController.js';

const router = Router();

// Rutas para tallas
router.get('/', tallaController.getAllTallas);     // Obtener todas las tallas
router.get('/:id', tallaController.getTallaById);   // Obtener una talla por ID

export default router;