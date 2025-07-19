import { Router } from 'express';
import authController from '../controllers/authController.js';
import { authValidation } from '../middlewares/index.js';
import verifyAuth from '../middlewares/auth/verifyAuth.js';
const router = Router();

// Rutas de autenticación con validación
router.post('/register', authValidation.register, authController.register);
router.post('/login', authValidation.login, authController.login);  
router.post("/auth/refresh", authController.refreshToken);
router.post("/logout", authController.logout);
router.post('/enviar-codigo', authController.enviarCodigo);
router.post('/verificar-codigo', authController.verificarCodigo);
router.post('/correo/reenviar-codigo', authController.enviarCodigoCorreoActual);
router.get('/profile', verifyAuth, authController.getUserProfile);

export default router;
