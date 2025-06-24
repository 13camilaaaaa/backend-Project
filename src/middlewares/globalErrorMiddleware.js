// src/middlewares/globalErrorMiddleware.js
import ResponseProvider from '../providers/ResponseProvider.js';

/**
 * @description Middleware para el manejo global de errores.
 * Captura errores no manejados por otras partes de la aplicación
 * y envía una respuesta de error 500 al cliente.
 * @param {Error} err - El objeto de error.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar el control al siguiente middleware.
 */
const globalErrorMiddleware = (err, req, res, next) => {
    // Registra el error completo en la consola del servidor (útil para depuración)
    console.error('*** ERROR GLOBAL NO MANEJADO ***');
    console.error(err.stack); // Stack trace del error

    // Puedes diferenciar errores para respuestas más específicas
    // if (err instanceof CustomError) { ... }

    // En producción, evita enviar el stack trace completo al cliente por seguridad.
    // En desarrollo, puede ser útil.
    const errorDetails = process.env.NODE_ENV === 'development' ? { stack: err.stack } : {};

    // Envía una respuesta de error 500 al cliente
    ResponseProvider.internalError(res, 'Error interno del servidor.', errorDetails);
};

export default globalErrorMiddleware;