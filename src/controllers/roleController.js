import RoleService from '../services/RoleService.js';
import ResponseProvider from '../providers/ResponseProvider.js';
class RoleController {
    /**
     * @description Obtiene todos los roles.
     * @param {Object} req - Objeto de solicitud de Express.
     * @param {Object} res - Objeto de respuesta de Express.
     */
    async getAllRoles(req, res) {
        try {
            const roles = await RoleService.getAllRoles();
            ResponseProvider.success(res, 200, 'Roles obtenidos exitosamente.', roles);
        } catch (error) {
            console.error('[roleController] Error al obtener roles:', error.message);
            ResponseProvider.internalError(res, 'Error interno del servidor al obtener roles.');
        }
    }

    /**
     * @description Obtiene un rol por su ID.
     * @param {Object} req - Objeto de solicitud de Express.
     * @param {Object} res - Objeto de respuesta de Express.
     */
    async getRoleById(req, res) {
        try {
            const roleId = parseInt(req.params.id);
            if (isNaN(roleId)) {
                return ResponseProvider.badRequest(res, 'ID de rol inválido.');
            }

            const role = await RoleService.getRoleById(roleId);
            if (!role) {
                return ResponseProvider.notFound(res, 'Rol no encontrado.');
            }
            ResponseProvider.success(res, 200, 'Rol obtenido exitosamente.', role);
        } catch (error) {
            console.error(`[roleController] Error al obtener rol ${req.params.id}:`, error.message);
            ResponseProvider.internalError(res, 'Error interno del servidor al obtener el rol.');
        }
    }

    /**
     * @description Asigna un rol a un usuario.
     * @param {Object} req - Objeto de solicitud de Express.
     * @param {Object} res - Objeto de respuesta de Express.
     */
    async assignRoleToUser(req, res) {
        try {
            const { userId, roleId } = req.body;
            if (isNaN(userId) || isNaN(roleId)) {
                return ResponseProvider.badRequest(res, 'IDs de usuario o rol inválidos.');
            }
            const result = await RoleService.assignRoleToUser(userId, roleId);
            ResponseProvider.success(res, 201, result.message, result);
        } catch (error) {
            console.error('[roleController] Error al asignar rol a usuario:', error.message);
            ResponseProvider.internalError(res, 'Error interno del servidor al asignar el rol.');
        }
    }

    /**
     * @description Obtiene todos los roles de un usuario específico.
     * @param {Object} req - Objeto de solicitud de Express.
     * @param {Object} res - Objeto de respuesta de Express.
     */
    async getRolesByUserId(req, res) {
        try {
            const userId = parseInt(req.params.id);
            if (isNaN(userId)) {
                return ResponseProvider.badRequest(res, 'ID de usuario inválido.');
            }
            const roles = await RoleService.getRolesByUserId(userId);
            if (!roles || roles.length === 0) {
                return ResponseProvider.notFound(res, 'No se encontraron roles para este usuario.');
            }
            ResponseProvider.success(res, 200, 'Roles del usuario obtenidos exitosamente.', roles);
        } catch (error) {
            console.error(`[roleController] Error al obtener roles para el usuario ${req.params.id}:`, error.message);
            ResponseProvider.internalError(res, 'Error interno del servidor al obtener los roles del usuario.');
        }
    }
}
export default new RoleController();

