import { Router } from 'express';
import roleController from '../controllers/roleController.js'; // Importa tu controlador de roles

const router = Router();

// Rutas para roles
router.get('/', roleController.getAllRoles);     // Obtener todos los roles
router.get('/:id', roleController.getRoleById);   // Obtener un rol por ID

// Rutas para la gestión de roles de usuario
router.post('/assign', roleController.assignRoleToUser); // Asignar un rol a un usuario
router.get('/user/:id', roleController.getRolesByUserId); // Obtener los roles de un usuario

// Exporta el router
export default router;