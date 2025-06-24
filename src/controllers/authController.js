// src/controllers/authController.js (Ejemplo de refactorización usando ResponseProvider)
import AuthService from '../services/AuthService.js';
import ResponseProvider from '../providers/ResponseProvider.js'; // Importa tu ResponseProvider

class AuthController {
    async register(req, res) {
        try {
            const userData = req.body;
            const newUserId = await AuthService.registerUser(userData);

            // Usando ResponseProvider para éxito
            ResponseProvider.success(res, 201, 'Usuario registrado exitosamente.', { userId: newUserId });
        } catch (error) {
            console.error('[authController] Error en el registro:', error.message);
            // Usando ResponseProvider para errores específicos
            if (error.message.includes('correo electrónico ya está registrado')) {
                return ResponseProvider.conflict(res, error.message);
            }
            if (error.message.includes('Datos de usuario o contraseña inválidos') || error.message.includes('Datos de dirección inválidos')) {
                return ResponseProvider.badRequest(res, error.message);
            }
            // Error genérico del servidor
            ResponseProvider.internalError(res, 'Error interno del servidor al registrar el usuario.');
        }
    }

    async login(req, res) {
        try {
            const { correo_usuario, contrasena } = req.body;
            const user = await AuthService.loginUser(correo_usuario, contrasena);

            if (!user) {
                return ResponseProvider.unauthorized(res, 'Credenciales inválidas.');
            }

            ResponseProvider.success(res, 200, 'Inicio de sesión exitoso.', {
                user: user,
                // token: 'YOUR_JWT_TOKEN', // Aquí iría tu JWT real
                // refreshToken: 'YOUR_REFRESH_TOKEN'
            });
        } catch (error) {
            console.error('[authController] Error en el login:', error.message);
            ResponseProvider.internalError(res, 'Error interno del servidor al iniciar sesión.');
        }
    }

    async getUserProfile(req, res) {
        try {
            const userId = parseInt(req.params.id);
            if (isNaN(userId)) {
                return ResponseProvider.badRequest(res, 'ID de usuario inválido.');
            }

            const user = await AuthService.getUserById(userId);
            if (!user) {
                return ResponseProvider.notFound(res, 'Usuario no encontrado.');
            }

            ResponseProvider.success(res, 200, 'Perfil de usuario obtenido exitosamente.', user);
        } catch (error) {
            console.error(`[authController] Error al obtener perfil de usuario ${req.params.id}:`, error.message);
            ResponseProvider.internalError(res, 'Error interno del servidor al obtener el perfil del usuario.');
        }
    }
}

export default new AuthController();
