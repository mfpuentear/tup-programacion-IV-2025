import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones } from "./validaciones.js";
import { query, body } from "express-validator";

const router = express.Router();

// Validaciones
const validarFiltros = [
  query("nombre").isAlpha("es-ES").optional(),
  query("cantidadMin").isFloat({ min: 0 }).optional(),
  query("cantidadMax")
    .isFloat({ min: 0 })
    .optional()
    .custom((value, { req }) => {
      if (
        req.query.cantidadMin !== undefined &&
        Number(value) <= Number(req.query.cantidadMin)
      ) {
        throw new Error("CantidadMax debe ser mayor a cantidadMin");
      }
      return true;
    }),
];

const validarProducto = [
  body("nombre").isAlpha("es-ES").isLength({ max: 50 }),
  body("categoriaId").isInt({ min: 1 }),
  body("cantidad").isInt({ min: 1 }),
];

// GET para entregar listado de productos
router.get("/", validarFiltros, verificarValidaciones, async (req, res) => {
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

  const [rows] = await db.execute(sql, parametros);
  res.json({ success: true, data: rows });
});

// GET para entregar detalle de producto
router.get("/:id", validarId, verificarValidaciones, async (req, res) => {
  // Obtengo id
  const id = Number(req.params.id);

  const [rows] = await db.execute("SELECT * FROM productos WHERE id=?", [id]);

  if (rows.length === 0) {
    return res
      .status(404)
      .json({ success: false, message: "Producto no encontrado" });
  }

  res.json({ success: true, data: rows[0] });
});

// POST para crear producto
router.post("/", validarProducto, verificarValidaciones, async (req, res) => {
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
router.put(
  "/:id",
  validarId,
  validarProducto,
  verificarValidaciones,
  async (req, res) => {
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
  }
);

// DELETE para quitar un producto a partir de un id
router.delete("/:id", validarId, verificarValidaciones, async (req, res) => {
  // Obtengo id
  const id = Number(req.params.id);

  await db.execute("DELETE FROM productos WHERE id=?", [id]);
  res.json({ success: true, data: id });
});

export default router;
