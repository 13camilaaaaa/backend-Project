import TiposVia from '../models/TiposVia.js';

class TiposViaService {
    /**
     * @description Obtiene todos los tipos de vía disponibles.
     * @returns {Array} - Un array de objetos de tipo de vía.
     */
    async getAllTiposVia() {
        try {
            const tipos = await TiposVia.getAll();
            return tipos;
        } catch (error) {
            console.error('[TiposViaService] Error al obtener tipos de vía:', error.message);
            throw error;
        }
    }

    /**
     * @description Obtiene un tipo de vía por su ID.
     * @param {number} tipoId - El ID del tipo de vía.
     * @returns {Object|null} - El objeto de tipo de vía o null si no se encuentra.
     */
    async getTipoViaById(tipoId) {
        try {
            const tipo = await TiposVia.getById(tipoId);
            return tipo;
        } catch (error) {
            console.error(`[TiposViaService] Error al obtener tipo de vía con ID ${tipoId}:`, error.message);
            throw error;
        }
    }
}

export default new TiposViaService();