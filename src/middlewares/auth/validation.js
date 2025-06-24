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
    body('numero_identificacion').trim().notEmpty().withMessage('El número de identificación es obligatorio.'),
    body('id_tipo_identificacion').isInt({ min: 1 }).withMessage('El tipo de identificación es obligatorio y debe ser un número válido.'),
    body('nombre_usuario').trim().notEmpty().withMessage('El nombre de usuario es obligatorio.'),
    body('apellido_usuario').trim().optional().notEmpty().withMessage('El apellido de usuario no puede estar vacío si se proporciona.'),
    body('correo_usuario').isEmail().withMessage('El correo electrónico debe ser válido.').normalizeEmail(),
    body('contrasena').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),
    body('telefono_usuario').trim().optional().notEmpty().withMessage('El teléfono no puede estar vacío si se proporciona.'),
    
    // Validación de la dirección (que viene dentro de un objeto 'direccion')
    body('direccion.id_tipo_via').isInt({ min: 1 }).withMessage('El tipo de vía de la dirección es obligatorio y debe ser un número válido.'),
    body('direccion.numero_via').trim().notEmpty().withMessage('El número de vía de la dirección es obligatorio.'),
    body('direccion.ciudad').trim().notEmpty().withMessage('La ciudad de la dirección es obligatoria.'),
    body('direccion.complemento').trim().optional().notEmpty().withMessage('El complemento de la dirección no puede estar vacío si se proporciona.'),
    body('direccion.barrio').trim().optional().notEmpty().withMessage('El barrio de la dirección no puede estar vacío si se proporciona.'),
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