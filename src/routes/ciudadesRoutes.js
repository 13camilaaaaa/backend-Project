import { Router } from 'express';
import ciudadesController from '../controllers/ciudadesController.js';
const router = Router();
router.get('/departamento/:departamentoId', ciudadesController.getByDepartamento);
export default router;
