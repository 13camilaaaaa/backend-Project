// src/middlewares/roleMiddleware.js
// Este middleware verifica si el usuario autenticado tiene uno de los roles requeridos.

import ResponseProvider from '../providers/ResponseProvider.js'; // Importa el ResponseProvider

/**
 * @description Middleware para verificar si el usuario tiene uno de los roles requeridos.
 * Asume que `req.user` ha sido poblado por un middleware de autenticación (ej. verifyAuth)
 * con un campo `roles` (array de nombres de roles del usuario).
 * @param {Array<string>} requiredRoles - Un array de nombres de roles (ej. ['admin', 'empleado'])
 * que son necesarios para acceder a la ruta.
 * @returns {Function} - Un middleware de Express que puedes usar en tus rutas.
 */
const roleMiddleware = (requiredRoles) => {
    return (req, res, next) => {
        // 1. Verificar si la información del usuario está disponible en la solicitud
        // Esto significa que el middleware de autenticación (ej. verifyAuth) ya se ejecutó.
        if (!req.user || !req.user.roles) {
            // Si no hay información de usuario o roles, es un problema de autenticación/token
            // Aunque verifyAuth debería haberlo manejado, esto es una capa de seguridad extra.
            console.warn('[roleMiddleware] Intento de acceso sin info de usuario o roles. Posiblemente authMiddleware no ejecutado o token inválido/ausente.');
            return ResponseProvider.forbidden(res, 'Acceso denegado. No se pudo verificar tu autorización. Asegúrate de estar autenticado.');
        }

        // 2. Obtener los roles del usuario autenticado
        const userRoles = req.user.roles; // `req.user.roles` debe ser un array de strings (ej. ['cliente', 'admin'])

        // 3. Verificar si el usuario tiene al menos uno de los roles requeridos
        // some() devuelve true si al menos un elemento del array cumple la condición
        const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

        if (hasRequiredRole) {
            // El usuario tiene al menos uno de los roles requeridos, continuar con la siguiente función
            next();
        } else {
            // El usuario no tiene ninguno de los roles requeridos
            console.warn(`[roleMiddleware] Usuario con roles [${userRoles.join(', ')}] intentó acceder a ruta que requiere [${requiredRoles.join(', ')}].`);
            ResponseProvider.forbidden(res, 'Acceso denegado. No tienes los permisos necesarios para realizar esta acción.');
        }
    };
};

export default roleMiddleware;