/**
 * @class ResponseProvider
 * @description Clase de utilidad para estandarizar las respuestas HTTP de la API.
 * Proporciona métodos para generar respuestas de éxito y error consistentes.
 */
class ResponseProvider {

    /**
     * @description Genera una respuesta HTTP exitosa.
     * @param {Object} res - Objeto de respuesta de Express.
     * @param {number} statusCode - Código de estado HTTP de éxito (ej. 200, 201).
     * @param {string} message - Mensaje descriptivo del éxito.
     * @param {Object} [data={}] - Datos adicionales a incluir en la respuesta.
     */
    static success(res, statusCode, message, data = {}) {
        return res.status(statusCode).json({
            success: true,
            message: message,
            data: data
        });
    }

    /**
     * @description Genera una respuesta HTTP de error.
     * @param {Object} res - Objeto de respuesta de Express.
     * @param {number} statusCode - Código de estado HTTP de error (ej. 400, 401, 404, 500).
     * @param {string} message - Mensaje descriptivo del error.
     * @param {Object} [errorDetails={}] - Detalles adicionales del error (ej. validaciones fallidas).
     */
    static error(res, statusCode, message, errorDetails = {}) {
        return res.status(statusCode).json({
            success: false,
            message: message,
            error: errorDetails
        });
    }

    /**
     * @description Genera una respuesta HTTP 400 Bad Request.
     * @param {Object} res - Objeto de respuesta de Express.
     * @param {string} message - Mensaje descriptivo del error.
     * @param {Object} [errorDetails={}] - Detalles adicionales del error.
     */
    static badRequest(res, message = 'Solicitud inválida.', errorDetails = {}) {
        return ResponseProvider.error(res, 400, message, errorDetails);
    }

    /**
     * @description Genera una respuesta HTTP 401 Unauthorized.
     * @param {Object} res - Objeto de respuesta de Express.
     * @param {string} message - Mensaje descriptivo del error.
     */
    static unauthorized(res, message = 'No autorizado.') {
        return ResponseProvider.error(res, 401, message);
    }

    /**
     * @description Genera una respuesta HTTP 403 Forbidden.
     * @param {Object} res - Objeto de respuesta de Express.
     * @param {string} message - Mensaje descriptivo del error.
     */
    static forbidden(res, message = 'Acceso denegado.') {
        return ResponseProvider.error(res, 403, message);
    }

    /**
     * @description Genera una respuesta HTTP 404 Not Found.
     * @param {Object} res - Objeto de respuesta de Express.
     * @param {string} message - Mensaje descriptivo del error.
     */
    static notFound(res, message = 'Recurso no encontrado.') {
        return ResponseProvider.error(res, 404, message);
    }

    /**
     * @description Genera una respuesta HTTP 409 Conflict.
     * @param {Object} res - Objeto de respuesta de Express.
     * @param {string} message - Mensaje descriptivo del error.
     */
    static conflict(res, message = 'Conflicto en la solicitud (ej. recurso duplicado).') {
        return ResponseProvider.error(res, 409, message);
    }

    /**
     * @description Genera una respuesta HTTP 500 Internal Server Error.
     * @param {Object} res - Objeto de respuesta de Express.
     * @param {string} message - Mensaje descriptivo del error.
     * @param {Object} [errorDetails={}] - Detalles adicionales del error (ej. stack trace en desarrollo).
     */
    static internalError(res, message = 'Error interno del servidor.', errorDetails = {}) {
        return ResponseProvider.error(res, 500, message, errorDetails);
    }
}

export default ResponseProvider;
