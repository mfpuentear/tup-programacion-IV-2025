import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones } from "./validaciones.js";
import { body } from "express-validator";

const router = express.Router();

// Validaciones
const validarCategoria = [
  body("nombre").isAlpha("es-ES", { ignore: " " }).isLength({ max: 50 }),
];

router.get("/", async (req, res) => {
  const [rows] = await db.execute("SELECT * FROM categorias");
  res.json({ success: true, data: rows });
});

router.get("/:id", validarId, verificarValidaciones, async (req, res) => {
  // Obtengo id
  const id = Number(req.params.id);

  const [rows] = await db.execute("SELECT * FROM categorias WHERE id=?", [id]);

  if (rows.length === 0) {
    return res
      .status(404)
      .json({ success: false, message: "Categoria no encontrada" });
  }

  res.json({ success: true, data: rows[0] });
});

router.post("/", validarCategoria, verificarValidaciones, async (req, res) => {
  // Obtengo body
  const { nombre } = req.body;

  const [result] = await db.execute(
    "INSERT INTO categorias (nombre) VALUES (?)",
    [nombre]
  );

  res
    .status(201)
    .json({ success: true, data: { id: result.insertId, nombre } });
});

router.put(
  "/:id",
  validarId,
  validarCategoria,
  verificarValidaciones,
  async (req, res) => {
    // Obtengo id
    const id = Number(req.params.id);

    // Obtengo body
    const { nombre } = req.body;

    await db.execute("UPDATE categorias SET nombre=? WHERE id=?", [nombre, id]);

    res.json({ success: true, data: { id, nombre } });
  }
);

router.delete("/:id", validarId, verificarValidaciones, async (req, res) => {
  // Obtengo id
  const id = Number(req.params.id);

  await db.execute("DELETE FROM categorias WHERE id=?", [id]);
  res.json({ success: true, data: id });
});

router.get("/:id/productos", async (req, res) => {
  const id = req.params.id;

  // Con campo categoria
  /*
  let sql =
    "SELECT p.id, p.nombre, p.cantidad, c.nombre AS categoria " +
    "FROM productos p " +
    "JOIN categorias c ON p.categoria_id = c.id " +
    "WHERE c.id = ? " +
    "ORDER BY p.nombre";
    */

  // Sin campo categoria
  let sql =
    "SELECT p.id, p.nombre, p.cantidad " +
    "FROM productos p " +
    "WHERE p.categoria_id = ? " +
    "ORDER BY p.nombre";

  const [rows] = await db.execute(sql, [id]);
  res.json({ success: true, data: rows });
});

export default router;
