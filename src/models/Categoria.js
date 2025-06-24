// src/models/Categoria.js
import connection from '../utils/db.js';

class Categoria {

    async getAll() {
        try {
            const [rows] = await connection.query('SELECT * FROM categorias ORDER BY nombre_categoria ASC');
            return rows;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw new Error('Error al obtener las categorías.');
        }
    }
    async getById(id) {
        try {
            const [rows] = await connection.query('SELECT * FROM categorias WHERE id = ?', [id]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error(`Error fetching category with ID ${id}:`, error);
            throw new Error('Error al obtener la categoría.');
        }
    }
    // Métodos para crear, actualizar, eliminar categorías si son necesarios
    async create(nombre_categoria) {
        try {
            const [result] = await connection.query('INSERT INTO categorias (nombre_categoria) VALUES (?)', [nombre_categoria]);
            return { id: result.insertId, nombre_categoria };
        } catch (error) {
            console.error('Error creating category:', error);
            throw new Error('Error al crear la categoría.');
        }
    }
}

export default new Categoria();