    import mysql from 'mysql2/promise'; // Importa el paquete mysql2 con soporte de promesas
    import dotenv from 'dotenv';        // Para cargar variables de entorno

    dotenv.config(); // Carga las variables de entorno

    // Configuración de la conexión a la base de datos
    const dbConfig = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'project',
        password: process.env.DB_PASSWORD || 'fullstack2025', // Tu contraseña de MySQL
        database: process.env.DB_NAME || 'project_prototype', // El nombre de tu base de datos
        waitForConnections: true, // Esperar si no hay conexiones disponibles
        connectionLimit: 10,      // Número máximo de conexiones en el pool
        queueLimit: 0             // Cola de conexiones ilimitada (0)
    };

    // Crea un pool de conexiones para manejar múltiples solicitudes de manera eficiente
    const pool = mysql.createPool(dbConfig);

    // Exporta el pool de conexiones
    export default pool;