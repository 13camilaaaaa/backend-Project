// src/routes/usuariosRoutes.js
import express from "express";
import usuariosController from "../controllers/usuariosController.js";

const router = express.Router();

router.put("/:id", usuariosController.actualizarUsuario);
router.put("/:id/direccion", usuariosController.actualizarDireccionUsuario);
router.put('/usuarios/:id/contrasena', usuariosController.actualizarContrasena);
router.put('/usuarios/:id/correo', usuariosController.actualizarCorreo);



export default router;
