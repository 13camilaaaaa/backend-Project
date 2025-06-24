import { Router } from 'express';
import tiposViaController from '../controllers/tiposViaController.js'; // Importa tu controlador

const router = Router();

// Rutas para tipos de vía
router.get('/', tiposViaController.getAllTiposVia);    // Obtener todos los tipos
router.get('/:id', tiposViaController.getTipoViaById); // Obtener un tipo por ID

// Exporta el router
export default router;
