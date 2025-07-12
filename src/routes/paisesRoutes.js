import { Router } from 'express';
import paisesController from '../controllers/paisesController.js';
const router = Router();
router.get('/', paisesController.getAll);
export default router;
