    import mysql from 'mysql2/promise';
    import dotenv from 'dotenv';

    dotenv.config();

    // Configuración de la conexión a la base de datos
    const dbConfig = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'project',
        password: process.env.DB_PASSWORD || 'fullstack2025',
        database: process.env.DB_NAME || 'project_prototype',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    };

    const pool = mysql.createPool(dbConfig);

    export default pool;