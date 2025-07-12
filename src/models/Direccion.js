// src/models/Direccion.js
import connection from '../utils/db.js';

class Direccion {
    /**
     * @description Crea una nueva dirección en la base de datos.
     * @param {number} id_tipo_via - ID del tipo de vía.
     * @param {string} numero_via - Número de la vía (ej. #16-09).
     * @param {string} complemento - Complemento de la dirección (ej. Apto 301).
     * @param {string} barrio - Nombre del barrio.
     * @param {string} ciudad - Nombre de la ciudad.
     * @returns {number} - El ID de la dirección recién creada.
     */
    async create(id_tipo_via, numero_via, complemento, barrio, ciudad) {
        try {
            const [result] = await connection.query(
                `INSERT INTO direcciones (id_tipo_via, numero_via, complemento, barrio, ciudad)
                VALUES (?, ?, ?, ?, ?)`,
                [id_tipo_via, numero_via, complemento, barrio, ciudad]
            );
            return result.insertId;
        } catch (error) {
            console.error('Error al crear la dirección:', error);
            throw new Error('Error al crear la dirección.');
        }
    }

    /**
     * @description Obtiene una dirección por su ID, incluyendo el nombre del tipo de vía.
     * @param {number} id - El ID de la dirección.
     * @returns {Object|null} - El objeto de dirección o null si no se encuentra.
     */
    async getById(id) {
        try {
            const query = `
                SELECT
                    d.id,
                    d.numero_via,
                    d.complemento,
                    d.barrio,
                    d.ciudad,
                    tv.nombre_tipo_via AS tipo_via_nombre
                FROM
                    direcciones d
                JOIN
                    tipos_via tv ON d.id_tipo_via = tv.id
                WHERE d.id = ?;
            `;
            const [rows] = await connection.query(query, [id]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error(`Error al obtener dirección con ID ${id}:`, error);
            throw new Error('Error al obtener la dirección.');
        }
    }

    /**
     * @description Valida si los datos de una dirección son válidos.
     * @param {object} direccionData - Objeto con los datos de la dirección.
     * @returns {boolean} - True si los datos son válidos, false en caso contrario.
     */
    static isValid(direccionData) {
        if (!direccionData || typeof direccionData !== 'object') {
            console.error("Los datos de la dirección son inválidos.");
            return false;
        }
        if (typeof direccionData.id_tipo_via !== 'number' || direccionData.id_tipo_via <= 0) {
            console.error("ID de tipo de vía inválido.");
            return false;
        }
        if (typeof direccionData.numero_via !== 'string' || direccionData.numero_via.trim() === '') {
            console.error("Número de vía inválido.");
            return false;
        }
        if (typeof direccionData.ciudad !== 'string' || direccionData.ciudad.trim() === '') {
            console.error("Ciudad inválida.");
            return false;
        }
        // Complemento y barrio pueden ser opcionales, así que no se validan como obligatorios aquí.
        return true;
    }
}

export default new Direccion();