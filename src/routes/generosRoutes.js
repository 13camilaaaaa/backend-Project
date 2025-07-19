import { Router } from 'express';
import generoController from '../controllers/generoController.js'; 

const router = Router();

// Rutas para géneros
router.get('/', generoController.getAllGeneros);     // Obtener todos los géneros
router.get('/:id', generoController.getGeneroById);   // Obtener un género por ID

export default router;
