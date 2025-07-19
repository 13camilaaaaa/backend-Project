import Categoria from '../models/Categoria.js';
class CategoryService {
    /**
     * @description Obtiene todas las categorías de productos.
     * @returns {Array} - Un array de objetos de categoría.
     */
    async getAllCategories() {
        try {
            const categories = await Categoria.getAll();
            return categories;
        } catch (error) {
            console.error('[CategoryService] Error al obtener todas las categorías:', error.message);
            throw error;
        }
    }

    /**
     * @description Obtiene una categoría específica por su ID.
     * @param {number} categoryId - El ID de la categoría.
     * @returns {Object|null} - El objeto de categoría o null si no se encuentra.
     */
    async getCategoryById(categoryId) {
        try {
            const category = await Categoria.getById(categoryId);
            return category;
        } catch (error) {
            console.error(`[CategoryService] Error al obtener categoría con ID ${categoryId}:`, error.message);
            throw error;
        }
    }

    /**
     * @description Crea una nueva categoría.
     * @param {string} categoryName - El nombre de la nueva categoría.
     * @returns {Object} - El objeto de categoría creado.
     */
    async createCategory(categoryName) {
        try {
            // Aquí podrías añadir validaciones de negocio adicionales
            const newCategory = await Categoria.create(categoryName);
            return newCategory;
        } catch (error) {
            console.error('[CategoryService] Error al crear categoría:', error.message);
            throw error;
        }
    }
}

export default new CategoryService();