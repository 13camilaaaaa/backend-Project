import Colores from '../models/Colores.js';

class ColorService {
    /**
     * @description Obtiene todos los colores disponibles.
     * @returns {Array} - Un array de objetos de color.
     */
    async getAllColores() {
        try {
            const colores = await Colores.getAll();
            return colores;
        } catch (error) {
            console.error('[ColorService] Error al obtener todos los colores:', error.message);
            throw error;
        }
    }

    /**
     * @description Obtiene un color específico por su ID.
     * @param {number} colorId - El ID del color.
     * @returns {Object|null} - El objeto de color o null si no se encuentra.
     */
    async getColorById(colorId) {
        try {
            const color = await Colores.getById(colorId);
            return color;
        } catch (error) {
            console.error(`[ColorService] Error al obtener color con ID ${colorId}:`, error.message);
            throw error;
        }
    }
}

export default new ColorService();