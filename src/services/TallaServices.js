// src/services/TallaService.js
import Tallas from '../models/Tallas.js'; // Importa el modelo Tallas

class TallaService {
    /**
     * @description Obtiene todas las tallas disponibles.
     * @returns {Array} - Un array de objetos de talla.
     */
    async getAllTallas() {
        try {
            const tallas = await Tallas.getAll();
            return tallas;
        } catch (error) {
            console.error('[TallaService] Error al obtener todas las tallas:', error.message);
            throw error; // Propaga el error al controlador
        }
    }

    /**
     * @description Obtiene una talla específica por su ID.
     * @param {number} tallaId - El ID de la talla.
     * @returns {Object|null} - El objeto de talla o null si no se encuentra.
     */
    async getTallaById(tallaId) {
        try {
            const talla = await Tallas.getById(tallaId);
            return talla;
        } catch (error) {
            console.error(`[TallaService] Error al obtener talla con ID ${tallaId}:`, error.message);
            throw error;
        }
    }

    // Opcional: Métodos para crear, actualizar, eliminar tallas si tu aplicación lo requiere
    // async createTalla(nombre) {
    //     try {
    //         const newTalla = await Tallas.create(nombre);
    //         return newTalla;
    //     } catch (error) {
    //         console.error('[TallaService] Error al crear talla:', error.message);
    //         throw error;
    //     }
    // }
}

export default new TallaService();