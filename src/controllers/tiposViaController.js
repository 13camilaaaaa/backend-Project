// src/controllers/tiposViaController.js
import TiposViaService from '../services/TiposViaService.js';
import ResponseProvider from '../providers/ResponseProvider.js'; // Importa tu ResponseProvider

class TiposViaController {
    /**
     * @description Obtiene todos los tipos de vía.
     * @param {Object} req - Objeto de solicitud de Express.
     * @param {Object} res - Objeto de respuesta de Express.
     */
    async getAllTiposVia(req, res) {
        try {
            const tipos = await TiposViaService.getAllTiposVia();
            ResponseProvider.success(res, 200, 'Tipos de vía obtenidos exitosamente.', tipos);
        } catch (error) {
            console.error('[tiposViaController] Error al obtener tipos de vía:', error.message);
            ResponseProvider.internalError(res, 'Error interno del servidor al obtener tipos de vía.');
        }
    }

    /**
     * @description Obtiene un tipo de vía por su ID.
     * @param {Object} req - Objeto de solicitud de Express.
     * @param {Object} res - Objeto de respuesta de Express.
     */
    async getTipoViaById(req, res) {
        try {
            const tipoId = parseInt(req.params.id);
            if (isNaN(tipoId)) {
                return ResponseProvider.badRequest(res, 'ID de tipo de vía inválido.');
            }

            const tipo = await TiposViaService.getTipoViaById(tipoId);
            if (!tipo) {
                return ResponseProvider.notFound(res, 'Tipo de vía no encontrado.');
            }
            ResponseProvider.success(res, 200, 'Tipo de vía obtenido exitosamente.', tipo);
        } catch (error) {
            console.error(`[tiposViaController] Error al obtener tipo de vía ${req.params.id}:`, error.message);
            ResponseProvider.internalError(res, 'Error interno del servidor al obtener el tipo de vía.');
        }
    }
}

export default new TiposViaController();
