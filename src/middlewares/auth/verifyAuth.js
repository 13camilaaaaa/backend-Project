// src/middlewares/auth/verifyAuth.js
import jwt from 'jsonwebtoken'; // Importa la librería jsonwebtoken
import ResponseProvider from '../../providers/ResponseProvider.js'; // Importa ResponseProvider

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET;
 // Se obtiene de las variables de entorno

/**
 * @description Middleware para verificar la autenticación del usuario mediante un token JWT.
 * Adjunta la información del usuario (id, email, y roles si se incluyen en el token) a `req.user`.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar el control al siguiente middleware o ruta.
 */
const verifyAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return ResponseProvider.unauthorized(res, 'Acceso denegado. Token de autenticación no proporcionado o formato incorrecto.');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return ResponseProvider.unauthorized(res, 'Acceso denegado. Token no proporcionado.');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // { id: userId, email: userEmail, roles: [...] }
        next();
    } catch (error) {
        console.error('[verifyAuth] Error de verificación de token:', error.message);
        if (error.name === 'TokenExpiredError') {
            return ResponseProvider.unauthorized(res, 'Acceso denegado. Token expirado.');
        }
        if (error.name === 'JsonWebTokenError') {
            return ResponseProvider.unauthorized(res, 'Acceso denegado. Token inválido.');
        }
        ResponseProvider.internalError(res, 'Error interno del servidor al autenticar.');
    }
};

export default verifyAuth;
