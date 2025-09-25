import express from "express";
import { db } from "./db.js";

const router = express.Router();

// Pendiente por implementar
router.get("/", (req, res) => {});
router.get("/:id", (req, res) => {});
router.post("/", (req, res) => {});
router.put("/:id", (req, res) => {});
router.delete("/:id", (req, res) => {});

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
