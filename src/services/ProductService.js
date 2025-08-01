import Productos from '../models/Productos.js';

class ProductService {
    /**
     * @description Obtiene todos los productos de la tienda.
     * @returns {Array} - Un array de objetos de producto con detalles completos.
     */
    static getAllProducts = async () => {
        try {
            const products = await Productos.getAll();
            return products;
        } catch (error) {
            console.error('[ProductService] Error al obtener todos los productos:', error.message);
            throw error;
        }
    }

    /**
     * @description Obtiene un producto específico por su ID.
     * @param {number} productId - El ID del producto.
     * @returns {Object|null} - El objeto de producto o null si no se encuentra.
     */
    static getProductById = async (productId) => {
        try {
            const product = await productos.getById(productId);
            return product;
        } catch (error) {
            console.error(`[ProductService] Error al obtener producto con ID ${productId}:`, error.message);
            throw error;
        }
    }

    /**
     * @description Crea un nuevo producto.
     * @param {Object} productData - Datos para el nuevo producto.
     * @returns {Object} - El objeto de producto creado.
     */
    static createProduct = async (productData) => {
        try {
            // Desestructura los datos para pasarlos al modelo
            const { nombre, descripcion, precio, stock, imagen, id_talla, id_genero, id_categoria, id_color } = productData;
            const newProduct = await Producto.create(
                nombre, descripcion, precio, stock, imagen, id_talla, id_genero, id_categoria, id_color
            );
            return newProduct;
        } catch (error) {
            console.error('[ProductService] Error al crear producto:', error.message);
            throw error;
        }
    }

    /**
     * @description Actualiza un producto existente.
     * @param {number} productId - ID del producto a actualizar.
     * @param {Object} updateData - Datos a actualizar para el producto.
     * @returns {Object|null} - El producto actualizado o null si no se encuentra.
     */
    static updateProduct = async (productId, updateData) => {
        try {
            const updatedProduct = await Productos.update(productId, updateData);
            return updatedProduct;
        } catch (error) {
            console.error(`[ProductService] Error al actualizar producto con ID ${productId}:`, error.message);
            throw error;
        }
    }

    /**
     * @description Elimina un producto.
     * @param {number} productId - ID del producto a eliminar.
     * @returns {boolean} - True si se eliminó, false si no se encontró.
     */
    static deleteProduct = async (productId) => {
        try {
            const isDeleted = await Productos.delete(productId);
            return isDeleted;
        } catch (error) {
            console.error(`[ProductService] Error al eliminar producto con ID ${productId}:`, error.message);
            throw error;
        }
    }

    static getProductsByGenero = async (genero) => {
        return await Productos.getByGeneroNombre(genero);
    }

    /**
     * @description Actualiza el stock de un producto.
     * @param {number} productId - ID del producto.
     * @param {number} quantityChange - Cantidad a añadir (positivo) o restar (negativo) del stock.
     * @returns {boolean} - True si el stock fue actualizado, false en caso contrario.
     */
    static updateProductStock = async (productId, quantityChange) => {
        try {
            const product = await Productos.getById(productId);
            if (!product) {
                throw new Error('Producto no encontrado para la actualización de stock.');
            }
            const newStock = product.stock + quantityChange;
            if (newStock < 0) {
                throw new Error('Stock insuficiente para esta operación.');
            }
            // Actualizar solo el campo de stock
            const updated = await Productos.update(productId, { stock: newStock });
            return updated !== null;
        } catch (error) {
            console.error(`[ProductService] Error al actualizar stock para producto ${productId}:`, error.message);
            throw error;
        }
    }
}
export default ProductService;