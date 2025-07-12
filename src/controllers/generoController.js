// src/controllers/generoController.js
import GeneroService from '../services/GeneroService.js';
import ResponseProvider from '../providers/ResponseProvider.js'; // Importa tu ResponseProvider

class GeneroController {
    /**
     * @description Obtiene todos los géneros.
     * @param {Object} req - Objeto de solicitud de Express.
     * @param {Object} res - Objeto de respuesta de Express.
     */
    static getAllGeneros = async(req, res) =>{  
        try {
            const generos = await GeneroService.getAllGeneros();
            ResponseProvider.success(res, 200, 'Géneros obtenidos exitosamente.', generos);
        } catch (error) {
            console.error('[generoController] Error al obtener géneros:', error.message);
            ResponseProvider.internalError(res, 'Error interno del servidor al obtener géneros.');
        }
    }

    /**
     * @description Obtiene un género por su ID.
     * @param {Object} req - Objeto de solicitud de Express.
     * @param {Object} res - Objeto de respuesta de Express.
     */
    static getGeneroById = async(req, res) =>{
        try {
            const generoId = parseInt(req.params.id);
            if (isNaN(generoId)) {
                return ResponseProvider.badRequest(res, 'ID de género inválido.');
            }

            const genero = await GeneroService.getGeneroById(generoId);
            if (!genero) {
                return ResponseProvider.notFound(res, 'Género no encontrado.');
            }
            ResponseProvider.success(res, 200, 'Género obtenido exitosamente.', genero);
        } catch (error) {
            console.error(`[generoController] Error al obtener género ${req.params.id}:`, error.message);
            ResponseProvider.internalError(res, 'Error interno del servidor al obtener el género.');
        }
    }
}

export default GeneroController;
