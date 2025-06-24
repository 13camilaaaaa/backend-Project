// src/middlewares/index.js
// Archivo central para exportar todos los middlewares

export { default as verifyAuth } from './auth/verifyAuth.js';
export { authValidation } from './auth/validation.js';

export { categoriaValidation } from './categorias/validation.js';

export { productoValidation } from './productos/validation.js';

export { ventaValidation } from './ventas/validation.js';

export { default as globalErrorMiddleware } from './globalErrorMiddleware.js';

// ¡NUEVO! Exporta el roleMiddleware
export { default as roleMiddleware } from './roleMiddleware.js'; // ASUMIMOS que está directamente en src/middlewares/
