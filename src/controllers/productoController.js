import ProductService from '../services/ProductService.js';
import ResponseProvider from '../providers/ResponseProvider.js'; // Importa tu ResponseProvider

class ProductoController {
    /**
     * @description Obtiene todos los productos.
     * @param {Object} req - Objeto de solicitud de Express.
     * @param {Object} res - Objeto de respuesta de Express.
     */
    async getAllProducts(req, res) {
        try {
            const products = await ProductService.getAllProducts();
            ResponseProvider.success(res, 200, 'Productos obtenidos exitosamente.', products);
        } catch (error) {
            console.error('[productoController] Error al obtener productos:', error.message);
            ResponseProvider.internalError(res, 'Error interno del servidor al obtener productos.');
        }
    }

    /**
     * @description Obtiene un producto por su ID.
     * @param {Object} req - Objeto de solicitud de Express.
     * @param {Object} res - Objeto de respuesta de Express.
     */
    async getProductById(req, res) {
        try {
            const productId = parseInt(req.params.id);
            if (isNaN(productId)) {
                return ResponseProvider.badRequest(res, 'ID de producto inválido.');
            }

            const product = await ProductService.getProductById(productId);
            if (!product) {
                return ResponseProvider.notFound(res, 'Producto no encontrado.');
            }
            ResponseProvider.success(res, 200, 'Producto obtenido exitosamente.', product);
        } catch (error) {
            console.error(`[productoController] Error al obtener producto ${req.params.id}:`, error.message);
            ResponseProvider.internalError(res, 'Error interno del servidor al obtener el producto.');
        }
    }

    /**
     * @description Crea un nuevo producto.
     * @param {Object} req - Objeto de solicitud de Express.
     * @param {Object} res - Objeto de respuesta de Express.
     */
    async createProduct(req, res) {
        try {
            const productData = req.body;
            if (!productData.nombre || !productData.precio || !productData.stock || !productData.id_talla) {
                return ResponseProvider.badRequest(res, 'Faltan campos obligatorios para crear el producto.');
            }

            const newProduct = await ProductService.createProduct(productData);
            ResponseProvider.success(res, 201, 'Producto creado exitosamente.', newProduct);
        } catch (error) {
            console.error('[productoController] Error al crear producto:', error.message);
            ResponseProvider.internalError(res, 'Error interno del servidor al crear el producto.');
        }
    }

    /**
     * @description Actualiza un producto existente.
     * @param {Object} req - Objeto de solicitud de Express.
     * @param {Object} res - Objeto de respuesta de Express.
     */
    async updateProduct(req, res) {
        try {
            const productId = parseInt(req.params.id);
            if (isNaN(productId)) {
                return ResponseProvider.badRequest(res, 'ID de producto inválido.');
            }

            const updateData = req.body;
            // Consider adding specific validation for updateData fields if needed
            if (Object.keys(updateData).length === 0) {
                 return ResponseProvider.badRequest(res, 'No se proporcionaron datos para actualizar.');
            }

            const updatedProduct = await ProductService.updateProduct(productId, updateData);

            if (!updatedProduct) {
                return ResponseProvider.notFound(res, 'Producto no encontrado para actualizar.');
            }
            ResponseProvider.success(res, 200, 'Producto actualizado exitosamente.', updatedProduct);
        } catch (error) {
            console.error(`[productoController] Error al actualizar producto ${req.params.id}:`, error.message);
            ResponseProvider.internalError(res, 'Error interno del servidor al actualizar el producto.');
        }
    }

    /**
     * @description Elimina un producto.
     * @param {Object} req - Objeto de solicitud de Express.
     * @param {Object} res - Objeto de respuesta de Express.
     */
    async deleteProduct(req, res) {
        try {
            const productId = parseInt(req.params.id);
            if (isNaN(productId)) {
                return ResponseProvider.badRequest(res, 'ID de producto inválido.');
            }

            const isDeleted = await ProductService.deleteProduct(productId);
            if (!isDeleted) {
                return ResponseProvider.notFound(res, 'Producto no encontrado para eliminar.');
            }
            ResponseProvider.success(res, 200, 'Producto eliminado exitosamente.');
        } catch (error) {
            console.error(`[productoController] Error al eliminar producto ${req.params.id}:`, error.message);
            ResponseProvider.internalError(res, 'Error interno del servidor al eliminar el producto.');
        }
    }
}

export default new ProductoController();