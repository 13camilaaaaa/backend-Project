import connection from '../utils/db.js';

class Carrito {

    static obtenerCarritoActivo = async (id_usuario) => {
        const [rows] = await connection.query(
            `SELECT * FROM carritos WHERE id_usuario = ? AND estado = 'Activo'`,
            [id_usuario]
        );
        return rows[0] || null;
    };

    static crearCarrito = async (id_usuario) => {
        const [result] = await connection.query(
            `INSERT INTO carritos (id_usuario) VALUES (?)`,
            [id_usuario]
        );
        return { id: result.insertId };
    };

    static obtenerItemCarrito = async (id_carrito, id_producto) => {
        const [rows] = await connection.query(
            `SELECT * FROM items_carrito WHERE id_carrito = ? AND id_producto = ?`,
            [id_carrito, id_producto]
        );
        return rows[0] || null;
    };

    static insertarItemCarrito = async (id_carrito, id_producto, cantidad, precio, talla, color) => {
        await connection.query(
            `INSERT INTO items_carrito (id_carrito, id_producto, cantidad, precio_unitario_al_momento, talla_nombre_al_momento, color_nombre_al_momento)
        VALUES (?, ?, ?, ?, ?, ?)`,
            [id_carrito, id_producto, cantidad, precio, talla, color]
        );
    };

    static actualizarItemCarrito = async (id_item, cantidad, precio, talla, color) => {
        await connection.query(
            `UPDATE items_carrito 
        SET cantidad = ?, precio_unitario_al_momento = ?, talla_nombre_al_momento = ?, color_nombre_al_momento = ? 
        WHERE id = ?`,
            [cantidad, precio, talla, color, id_item]
        );
    };

    // --- NUEVAS FUNCIONES ---

    static actualizarCantidadItemCarrito = async (id_item_carrito, nuevaCantidad) => {
        await connection.query(
            `UPDATE items_carrito SET cantidad = ? WHERE id = ?`,
            [nuevaCantidad, id_item_carrito]
        );
    };

    static eliminarItemCarrito = async (id_item_carrito) => {
        await connection.query(
            `DELETE FROM items_carrito WHERE id = ?`,
            [id_item_carrito]
        );
    };

    static obtenerTodosLosItemsDeUnCarrito = async (id_carrito) => {
        const [rows] = await connection.query(`
            SELECT 
                ic.id,
                ic.id_producto,
                ic.cantidad,
                ic.precio_unitario_al_momento AS precio,
                ic.talla_nombre_al_momento AS talla,
                ic.color_nombre_al_momento AS color,
                p.nombre AS nombre_producto,
                p.imagen,
                p.precio AS precio_actual_producto,
                p.stock
            FROM items_carrito ic
            JOIN productos p ON ic.id_producto = p.id
            WHERE ic.id_carrito = ?
            ORDER BY ic.id DESC;
        `, [id_carrito]);
        return rows;
    };

    static obtenerItemPorId = async (id_item) => {
        const [rows] = await connection.query(
            `SELECT * FROM items_carrito WHERE id = ?`,
            [id_item]
        );
        return rows[0] || null;
    };

    // Añade esta nueva función para eliminar todos los ítems de un carrito por su ID
    static deleteItemsByCarritoId = async (id_carrito, dbConnection = connection) => {
        await dbConnection.query(
            `DELETE FROM items_carrito WHERE id_carrito = ?`,
            [id_carrito]
        );
    };
    
    static delete = async (id_carrito, dbConnection = connection) => {
        await dbConnection.query(
            `DELETE FROM carritos WHERE id = ?`,
            [id_carrito]
        );
    };
}
export default Carrito;