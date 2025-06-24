    import mysql from 'mysql2/promise'; // Importa el paquete mysql2 con soporte de promesas
    import dotenv from 'dotenv';        // Para cargar variables de entorno

    dotenv.config(); // Carga las variables de entorno

    // Configuración de la conexión a la base de datos
    const dbConfig = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '', // Tu contraseña de MySQL
        database: process.env.DB_NAME || 'nombre_de_tu_db', // El nombre de tu base de datos
        waitForConnections: true, // Esperar si no hay conexiones disponibles
        connectionLimit: 10,      // Número máximo de conexiones en el pool
        queueLimit: 0             // Cola de conexiones ilimitada (0)
    };

    // Crea un pool de conexiones para manejar múltiples solicitudes de manera eficiente
    const pool = mysql.createPool(dbConfig);

    /**
     * @description Middleware para probar la conexión a la base de datos (opcional).
     * Puedes usarlo en tu app.js para verificar la conexión al inicio.
     */
    async function testDbConnection() {
        try {
            const connection = await pool.getConnection();
            connection.release(); // Libera la conexión de vuelta al pool
            console.log('✅ Conexión al pool de la base de datos exitosa.');
        } catch (error) {
            console.error('❌ Error al conectar al pool de la base de datos:', error.message);
            // Si hay un error, puedes relanzarlo o manejarlo según tu estrategia de aplicación.
            throw error;
        }
    }

    // Exporta el pool de conexiones
    export default pool;