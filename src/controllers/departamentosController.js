import { Departamentos } from "../models/Departamentos.js";

export default {
    getByPais: async (req, res) => {
        const { paisId } = req.params;
        try {
            const deps = await Departamentos.getByPais(paisId);
            res.json({ success: true, data: deps });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Error obteniendo departamentos" });
        }
    }
};
