import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones } from "./validaciones.js";
import { body, param } from "express-validator";

const router = express.Router();

router.get("/", async (req, res) => {
  const [rows] = await db.execute("SELECT * FROM usuarios");
  // RECORDAR Quitar la contraseña en la api
  res.json({
    success: true,
    data: rows.map((u) => ({ ...u, password_hash: undefined })),
  });
});

router.get("/:id", validarId, verificarValidaciones, async (req, res) => {
  const id = Number(req.params.id);
  const [rows] = await db.execute(
    "SELECT id, username, nombre, apellido, activo FROM usuarios WHERE id=?",
    [id]
  );

  if (rows.length === 0) {
    return res
      .status(404)
      .json({ success: false, message: "Usuario no encontrado" });
  }

  res.json({ success: true, data: rows[0] });
});

router.post("/", (req, res) => {});
router.put("/:id", (req, res) => {});
router.delete("/:id", (req, res) => {});

// Consultar por roles de usuario
router.get("/:id/roles", validarId, verificarValidaciones, async (req, res) => {
  const id = Number(req.params.id);

  // Verificar que exista usuario

  let sql =
    "SELECT r.id, r.nombre \
    FROM roles r \
    JOIN usuarios_roles ur ON r.id = ur.rol_id \
    WHERE ur.usuario_id = ? \
    ORDER BY r.nombre";

  const [rows] = await db.execute(sql, [id]);
  res.json({ success: true, data: rows });
});

// Asignar un rol a un usuario
router.post(
  "/:id/roles",
  validarId,
  body("rolId").isInt({ min: 1 }),
  verificarValidaciones,
  async (req, res) => {
    const usuarioId = Number(req.params.id);
    const rolId = req.body.rolId;

    // Verificar que exista usuario
    // Verificar que exista rol

    let sql = "INSERT INTO usuarios_roles (usuario_id, rol_id) VALUES (?,?)";

    await db.execute(sql, [usuarioId, rolId]);

    res.json({ success: true });
  }
);

// Quitar un rol a un usuario
router.delete(
  "/:id/roles/:rolId",
  validarId,
  param("rolId").isInt({ min: 1 }),
  verificarValidaciones,
  async (req, res) => {
    const usuarioId = Number(req.params.id);
    const rolId = Number(req.params.rolId);

    let sql = "DELETE FROM usuarios_roles WHERE usuario_id=? AND rol_id=?";

    await db.execute(sql, [usuarioId, rolId]);

    res.json({ success: true });
  }
);

export default router;
