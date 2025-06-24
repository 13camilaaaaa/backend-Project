// src/controllers/tallaController.js
import TallaService from '../services/TallaServices.js';
import ResponseProvider from '../providers/ResponseProvider.js'; // Importa tu ResponseProvider

class TallaController {
    /**
     * @description Obtiene todas las tallas.
     * @param {Object} req - Objeto de solicitud de Express.
     * @param {Object} res - Objeto de respuesta de Express.
     */
    async getAllTallas(req, res) {
        try {
            const tallas = await TallaService.getAllTallas();
            ResponseProvider.success(res, 200, 'Tallas obtenidas exitosamente.', tallas);
        } catch (error) {
            console.error('[tallaController] Error al obtener tallas:', error.message);
            ResponseProvider.internalError(res, 'Error interno del servidor al obtener tallas.');
        }
    }

    /**
     * @description Obtiene una talla por su ID.
     * @param {Object} req - Objeto de solicitud de Express.
     * @param {Object} res - Objeto de respuesta de Express.
     */
    async getTallaById(req, res) {
        try {
            const tallaId = parseInt(req.params.id);
            if (isNaN(tallaId)) {
                return ResponseProvider.badRequest(res, 'ID de talla inválido.');
            }

            const talla = await TallaService.getTallaById(tallaId);
            if (!talla) {
                return ResponseProvider.notFound(res, 'Talla no encontrada.');
            }
            ResponseProvider.success(res, 200, 'Talla obtenida exitosamente.', talla);
        } catch (error) {
            console.error(`[tallaController] Error al obtener talla ${req.params.id}:`, error.message);
            ResponseProvider.internalError(res, 'Error interno del servidor al obtener la talla.');
        }
    }
}

export default new TallaController();
