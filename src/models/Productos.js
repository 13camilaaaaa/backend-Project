// src/models/Producto.js
import connection from '../utils/db.js';

class Productos {
    /**
     * @description Obtiene todos los productos con los nombres descriptivos de sus atributos relacionados.
     * @returns {Array} - Un array de objetos de producto.
     */
    static getAll = async () => {
        try {
            const query = `
                SELECT
                    p.id,
                    p.nombre,
                    p.descripcion,
                    p.precio,
                    p.stock,
                    p.imagen,
                    p.fecha_ingreso,
                    p.ultima_actualizacion,
                    t.nombre_talla AS talla_nombre,
                    g.nombre_genero AS genero_nombre,
                    c.nombre_categoria AS categoria_nombre,
                    co.nombre_color AS color_nombre
                FROM
                    productos p
                INNER JOIN
                    tallas t ON p.id_talla = t.id
                INNER JOIN
                    generos g ON p.id_genero = g.id
                INNER JOIN
                    categorias c ON p.id_categoria = c.id
                INNER JOIN
                    colores co ON p.id_color = co.id
                ORDER BY p.nombre ASC;
            `;
            const [rows] = await connection.query(query);
            return rows;
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw new Error('Error al obtener el listado de productos.'); // Lanza un error genérico para el controlador
        }
    }

    /**
     * @description Obtiene un producto por su ID con los nombres descriptivos de sus atributos relacionados.
     * @param {number} id - El ID del producto.
     * @returns {Object|null} - El objeto de producto o null si no se encuentra.
     */
    static getById = async (id) => {
        try {
            const query = `
                SELECT
                    p.id,
                    p.nombre,
                    p.descripcion,
                    p.precio,
                    p.stock,
                    p.imagen,
                    p.fecha_ingreso,
                    p.ultima_actualizacion,
                    t.nombre_talla AS talla_nombre,
                    g.nombre_genero AS genero_nombre,
                    c.nombre_categoria AS categoria_nombre,
                    co.nombre_color AS color_nombre
                FROM
                    productos p
                INNER JOIN
                    tallas t ON p.id_talla = t.id
                INNER JOIN
                    generos g ON p.id_genero = g.id
                INNER JOIN
                    categorias c ON p.id_categoria = c.id
                INNER JOIN
                    colores co ON p.id_color = co.id
                WHERE p.id = ?;
            `;
            const [rows] = await connection.query(query, [id]);
            return rows.length > 0 ? rows[0] : null; // Devuelve el primer resultado o null
        } catch (error) {
            console.error(`Error al obtener el producto con ID ${id}:`, error);
            throw new Error('Error al obtener el producto.');
        }
    }

    /**
     * @description Crea un nuevo producto.
     * @param {string} nombre - Nombre del producto.
     * @param {string} descripcion - Descripción del producto.
     * @param {number} precio - Precio del producto.
     * @param {number} stock - Cantidad en stock.
     * @param {string} imagen - URL de la imagen del producto.
     * @param {number} id_talla - ID de la talla.
     * @param {number} id_genero - ID del género.
     * @param {number} id_categoria - ID de la categoría.
     * @param {number} id_color - ID del color.
     * @returns {Object} - Objeto del producto creado con su ID.
     */
    static create = async (nombre, descripcion, precio, stock, imagen, id_talla, id_genero, id_categoria, id_color) => {
        try {
            const [result] = await connection.query(
                `INSERT INTO productos (nombre, descripcion, precio, stock, imagen, id_talla, id_genero, id_categoria, id_color)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [nombre, descripcion, precio, stock, imagen, id_talla, id_genero, id_categoria, id_color]
            );
            return {
                id: result.insertId,
                nombre,
                descripcion,
                precio,
                stock,
                imagen,
                id_talla,
                id_genero,
                id_categoria,
                id_color
            };
        } catch (error) {
            console.error('Error al crear el producto:', error);
            throw new Error('Error al crear el producto.');
        }
    }

    /**
     * @description Actualiza uno o más campos de un producto.
     * @param {number} id - El ID del producto a actualizar.
     * @param {Object} campos - Objeto con los campos a actualizar (ej. { nombre: 'Nuevo Nombre', stock: 50 }).
     * @returns {Object|null} - Objeto con el ID y los campos actualizados, o null si no se encontró el producto.
     */
    static update = async (id, campos) => {
        try {
            let query = 'UPDATE productos SET';
            const params = [];
            const updates = [];

            for (const [key, value] of Object.entries(campos)) {
                updates.push(`${key} = ?`);
                params.push(value);
            }

            query += ` ${updates.join(', ')}, ultima_actualizacion = NOW() WHERE id = ?`;
            params.push(id);

            const [result] = await connection.query(query, params);
            return result.affectedRows > 0 ? { id, ...campos } : null;
        } catch (error) {
            console.error(`Error al actualizar el producto con ID ${id}:`, error);
            throw new new Error('Error al actualizar el producto.');
        }
    }

    static getByGeneroNombre = async(nombreGenero) => {
        try {
            const query = `
            SELECT
                p.*,
                g.nombre_genero AS genero_nombre
            FROM productos p
            INNER JOIN generos g ON p.id_genero = g.id
            WHERE g.nombre_genero = ?;
        `;
            const [rows] = await connection.query(query, [nombreGenero]);
            return rows;
        } catch (error) {
            console.error('[Productos] Error en getByGeneroNombre:', error);
            throw error;
        }
    }


    /**
     * @description Elimina un producto por su ID.
     * @param {number} id - El ID del producto a eliminar.
     * @returns {boolean} - True si la eliminación fue exitosa, false si el producto no se encontró.
     */
    static delete = async (id) => {
        try {
            const [result] = await connection.query('DELETE FROM productos WHERE id = ?', [id]);
            // Devuelve true si se eliminó al menos una fila
            return result.affectedRows > 0;
        } catch (error) {
            console.error(`Error al eliminar el producto con ID ${id}:`, error);
            throw new Error('Error al eliminar el producto.'); // Lanza un error al controlador
        }
    }

        static updateStock = async (productoId, cantidadCambio, conn) => {
        try {
            const [result] = await conn.query(
                `UPDATE productos SET stock = stock + ? WHERE id = ?`,
                [cantidadCambio, productoId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error(`Error al actualizar stock del producto ${productoId}:`, error);
            throw new Error('Error al actualizar el stock del producto.');
        }
    }

}

export default Productos; // Exporta una instancia de la clase