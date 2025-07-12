import { Router } from 'express';
import authController from '../controllers/authController.js';
import { authValidation } from '../middlewares/index.js'; // Importa las validaciones de auth
import verifyAuth from '../middlewares/auth/verifyAuth.js'; // Importa el middleware de autenticación

const router = Router();

// Rutas de autenticación con validación
router.post('/register', authValidation.register, authController.register); // Aplica validación antes del controlador
router.post('/login', authValidation.login, authController.login);  
router.post("/auth/refresh", authController.refreshToken);
router.post("/logout", authController.logout);
router.post('/enviar-codigo', authController.enviarCodigo);
router.post('/verificar-codigo', authController.verificarCodigo);
router.post('/correo/reenviar-codigo', authController.enviarCodigoCorreoActual);


router.get('/profile', verifyAuth, authController.getUserProfile); // Ejemplo de ruta protegida para el perfil del usuario autenticado
// Nota: 'profile' sin ID, asumiendo que el ID se saca de req.user por verifyAuth

// Exporta el router
export default router;
