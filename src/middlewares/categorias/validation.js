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

const createCategoryValidationRules = [
    body('nombre_categoria').trim().notEmpty().withMessage('El nombre de la categoría es obligatorio.')
        .isLength({ min: 3, max: 100 }).withMessage('El nombre de la categoría debe tener entre 3 y 100 caracteres.'),
];

const getCategoryByIdValidationRules = [
    param('id').isInt({ min: 1 }).withMessage('El ID de la categoría debe ser un número entero válido.'),
];

export const categoriaValidation = {
    create: [createCategoryValidationRules, validate],
    getById: [getCategoryByIdValidationRules, validate],
};