import bcrypt from "bcryptjs";
// src/controllers/usuariosController.js
import { Usuarios } from "../models/Usuarios.js";
import connection from '../utils/db.js';
import AuthService from '../services/AuthService.js';



class UsuariosController {

    static actualizarUsuario = async (req, res) => {
        const id = req.params.id;
        const { nombre_usuario, apellido_usuario, numero_identificacion, telefono_usuario, id_tipo_identificacion } = req.body;

        try {
            // 1. Verificar si el numero_identificacion ya existe para OTRO usuario
            const existingUser = await Usuarios.findByNumeroIdentificacion(numero_identificacion);

            // Si se encontró un usuario con ese número de identificación
            // Y el ID de ese usuario NO es el mismo que el ID del usuario que estamos actualizando
            if (existingUser && String(existingUser.id) !== String(id)) {
                return res.status(409).json({ success: false, message: 'El número de identificación ya está registrado para otro usuario.' });
            }

            // 2. Si no hay duplicados con otros usuarios, o el número pertenece al mismo usuario,
            //    proceder con la actualización.
            const result = await Usuarios.update(id, {
                nombre_usuario,
                apellido_usuario,
                numero_identificacion,
                telefono_usuario,
                id_tipo_identificacion
            });

            // result.affectedRows > 0 indica que la actualización se realizó
            if (result.affectedRows > 0) {
                res.status(200).json({ success: true, message: "Usuario actualizado correctamente." });
            } else {
                // Esto puede ocurrir si el ID no existe o si los datos enviados son idénticos a los actuales
                res.status(400).json({ success: false, message: "No se realizaron cambios o el usuario no fue encontrado." });
            }
        } catch (error) {
            console.error("Error al actualizar el usuario:", error);

            // *** CRÍTICO: Manejar el error de duplicado de MySQL específicamente ***
            if (error.code === 'ER_DUP_ENTRY') {
                // Este error indica una violación de una restricción UNIQUE en la DB.
                // Podría ser numero_identificacion o cualquier otra columna UNIQUE.
                // Si la validación previa no lo atrapó, esta es una buena medida de seguridad.
                return res.status(409).json({ success: false, message: "El número de identificación ya está registrado." });
            }

            // Manejo de otros errores no relacionados con duplicados
            res.status(500).json({ success: false, message: "Error interno del servidor al actualizar el usuario." });
        }
    }

    static actualizarDireccionUsuario = async (req, res) => {
        const idUsuario = req.params.id;
        const {
            id_tipo_via,
            numero_via,
            complemento,
            barrio,
            id_ciudad,
        } = req.body;

        try {
            // Validar campos obligatorios
            if (!id_tipo_via || !numero_via || !barrio || !id_ciudad) {
                return res.status(400).json({ success: false, message: "Faltan datos obligatorios de dirección." });
            }

            // Insertar nueva dirección
            const [result] = await connection.query(
                `INSERT INTO direcciones (id_tipo_via, numero_via, complemento, barrio, id_ciudad)
            VALUES (?, ?, ?, ?, ?)`,
                [id_tipo_via, numero_via, complemento || null, barrio, id_ciudad]
            );

            const nuevaDireccionId = result.insertId;

            // asociar la nueva dirección al usuario
            await Usuarios.actualizarDireccion(idUsuario, nuevaDireccionId);

            // consultar datos completos de la dirección recién insertada
            const [info] = await connection.query(`
            SELECT 
                p.id AS id_pais, p.nombre_pais,
                d.id AS id_departamento, d.nombre_departamento,
                c.id AS id_ciudad, c.nombre_ciudad,
                tv.id AS id_tipo_via, tv.nombre_tipo_via,
                dir.numero_via, dir.complemento, dir.barrio
            FROM direcciones dir
            JOIN ciudades c ON dir.id_ciudad = c.id
            JOIN departamentos d ON c.id_departamento = d.id
            JOIN paises p ON d.id_pais = p.id
            JOIN tipos_via tv ON dir.id_tipo_via = tv.id
            WHERE dir.id = ?
        `, [nuevaDireccionId]);

            if (!info.length) {
                return res.status(500).json({ success: false, message: "No se pudo recuperar la dirección completa." });
            }

            const direccion = info[0];

            return res.status(200).json({
                success: true,
                message: "Dirección actualizada correctamente.",
                data: {
                    direccion_pais: direccion.id_pais,
                    nombre_pais: direccion.nombre_pais,
                    direccion_departamento: direccion.id_departamento,
                    nombre_departamento: direccion.nombre_departamento,
                    direccion_ciudad: direccion.id_ciudad,
                    nombre_ciudad: direccion.nombre_ciudad,
                    direccion_tipo_via: direccion.id_tipo_via,
                    nombre_tipo_via: direccion.nombre_tipo_via,
                    direccion_numero_via: direccion.numero_via,
                    direccion_complemento: direccion.complemento,
                    direccion_barrio: direccion.barrio
                }
            });

        } catch (error) {
            console.error("Error al actualizar dirección del usuario:", error);
            return res.status(500).json({ success: false, message: "Error al actualizar la dirección." });
        }
    };


    static actualizarContrasena = async (req, res) => {
        const { id } = req.params;
        const { contrasena } = req.body;

        if (!contrasena || contrasena.length < 8) {
            return res.status(400).json({ message: "Contraseña inválida o demasiado corta." });
        }

        try {
            const actualizado = await AuthService.actualizarContrasena(id, contrasena);
            if (!actualizado) {
                return res.status(404).json({ message: "Usuario no encontrado." });
            }

            res.status(200).json({ success: true, message: "Contraseña actualizada correctamente." });
        } catch (error) {
            console.error("Error al actualizar contraseña:", error);
            res.status(500).json({ message: "Error al actualizar la contraseña." });
        }
    };

    static actualizarCorreo = async (req, res) => {
        const { id } = req.params;
        const { nuevo_correo } = req.body;

        if (!nuevo_correo || !nuevo_correo.includes("@")) {
            return res.status(400).json({ message: "Correo inválido." });
        }

        try {
            const actualizado = await Usuarios.actualizarCorreo(id, nuevo_correo);
            if (!actualizado) {
                return res.status(404).json({ message: "Usuario no encontrado." });
            }

            res.status(200).json({ success: true, message: "Correo actualizado correctamente." });
        } catch (error) {
            console.error("Error al actualizar correo:", error.message);
            res.status(500).json({ message: "Error al actualizar el correo." });
        }
    };


};

export default UsuariosController;

