import { body, param, check, validationResult } from 'express-validator';
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

const createOrderValidationRules = [
    body('id_usuario').optional().isInt({ min: 1 }).withMessage('El ID de usuario debe ser un número entero válido si se proporciona.'),
    body('id_direccion_envio').isInt({ min: 1 }).withMessage('El ID de la dirección de envío es obligatorio y debe ser un número entero válido.'),
    body('metodo_pago').trim().notEmpty().withMessage('El método de pago es obligatorio.'),
    body('transaccion_id_pago').optional().trim().notEmpty().withMessage('El ID de transacción no puede estar vacío si se proporciona.'),
    body('comentarios').optional().trim().notEmpty().withMessage('Los comentarios no pueden estar vacíos si se proporcionan.'),

    // Validación del array de productos
    body('productos').isArray({ min: 1 }).withMessage('El pedido debe contener al menos un producto.'),
    check('productos.*.id').isInt({ min: 1 }).withMessage('Cada producto debe tener un ID válido.'),
    check('productos.*.cantidad').isInt({ min: 1 }).withMessage('La cantidad de cada producto debe ser un número entero positivo.'),
];

const getVentaByIdValidationRules = [
    param('id').isInt({ min: 1 }).withMessage('El ID de la venta debe ser un número entero válido.'),
];

const updateVentaStatusValidationRules = [
    param('id').isInt({ min: 1 }).withMessage('El ID de la venta debe ser un número entero válido.'),
    body('estado_pedido').trim().notEmpty().withMessage('El estado del pedido es obligatorio.')
        .isIn(['Pendiente', 'Procesando', 'Enviado', 'Entregado', 'Entregado y Pagado', 'Cancelado', 'Devuelto'])
        .withMessage('Estado de pedido inválido.'),
    body('fecha_pago').optional().isISO8601().toDate().withMessage('La fecha de pago debe ser una fecha y hora válidas (ISO 8601) si se proporciona.'),
];

export const ventaValidation = {
    create: [createOrderValidationRules, validate],
    getById: [getVentaByIdValidationRules, validate],
    updateStatus: [updateVentaStatusValidationRules, validate],
    delete: [getVentaByIdValidationRules, validate],
};
