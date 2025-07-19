import Direccion from '../models/Direccion.js';

class DireccionService {
    /**
     * @description Crea una nueva dirección.
     * @param {Object} direccionData - Datos de la dirección.
     * @returns {number} - El ID de la dirección creada.
     */
    async createAddress(direccionData) {
        try {
            const { id_tipo_via, numero_via, complemento, barrio, ciudad } = direccionData;
            const newAddressId = await Direccion.create(id_tipo_via, numero_via, complemento, barrio, ciudad);
            return newAddressId;
        } catch (error) {
            console.error('[DireccionService] Error al crear dirección:', error.message);
            throw error;
        }
    }

    /**
     * @description Obtiene una dirección por su ID.
     * @param {number} addressId - El ID de la dirección.
     * @returns {Object|null} - El objeto de dirección o null si no se encuentra.
     */
    async getAddressById(addressId) {
        try {
            const address = await Direccion.getById(addressId);
            return address;
        } catch (error) {
            console.error(`[DireccionService] Error al obtener dirección con ID ${addressId}:`, error.message);
            throw error;
        }
    }
}

export default new DireccionService();