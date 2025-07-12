import connection from "../utils/db.js";

export class Ciudades {
    static getByDepartamento = async (id_departamento) => {
        const [rows] = await connection.query(
            `SELECT id, nombre_ciudad FROM ciudades WHERE id_departamento = ? ORDER BY nombre_ciudad`,
            [id_departamento]
        );
        return rows;
    }
}
