import { Router } from 'express';
import departamentosController from '../controllers/departamentosController.js';
const router = Router();
router.get('/pais/:paisId', departamentosController.getByPais);
export default router;
