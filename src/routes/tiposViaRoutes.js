import { Router } from 'express';
import tiposViaController from '../controllers/tiposViaController.js';

const router = Router();

// Rutas para tipos de vía
router.get('/', tiposViaController.getAllTiposVia);    // Obtener todos los tipos
router.get('/:id', tiposViaController.getTipoViaById); // Obtener un tipo por ID

export default router;
