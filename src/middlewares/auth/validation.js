// src/middlewares/auth/validation.js
import { body, validationResult } from 'express-validator';
import ResponseProvider from '../../providers/ResponseProvider.js';

/**
 * @description Middleware para validar los resultados de express-validator.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar el control al siguiente middleware o ruta.
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

    return ResponseProvider.badRequest(res, 'Errores de validación.', extractedErrors);
};

// Reglas de validación para el registro de usuarios
const registerValidationRules = [
    body('nombre_usuario').trim().notEmpty().withMessage('El nombre de usuario es obligatorio.'),
    body('apellido_usuario').trim().optional().notEmpty().withMessage('El apellido de usuario no puede estar vacío si se proporciona.'),
    body('correo_usuario').isEmail().withMessage('El correo electrónico debe ser válido.').normalizeEmail(),
    body('contrasena').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),
    body('telefono_usuario').trim().optional().notEmpty().withMessage('El teléfono no puede estar vacío si se proporciona.'),
];

// Reglas de validación para el inicio de sesión
const loginValidationRules = [
    body('correo_usuario').isEmail().withMessage('El correo electrónico debe ser válido.').normalizeEmail(),
    body('contrasena').notEmpty().withMessage('La contraseña es obligatoria.'),
];

export const authValidation = {
    register: [registerValidationRules, validate],
    login: [loginValidationRules, validate],
};