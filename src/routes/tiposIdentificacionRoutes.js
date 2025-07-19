import { Router } from 'express';
import tiposIdentificacionController from '../controllers/tiposIdentificacionController.js'; 

const router = Router();

// Rutas para tipos de identificación
router.get('/', tiposIdentificacionController.getAllTiposIdentificacion);    // Obtener todos los tipos
router.get('/:id', tiposIdentificacionController.getTipoIdentificacionById); // Obtener un tipo por ID

export default router;
