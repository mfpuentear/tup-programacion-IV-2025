import express from "express";
import { db } from "./db.js";

const router = express.Router();

// GET para entregar listado de productos
router.get("/", async (req, res) => {
  const filtros = [];
  const parametros = [];

  const { nombre, cantidadMin, cantidadMax } = req.query;

  if (nombre) {
    filtros.push("nombre LIKE ?");
    parametros.push(`%${nombre}%`);
  }

  if (cantidadMin !== undefined) {
    filtros.push("cantidad >= ?");
    parametros.push(Number(cantidadMin));
  }

  if (cantidadMax !== undefined) {
    filtros.push("cantidad <= ?");
    parametros.push(Number(cantidadMax));
  }

  let sql =
    "SELECT p.id, p.nombre, p.cantidad, c.nombre AS categoria " +
    "FROM productos p " +
    "JOIN categorias c ON p.categoria_id = c.id " +
    "ORDER BY p.nombre";

  if (filtros.length > 0) {
    sql += " WHERE " + filtros.join(" AND ");
  }

  console.log(sql);
  const [rows] = await db.execute(sql, parametros);
  res.json({ success: true, data: rows });
});

// GET para entregar detalle de producto
router.get("/:id", async (req, res) => {
  // Obtengo id
  const id = Number(req.params.id);

  // Esto no se debe hacer, puede injectarse scripts SQL
  // const [rows] = await db.execute(`SELECT * FROM productos WHERE id=${id}`);

  // Emplear parametros
  const [rows] = await db.execute("SELECT * FROM productos WHERE id=?", [id]);

  if (rows.length === 0) {
    return res
      .status(404)
      .json({ success: false, message: "Producto no encontrado" });
  }

  res.json({ success: true, data: rows[0] });
});

// POST para crear producto
router.post("/", async (req, res) => {
  // Obtengo body
  const { nombre, categoriaId, cantidad } = req.body;
  const [result] = await db.execute(
    "INSERT INTO productos (nombre, categoria_id, cantidad) VALUES (?,?,?)",
    [nombre, categoriaId, cantidad]
  );
  res.status(201).json({
    success: true,
    data: { id: result.insertId, nombre, categoriaId, cantidad },
  });
});

// PUT para modificar producto a partir de un id
router.put("/:id", async (req, res) => {
  // Obtengo id
  const id = Number(req.params.id);

  // Obtengo body
  const { nombre, categoriaId, cantidad } = req.body;

  await db.execute(
    "UPDATE productos SET nombre=?, categoria_id=?, cantidad=? WHERE id=?",
    [nombre, categoriaId, cantidad, id]
  );

  res.json({
    success: true,
    data: { id, nombre, categoriaId, cantidad },
  });
});

// DELETE para quitar un producto a partir de un id
router.delete("/:id", async (req, res) => {
  // Obtengo id
  const id = Number(req.params.id);

  await db.execute("DELETE FROM productos WHERE id=?", [id]);
  res.json({ success: true, data: id });
});

export default router;
