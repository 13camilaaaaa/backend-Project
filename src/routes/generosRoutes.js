import { Router } from 'express';
import generoController from '../controllers/generoController.js'; 

const router = Router();

// Rutas para géneros
router.get('/', generoController.getAllGeneros);     // Obtener todos los géneros
router.get('/:id', generoController.getGeneroById);   // Obtener un género por ID

// Opcional: rutas para administración de géneros si es necesario
// router.post('/', generoController.createGenero);
// router.put('/:id', generoController.updateGenero);
// router.delete('/:id', generoController.deleteGenero);

// Exporta el router
export default router;
