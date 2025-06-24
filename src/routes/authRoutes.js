import { Router } from 'express';
import authController from '../controllers/authController.js';
import { authValidation } from '../middlewares/index.js'; // Importa las validaciones de auth

const router = Router();

// Rutas de autenticación con validación
router.post('/register', authValidation.register, authController.register); // Aplica validación antes del controlador
router.post('/login', authValidation.login, authController.login);         // Aplica validación antes del controlador

// Ruta para obtener el perfil de un usuario (requiere autenticación)
// Asumimos que verifyAuth y roleMiddleware son importados directamente aquí o de index.js si se hace mas granular
import verifyAuth from '../middlewares/auth/verifyAuth.js'; // Importa el middleware de autenticación

router.get('/profile', verifyAuth, authController.getUserProfile); // Ejemplo de ruta protegida para el perfil del usuario autenticado
// Nota: 'profile' sin ID, asumiendo que el ID se saca de req.user por verifyAuth

// Exporta el router
export default router;
