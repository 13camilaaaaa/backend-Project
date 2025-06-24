// app.js
// Archivo principal de tu aplicación Express (backend)

// 1. Importaciones de módulos y configuraciones
import express from 'express';        // Importa Express.js
import cors from 'cors';              // Importa CORS para permitir solicitudes desde el frontend
import dotenv from 'dotenv';          // Para cargar variables de entorno desde un archivo .env
import connection from './src/utils/db.js'; // Importa la conexión a la base de datos
import path from 'path';              // ¡NUEVO! Módulo 'path' para trabajar con rutas de archivos
import { fileURLToPath } from 'url';  // Para obtener __dirname en módulos ES

// Para obtener __dirname en módulos ES (importante para path.join)
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

// Carga las variables de entorno desde el archivo .env
dotenv.config();

// Crea una instancia de la aplicación Express
const app = express();
// Define el puerto donde se ejecutará el servidor, tomado de las variables de entorno o por defecto 3000
const PORT = process.env.PORT || 3000;

// 2. Middlewares Globales
// Habilita CORS para todas las solicitudes (importante para que el frontend pueda comunicarse)
app.use(cors());
// Parsea las solicitudes entrantes con cargas JSON
app.use(express.json());
// Parsea las solicitudes con cargas de URL-encoded (para formularios HTML si los usas)
app.use(express.urlencoded({ extended: true }));

// --- ¡NUEVO! Configuración para servir archivos estáticos (¡IMÁGENES!) ---
// Esta línea le dice a Express que la carpeta 'uploads' (que está dentro de 'src' en tu backend)
// será accesible públicamente a través de la URL '/uploads'
// Por ejemplo, si tienes una imagen en 'src/uploads/productos/camiseta.jpg',
// se accederá desde el frontend como 'http://localhost:3000/uploads/productos/camiseta.jpg'
app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));
// __dirname apunta a la raíz de tu proyecto backend (donde está app.js)
// path.join(__dirname, 'src', 'uploads') construye la ruta completa a 'tu_proyecto_backend/src/uploads'


// 3. Conexión a la Base de Datos
async function connectDB() {
    try {
        // Intenta obtener una conexión para verificar que la DB está disponible
        const conn = await connection.getConnection();
        conn.release(); // Libera la conexión de vuelta al pool
        console.log('✔ Conexión a la base de datos MySQL establecida correctamente.');
    } catch (error) {
        console.error('✖ Error al conectar a la base de datos:', error.message);
        console.error('Asegúrate de que tu servidor MySQL esté en ejecución y las credenciales sean correctas en .env');
        // No salimos de la aplicación inmediatamente, pero el error es crítico.
        // Podrías añadir lógica de reintento o un mecanismo de alerta aquí.
    }
}
connectDB(); // Llama a la función para conectar a la DB al iniciar la aplicación

// 4. Montaje de Rutas de la API
// Prefijo '/api' para todas las rutas de tu API RESTful
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

// 5. Ruta Raíz (opcional, para verificar que el servidor funciona)
app.get('/', (req, res) => {
    res.send('¡Bienvenido al Backend de tu Tienda de Ropa! La API está en /api');
});

// 6. Manejo Global de Errores (middleware de errores)
// Este middleware se ejecuta cuando un error es propagado por los controladores o servicios
app.use((err, req, res, next) => {
    console.error(err.stack); // Imprime el stack trace del error para depuración
    res.status(500).json({ message: 'Algo salió mal en el servidor!', error: err.message });
});

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
        // Si usas createPool (recomendado), no necesitas cerrar el pool manualmente aquí
        // a menos que tengas un método específico para cerrar todas las conexiones del pool.
    }
    process.exit(0);
});