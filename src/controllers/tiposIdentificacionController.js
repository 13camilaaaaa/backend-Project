
import TiposIdentificacionService from '../services/TiposIdentificacionService.js';
import ResponseProvider from '../providers/ResponseProvider.js'; // Importa tu ResponseProvider

class TiposIdentificacionController {
    /**
     * @description Obtiene todos los tipos de identificación.
     * @param {Object} req - Objeto de solicitud de Express.
     * @param {Object} res - Objeto de respuesta de Express.
     */
    async getAllTiposIdentificacion(req, res) {
        try {
            const tipos = await TiposIdentificacionService.getAllTiposIdentificacion();
            ResponseProvider.success(res, 200, 'Tipos de identificación obtenidos exitosamente.', tipos);
        } catch (error) {
            console.error('[tiposIdentificacionController] Error al obtener tipos de identificación:', error.message);
            ResponseProvider.internalError(res, 'Error interno del servidor al obtener tipos de identificación.');
        }
    }

    /**
     * @description Obtiene un tipo de identificación por su ID.
     * @param {Object} req - Objeto de solicitud de Express.
     * @param {Object} res - Objeto de respuesta de Express.
     */
    async getTipoIdentificacionById(req, res) {
        try {
            const tipoId = parseInt(req.params.id);
            if (isNaN(tipoId)) {
                return ResponseProvider.badRequest(res, 'ID de tipo de identificación inválido.');
            }

            const tipo = await TiposIdentificacionService.getTipoIdentificacionById(tipoId);
            if (!tipo) {
                return ResponseProvider.notFound(res, 'Tipo de identificación no encontrado.');
            }
            ResponseProvider.success(res, 200, 'Tipo de identificación obtenido exitosamente.', tipo);
        } catch (error) {
            console.error(`[tiposIdentificacionController] Error al obtener tipo de identificación ${req.params.id}:`, error.message);
            ResponseProvider.internalError(res, 'Error interno del servidor al obtener el tipo de identificación.');
        }
    }
}

export default new TiposIdentificacionController();
