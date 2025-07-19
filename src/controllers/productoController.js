import ProductService from '../services/ProductService.js';
import ResponseProvider from '../providers/ResponseProvider.js';
import Productos from '../models/Productos.js'; 

class ProductoController {
    /**
     * @description Obtiene todos los productos.
     * @param {Object} req - Objeto de solicitud de Express.
     * @param {Object} res - Objeto de respuesta de Express.
     */
    static getAllProducts = async (req, res) => {
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
    static getProductById = async (req, res) => {
        try {
            const { id } = req.params;

            const producto = await Productos.getById(id);

            if (!producto) {
                return res.status(404).json({
                    success: false,
                    message: 'Producto no encontrado'
                });
            }

            res.json({
                success: true,
                data: producto
            });
        } catch (error) {
            console.error('Error en getProductById:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor al obtener el producto.',
                error: error.message
            });
        }
    }

    /**
     * @description Crea un nuevo producto.
     * @param {Object} req - Objeto de solicitud de Express.
     * @param {Object} res - Objeto de respuesta de Express.
     */
    static createProduct = async (req, res) => {
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
    static updateProduct = async (req, res) => {
        try {
            const productId = parseInt(req.params.id);
            if (isNaN(productId)) {
                return ResponseProvider.badRequest(res, 'ID de producto inválido.');
            }

            const updateData = req.body;
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


    static getProductosByGenero = async (req, res) => {
        try {
            const genero = req.params.nombre;
            const productos = await ProductService.getProductsByGenero(genero);
            ResponseProvider.success(res, 200, 'Productos filtrados por género', productos);
        } catch (error) {
            console.error('[productoController] Error al obtener productos por género:', error);
            res.status(500).json({
                success: false,
                message: 'Error al filtrar productos por género.',
                error: error.message || error
            });
        }
    };

    /**
     * @description Elimina un producto.
     * @param {Object} req - Objeto de solicitud de Express.
     * @param {Object} res - Objeto de respuesta de Express.
     */
    static deleteProduct = async (req, res) => {
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
export default ProductoController;