import TiposIdentificacion from '../models/TiposIdentificacion.js';

class TiposIdentificacionService {
    /**
     * @description Obtiene todos los tipos de identificación disponibles.
     * @returns {Array} - Un array de objetos de tipo de identificación.
     */
    async getAllTiposIdentificacion() {
        try {
            const tipos = await TiposIdentificacion.getAll();
            return tipos;
        } catch (error) {
            console.error('[TiposIdentificacionService] Error al obtener tipos de identificación:', error.message);
            throw error;
        }
    }

    /**
     * @description Obtiene un tipo de identificación por su ID.
     * @param {number} tipoId - El ID del tipo de identificación.
     * @returns {Object|null} - El objeto de tipo de identificación o null si no se encuentra.
     */
    async getTipoIdentificacionById(tipoId) {
        try {
            const tipo = await TiposIdentificacion.getById(tipoId);
            return tipo;
        } catch (error) {
            console.error(`[TiposIdentificacionService] Error al obtener tipo de identificación con ID ${tipoId}:`, error.message);
            throw error;
        }
    }
}

export default new TiposIdentificacionService();