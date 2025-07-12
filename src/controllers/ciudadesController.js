import { Ciudades } from "../models/Ciudades.js";
export default {
    getByDepartamento: async (req, res) => {
        const { departamentoId } = req.params;
        try {
            const ciudades = await Ciudades.getByDepartamento(departamentoId);
            res.json({ success: true, data: ciudades });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Error obteniendo municipios" });
        }
    }
};
