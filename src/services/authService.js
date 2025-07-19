import { Usuarios } from '../models/Usuarios.js';
import bcrypt from 'bcryptjs';

class AuthService {
    /**
     * @description Registra un nuevo usuario, incluyendo la creación de su dirección.
     * Esta función maneja la lógica de negocio para el registro.
     * @param {Object} userData - Datos del usuario y su dirección.
     * @param {string} userData.numero_identificacion
     * @param {number} userData.id_tipo_identificacion
     * @param {string} userData.nombre_usuario
     * @param {string} [userData.apellido_usuario]
     * @param {string} userData.contrasena - Contraseña en texto plano.
     * @param {string} userData.correo_usuario
     * @param {string} [userData.telefono_usuario]
     * @param {Object} userData.direccion - Objeto con los datos de la dirección.
     * @returns {number} - El ID del usuario recién registrado.
     */
    static registerUser = async(userData)  => {
        try {
            const {
                nombre_usuario,
                apellido_usuario,
                contrasena,
                correo_usuario,
                telefono_usuario,
            } = userData;
            // Verificar si el correo ya está registrado
            const existingUser = await Usuarios.findByEmail(correo_usuario);
            if (existingUser) {
                throw new Error('El correo electrónico ya está registrado.');
            }
            // 2. Hashear la contraseña
            const hashedPassword = await bcrypt.hash(contrasena, 10); // 10 es el costo de salting
            // 4. Crear el usuario, vinculándolo a la dirección
            const newUserId = await Usuarios.create(
                nombre_usuario,
                apellido_usuario,
                hashedPassword,
                correo_usuario,
                telefono_usuario
            );
            return newUserId;
        } catch (error) {
            console.error('[AuthService] Error al registrar usuario:', error.message);
            throw error;
        }
    }

    /**
     * @description Verifica las credenciales de un usuario para el inicio de sesión.
     * @param {string} email - Correo electrónico del usuario.
     * @param {string} password - Contraseña en texto plano.
     * @returns {Object|null} - El objeto usuario (sin contraseña) si las credenciales son válidas, o null.
     */
    static loginUser = async(email, password) => {
        try {
            // Buscar el usuario por email, incluyendo la contraseña hasheada para verificación
            const user = await Usuarios.findByEmail(email, true); // Pasar true para incluir la contraseña
            if (!user) {
                return null; // Usuario no encontrado
            }
            // Comparar la contraseña proporcionada con la hasheada en la base de datos
            const isMatch = await bcrypt.compare(password, user.contrasena);
            if (!isMatch) {
                return null; // Contraseña incorrecta
            }
            // Eliminar la contraseña del objeto usuario antes de devolverlo por seguridad
            delete user.contrasena;
            return user; // Retorna el usuario sin la contraseña
        } catch (error) {
            console.error('[AuthService] Error en el login del usuario:', error.message);
            throw error;
        }
    }

    /**
     * @description Busca un usuario por su ID.
     * @param {number} userId - ID del usuario.
     * @returns {Object|null} - El objeto usuario o null si no se encuentra.
     */
    static getUserById = async(userId)  => {
        try {
            const user = await Usuarios.getById(userId);
            return user;
        } catch (error) {
            console.error(`[AuthService] Error al obtener usuario con ID ${userId}:`, error.message);
            throw error;
        }
    }

    /**
     * @description Actualiza el token de refresco de un usuario.
     * @param {number} userId - ID del usuario.
     * @param {string|null} refreshToken - Token de refresco o null para limpiar.
     */
    static updateRefreshToken = async(userId, refreshToken) => {
        try {
            await Usuarios.updateRefreshToken(userId, refreshToken);
        } catch (error) {
            console.error(`[AuthService] Error al actualizar refresh token para usuario ${userId}:`, error.message);
            throw error;
        }
    }

    static actualizarContrasena = async (id, nuevaContrasenaPlano) => {
    try {
        const hashedPassword = await bcrypt.hash(nuevaContrasenaPlano, 10); // encripta la nueva contraseña
        const resultado = await Usuarios.actualizarContrasena(id, hashedPassword);
        return resultado; // true si se actualizó, false si no se encontró el usuario
    } catch (error) {
        console.error("[AuthService] Error al actualizar la contraseña:", error.message);
        throw error;
    }
};
}

export default AuthService;