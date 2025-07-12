import connection from "../utils/db.js";

export class Departamentos {
    static getByPais = async (id_pais) => {
        const [rows] = await connection.query(
            `SELECT id, nombre_departamento FROM departamentos WHERE id_pais = ? ORDER BY nombre_departamento`,
            [id_pais]
        );
        return rows;
    }
}
