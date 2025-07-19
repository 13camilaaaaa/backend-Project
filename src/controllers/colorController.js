import ColorService from '../services/ColorService.js';
import ResponseProvider from '../providers/ResponseProvider.js';

class ColorController {
    /**
     * @description Obtiene todos los colores.
     * @param {Object} req - Objeto de solicitud de Express.
     * @param {Object} res - Objeto de respuesta de Express.
     */
    async getAllColores(req, res) {
        try {
            const colores = await ColorService.getAllColores();
            ResponseProvider.success(res, 200, 'Colores obtenidos exitosamente.', colores);
        } catch (error) {
            console.error('[colorController] Error al obtener colores:', error.message);
            ResponseProvider.internalError(res, 'Error interno del servidor al obtener colores.');
        }
    }

    /**
     * @description Obtiene un color por su ID.
     * @param {Object} req - Objeto de solicitud de Express.
     * @param {Object} res - Objeto de respuesta de Express.
     */
    async getColorById(req, res) {
        try {
            const colorId = parseInt(req.params.id);
            if (isNaN(colorId)) {
                return ResponseProvider.badRequest(res, 'ID de color inválido.');
            }

            const color = await ColorService.getColorById(colorId);
            if (!color) {
                return ResponseProvider.notFound(res, 'Color no encontrado.');
            }
            ResponseProvider.success(res, 200, 'Color obtenido exitosamente.', color);
        } catch (error) {
            console.error(`[colorController] Error al obtener color ${req.params.id}:`, error.message);
            ResponseProvider.internalError(res, 'Error interno del servidor al obtener el color.');
        }
    }
}
export default new ColorController();
