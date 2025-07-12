// src/controllers/authController.js (Ejemplo de refactorización usando ResponseProvider)
import jwt from 'jsonwebtoken';
import AuthService from '../services/AuthService.js';
import ResponseProvider from '../providers/ResponseProvider.js'; // Importa tu ResponseProvider
import { EmailService } from '../services/EmailService.js';
// Mapa persistente en memoria del backend (mientras esté corriendo)
const codigos = new Map(); // { id_usuario: codigo }

class AuthController {
    static register = async (req, res) => {
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

    static login = async (req, res) => {
        try {
            const { correo_usuario, contrasena } = req.body;
            const usuario = await AuthService.loginUser(correo_usuario, contrasena);

            if (!usuario) {
                return ResponseProvider.unauthorized(res, 'Credenciales inválidas.');
            }

            // GENERAR TOKEN
            const token = jwt.sign(
                { id: usuario.id, correo: usuario.correo_usuario },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: process.env.TOKEN_EXPIRATION }
            );

            // OPCIONAL: generar refresh token
            const refreshToken = jwt.sign(
                { id: usuario.id },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: process.env.REFRESH_EXPIRATION }
            );

            // OPCIONAL: guardar refreshToken en la base de datos
            await AuthService.updateRefreshToken(usuario.id, refreshToken);

            // RESPUESTA
            ResponseProvider.success(res, 200, 'Inicio de sesión exitoso.', {
                usuario: usuario,
                token: token,
                token_refresco: refreshToken
            });
        } catch (error) {
            console.error('[authController] Error en el login:', error.message);
            ResponseProvider.internalError(res, 'Error interno del servidor al iniciar sesión.');
        }
    }

    static refreshToken = async (req, res) => {
        try {
            const { token_refresh } = req.body;
            if (!token_refresh) return ResponseProvider.badRequest(res, "Token de refresco requerido");

            const decoded = jwt.verify(token_refresh, process.env.REFRESH_TOKEN_SECRET);
            const usuario = await AuthService.getUserById(decoded.id);

            if (!usuario) return ResponseProvider.unauthorized(res, "Usuario no encontrado");

            const newAccessToken = jwt.sign(
                { id: usuario.id, correo: usuario.correo_usuario },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: process.env.TOKEN_EXPIRATION } // ej: "15m"
            );

            const newRefreshToken = jwt.sign(
                { id: usuario.id },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION } // ej: "7d"
            );

            return ResponseProvider.success(res, 200, "Token renovado", {
                token: newAccessToken,
                token_refresh: newRefreshToken
            });
        } catch (error) {
            return ResponseProvider.unauthorized(res, "Token inválido o expirado");
        }
    }

    static logout = async (req, res) => {
        try {
            const { id } = req.body;

            if (!id) {
                return ResponseProvider.badRequest(res, "ID de usuario no proporcionado.");
            }

            await AuthService.updateRefreshToken(id, null);

            ResponseProvider.success(res, 200, "Sesión cerrada exitosamente.");
        } catch (error) {
            console.error("[authController] Error en logout:", error.message);
            ResponseProvider.internalError(res, "Error al cerrar sesión.");
        }
    }


    static getUserProfile = async (req, res) => {
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


    static enviarCodigo = async (req, res) => {
        const { id, correo } = req.body;

        if (!id || !correo) {
            return res.status(400).json({ success: false, message: "Faltan datos" });
        }

        const codigo = Math.floor(100000 + Math.random() * 900000); // 6 dígitos
        codigos.set(id, codigo); // guarda en memoria

        try {
            await EmailService.enviarCodigoVerificacion(correo, codigo);
            res.status(200).json({ success: true, message: "Código enviado con éxito" });
        } catch (error) {
            console.error("Error al enviar el código:", error);
            res.status(500).json({ success: false, message: "Error al enviar el código" });
        }
    };

    static verificarCodigo = async (req, res) => {
        const { id, codigo } = req.body;

        if (!id || !codigo) {
            return res.status(400).json({ success: false, message: "Faltan datos" });
        }

        const codigoGuardado = codigos.get(id);
        if (parseInt(codigo) === codigoGuardado) {
            codigos.delete(id); // limpiar por seguridad
            return res.status(200).json({ success: true, message: "Código válido" });
        } else {
            return res.status(400).json({ success: false, message: "Código incorrecto" });
        }
    };

    static actualizarContrasena = async (req, res) => {
        const { id } = req.params;
        const { contrasena } = req.body;

        if (!contrasena || contrasena.length < 8) {
            return ResponseProvider.badRequest(res, "Contraseña inválida o demasiado corta.");
        }

        try {
            const actualizado = await AuthService.actualizarContrasena(id, contrasena);

            if (!actualizado) {
                return ResponseProvider.notFound(res, "Usuario no encontrado.");
            }

            return ResponseProvider.success(res, 200, "Contraseña actualizada correctamente.");
        } catch (error) {
            console.error("[authController] Error al actualizar la contraseña:", error.message);
            return ResponseProvider.internalError(res, "Error interno al actualizar la contraseña.");
        }
    };
    
    static enviarCodigoCorreoActual = async (req, res) => {
        const { id, correo } = req.body;

        if (!id || !correo) {
            return ResponseProvider.badRequest(res, "Faltan datos para enviar el código.");
        }

        const codigo = Math.floor(100000 + Math.random() * 900000); // Código de 6 dígitos
        codigos.set(id, codigo); // Guarda el código temporalmente en memoria

        try {
            await EmailService.enviarCodigoVerificacion(correo, codigo);
            return ResponseProvider.success(res, 200, "Código enviado al correo actual.");
        } catch (error) {
            console.error("[authController] Error al enviar código al correo actual:", error.message);
            return ResponseProvider.internalError(res, "No se pudo enviar el código.");
        }
    };
}

export default AuthController;
