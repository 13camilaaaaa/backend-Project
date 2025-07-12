import connection from "../utils/db.js";

export class Paises {
    static getAll = async () => {
        const [rows] = await connection.query(`SELECT id, nombre_pais FROM paises ORDER BY nombre_pais`);
        return rows;
    }
}
