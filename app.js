// 1. Importaciones de módulos y configuraciones
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connection from './src/utils/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import pool from './src/utils/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Importa todas tus rutas
import authRoutes from './src/routes/authRoutes.js';
import productosRoutes from './src/routes/productosRoutes.js';
import ventasRoutes from './src/routes/ventasRoutes.js';
import categoriasRoutes from './src/routes/categoriasRoutes.js';
import coloresRoutes from './src/routes/coloresRoutes.js';
import generosRoutes from './src/routes/generosRoutes.js';
import tallasRoutes from './src/routes/tallasRoutes.js';
import tiposIdentificacionRoutes from './src/routes/tiposIdentificacionRoutes.js';
import tiposViaRoutes from './src/routes/tiposViaRoutes.js';
import rolesRoutes from './src/routes/rolesRoutes.js';
import globalErrorMiddleware from './src/middlewares/globalErrorMiddleware.js';
import usuariosRoutes from './src/routes/usuariosRoutes.js';
import paisesRoutes from './src/routes/paisesRoutes.js';
import departamentosRoutes from './src/routes/departamentosRoutes.js';
import ciudadesRoutes from './src/routes/ciudadesRoutes.js';
import cartRoutes from './src/routes/cartRoutes.js';


// Carga las variables de entorno desde el archivo .env
dotenv.config();

// Crea una instancia de la aplicación Express
const app = express();
// Define el puerto donde se ejecutará el servidor, tomado de las variables de entorno o por defecto 3000
const PORT = process.env.PORT || 3000;

// 2. Middlewares Globales
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
// Parsea las solicitudes entrantes con cargas JSON
app.use(express.json());
// Parsea las solicitudes con cargas de URL-encoded
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());


app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));


// 3. Conexión a la Base de Datos
async function iniciarConexionDB() {
    try {
        const conexion = await pool.getConnection();
        conexion.release();
        console.log('✅ Conexión exitosa a la base de datos MySQL.');
    } catch (error) {
        console.error('❌ Error al conectar a la base de datos:', error.message);
        console.error('Asegúrate de que tu servidor MySQL esté en ejecución y las credenciales sean correctas en .env');
        process.exit(1);
    }
}
iniciarConexionDB();

// 4. Montaje de Rutas de la API
app.use('/api/auth', authRoutes); // Rutas para autenticación y usuarios
app.use('/api/productos', productosRoutes); // Rutas para productos
app.use('/api/ventas', ventasRoutes); // Rutas para ventas/pedidos
app.use('/api/categorias', categoriasRoutes); // Rutas para categorías
app.use('/api/colores', coloresRoutes); // Rutas para colores
app.use('/api/generos', generosRoutes); // Rutas para géneros
app.use('/api/tallas', tallasRoutes); // Rutas para tallas
app.use('/api/tipos-identificacion', tiposIdentificacionRoutes); // Rutas para tipos de identificación
app.use('/api/tipos-via', tiposViaRoutes); // Rutas para tipos de vía
app.use('/api/roles', rolesRoutes); // Rutas para roles y asignación de roles
app.use('/api/usuarios', usuariosRoutes); 
app.use('/api/paises', paisesRoutes);
app.use('/api/departamentos', departamentosRoutes);
app.use('/api/ciudades', ciudadesRoutes);
app.use('/api', usuariosRoutes);
app.use('/api/carrito', cartRoutes);

// 5. Ruta Raíz 
app.get('/', (req, res) => {
    res.send('¡Bienvenido al Backend de tu Tienda de Ropa! La API está en /api');
});

// 6. Manejo Global de Errores (middleware de errores)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Algo salió mal en el servidor!', error: err.message });
});

app.use(globalErrorMiddleware);

// 7. Inicio del Servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend escuchando en http://localhost:${PORT}`);
    console.log(`Acceso a tu API en http://localhost:${PORT}/api`);
    console.log(`¡Imágenes disponibles en http://localhost:${PORT}/uploads!`); // Mensaje informativo
});

// Manejo de señales para cerrar la conexión a la DB limpiamente al cerrar la aplicación
process.on('SIGINT', async () => {
    console.log('Cerrando servidor y conexión a la base de datos...');
    if (connection) {
    }
    process.exit(0);
});