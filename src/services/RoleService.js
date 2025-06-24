// src/services/RoleService.js
import Roles from '../models/Roles.js'; // Importa el modelo Roles
import UsuariosRol from '../models/UsuariosRol.js'; // Importa el modelo UsuarioRol

class RoleService {
    /**
     * @description Obtiene todos los roles disponibles.
     * @returns {Array} - Un array de objetos de rol.
     */
    async getAllRoles() {
        try {
            const roles = await Roles.getAll();
            return roles;
        } catch (error) {
            console.error('[RoleService] Error al obtener todos los roles:', error.message);
            throw error;
        }
    }

    /**
     * @description Obtiene un rol específico por su ID.
     * @param {number} roleId - El ID del rol.
     * @returns {Object|null} - El objeto de rol o null si no se encuentra.
     */
    async getRoleById(roleId) {
        try {
            const role = await Roles.getById(roleId);
            return role;
        } catch (error) {
            console.error(`[RoleService] Error al obtener rol con ID ${roleId}:`, error.message);
            throw error;
        }
    }

    /**
     * @description Asigna un rol a un usuario.
     * @param {number} userId - ID del usuario.
     * @param {number} roleId - ID del rol a asignar.
     * @returns {Object} - Resultado de la asignación.
     */
    async assignRoleToUser(userId, roleId) {
        try {
            // Aquí podrías validar si el usuario y el rol existen antes de asignar
            const result = await UsuariosRol.assignRole(userId, roleId);
            return result;
        } catch (error) {
            console.error(`[RoleService] Error al asignar rol ${roleId} a usuario ${userId}:`, error.message);
            throw error;
        }
    }

    /**
     * @description Obtiene todos los roles asignados a un usuario específico.
     * @param {number} userId - ID del usuario.
     * @returns {Array} - Array de roles del usuario.
     */
    async getRolesByUserId(userId) {
        try {
            const roles = await UsuariosRol.getRolesByUserId(userId);
            return roles;
        } catch (error) {
            console.error(`[RoleService] Error al obtener roles para usuario ${userId}:`, error.message);
            throw error;
        }
    }

    // Opcional: Métodos para crear, actualizar, eliminar roles y remover asignaciones de rol
}

export default new RoleService();
