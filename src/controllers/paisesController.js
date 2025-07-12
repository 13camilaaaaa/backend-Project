import { Paises } from "../models/Paises.js";
export default {
    getAll: async (req, res) => {
        try {
            const paises = await Paises.getAll();
            res.json({ success: true, data: paises });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Error obteniendo países" });
        }
    }
};
