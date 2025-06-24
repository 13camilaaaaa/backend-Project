// src/services/GeneroService.js
import Generos from '../models/Generos.js'; // Importa el modelo Generos

class GeneroService {
    /**
     * @description Obtiene todos los géneros disponibles.
     * @returns {Array} - Un array de objetos de género.
     */
    async getAllGeneros() {
        try {
            const generos = await Generos.getAll();
            return generos;
        } catch (error) {
            console.error('[GeneroService] Error al obtener todos los géneros:', error.message);
            throw error;
        }
    }

    /**
     * @description Obtiene un género específico por su ID.
     * @param {number} generoId - El ID del género.
     * @returns {Object|null} - El objeto de género o null si no se encuentra.
     */
    async getGeneroById(generoId) {
        try {
            const genero = await Generos.getById(generoId);
            return genero;
        } catch (error) {
            console.error(`[GeneroService] Error al obtener género con ID ${generoId}:`, error.message);
            throw error;
        }
    }

    // Opcional: Métodos para crear, actualizar, eliminar géneros si tu aplicación lo requiere
}

export default new GeneroService();