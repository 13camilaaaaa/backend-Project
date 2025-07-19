import CategoryService from '../services/CategoryService.js';
import ResponseProvider from '../providers/ResponseProvider.js';

class CategoriaController {
    /**
     * @description Obtiene todas las categorías.
     * @param {Object} req - Objeto de solicitud de Express.
     * @param {Object} res - Objeto de respuesta de Express.
     */
    static getAllCategories = async (req, res) => {
        try {
            const categories = await CategoryService.getAllCategories();
            ResponseProvider.success(res, 200, 'Categorías obtenidas exitosamente.', categories);
        } catch (error) {
            console.error('[categoriaController] Error al obtener categorías:', error.message);
            ResponseProvider.internalError(res, 'Error interno del servidor al obtener categorías.');
        }
    }

    /**
     * @description Obtiene una categoría por su ID.
     * @param {Object} req - Objeto de solicitud de Express.
     * @param {Object} res - Objeto de respuesta de Express.
     */
    static getCategoryById = async(req, res) =>{
        try {
            const categoryId = parseInt(req.params.id);
            if (isNaN(categoryId)) {
                return ResponseProvider.badRequest(res, 'ID de categoría inválido.');
            }

            const category = await CategoryService.getCategoryById(categoryId);
            if (!category) {
                return ResponseProvider.notFound(res, 'Categoría no encontrada.');
            }
            ResponseProvider.success(res, 200, 'Categoría obtenida exitosamente.', category);
        } catch (error) {
            console.error(`[categoriaController] Error al obtener categoría ${req.params.id}:`, error.message);
            ResponseProvider.internalError(res, 'Error interno del servidor al obtener la categoría.');
        }
    }

    /**
     * @description Crea una nueva categoría.
     * @param {Object} req - Objeto de solicitud de Express.
     * @param {Object} res - Objeto de respuesta de Express.
     */
    static createCategory= async (req, res) => {
        try {
            const { nombre_categoria } = req.body;
            if (!nombre_categoria || typeof nombre_categoria !== 'string' || nombre_categoria.trim() === '') {
                return ResponseProvider.badRequest(res, 'El nombre de la categoría es obligatorio.');
            }

            const newCategory = await CategoryService.createCategory(nombre_categoria);
            ResponseProvider.success(res, 201, 'Categoría creada exitosamente.', newCategory);
        } catch (error) {
            console.error('[categoriaController] Error al crear categoría:', error.message);
            ResponseProvider.internalError(res, 'Error interno del servidor al crear la categoría.');
        }
    }
}

export default CategoriaController;