import { body, param, validationResult } from 'express-validator';
import ResponseProvider from '../../providers/ResponseProvider.js';

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

    return ResponseProvider.badRequest(res, 'Errores de validación.', extractedErrors);
};

const createProductValidationRules = [
    body('nombre').trim().notEmpty().withMessage('El nombre del producto es obligatorio.'),
    body('descripcion').trim().optional().notEmpty().withMessage('La descripción no puede estar vacía si se proporciona.'),
    body('precio').isFloat({ gt: 0 }).withMessage('El precio debe ser un número mayor que cero.'),
    body('stock').isInt({ min: 0 }).withMessage('El stock debe ser un número entero no negativo.'),
    body('imagen').optional().isURL().withMessage('La URL de la imagen debe ser válida si se proporciona.'),
    body('id_talla').isInt({ min: 1 }).withMessage('El ID de la talla es obligatorio y debe ser un número entero válido.'),
    body('id_genero').isInt({ min: 1 }).withMessage('El ID del género es obligatorio y debe ser un número entero válido.'),
    body('id_categoria').isInt({ min: 1 }).withMessage('El ID de la categoría es obligatorio y debe ser un número entero válido.'),
    body('id_color').isInt({ min: 1 }).withMessage('El ID del color es obligatorio y debe ser un número entero válido.'),
];

const getProductByIdValidationRules = [
    param('id').isInt({ min: 1 }).withMessage('El ID del producto debe ser un número entero válido.'),
];

// las reglas del tema del ID son temas que no se necesitan tener presente --------___-

const updateProductValidationRules = [
    param('id').isInt({ min: 1 }).withMessage('El ID del producto debe ser un número entero válido.'),
    // Para actualizaciones, los campos son opcionales, pero si se proporcionan, deben ser válidos
    body('nombre').optional().trim().notEmpty().withMessage('El nombre no puede estar vacío si se proporciona.'),
    body('descripcion').optional().trim().notEmpty().withMessage('La descripción no puede estar vacía si se proporciona.'),
    body('precio').optional().isFloat({ gt: 0 }).withMessage('El precio debe ser un número mayor que cero si se proporciona.'),
    body('stock').optional().isInt({ min: 0 }).withMessage('El stock debe ser un número entero no negativo si se proporciona.'),
    body('imagen').optional().isURL().withMessage('La URL de la imagen debe ser válida si se proporciona.'),
    body('id_talla').optional().isInt({ min: 1 }).withMessage('El ID de la talla debe ser un número entero válido si se proporciona.'),
    body('id_genero').optional().isInt({ min: 1 }).withMessage('El ID del género debe ser un número entero válido si se proporciona.'),
    body('id_categoria').optional().isInt({ min: 1 }).withMessage('El ID de la categoría debe ser un número entero válido si se proporciona.'),
    body('id_color').optional().isInt({ min: 1 }).withMessage('El ID del color debe ser un número entero válido si se proporciona.'),
];

export const productoValidation = {
    create: [createProductValidationRules, validate],
    getById: [getProductByIdValidationRules, validate],
    update: [updateProductValidationRules, validate],
    delete: [getProductByIdValidationRules, validate], // Reutilizamos para la validación del ID
};