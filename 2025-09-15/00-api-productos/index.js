import express from "express";
import mysql from "mysql2/promise";

// Conexion a base de datos
const db = await mysql.createConnection({
  host: process.env.DB_HOST, // Dominio (url) de db
  user: process.env.DB_USER, // Usuario
  password: process.env.DB_PASS, // Contraseña
  database: process.env.DB_NAME, // Esquema
});

const app = express();
const port = 3000;

// Para interpretar body como JSON
app.use(express.json());

app.get("/", (req, res) => {
  // Responder con string
  res.send("Hola mundo!");
});

// GET para entregar listado de productos
app.get("/productos", async (req, res) => {
  const [rows] = await db.execute("SELECT * FROM productos");
  //console.log("rows", rows);
  res.json({ success: true, data: rows });
});

// GET para entregar detalle de producto
app.get("/productos/:id", async (req, res) => {
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
app.post("/productos", async (req, res) => {
  // Obtengo body
  const { nombre, categoria, cantidad } = req.body;
  const [result] = await db.execute(
    "INSERT INTO productos (nombre, categoria, cantidad) VALUES (?,?,?)",
    [nombre, categoria, cantidad]
  );
  res.status(201).json({
    success: true,
    data: { id: result.insertId, nombre, categoria, cantidad },
  });
});

// PUT para modificar producto a partir de un id
app.put("/productos/:id", async (req, res) => {
  // Obtengo id
  const id = Number(req.params.id);

  // Obtengo body
  const { nombre, categoria, cantidad } = req.body;

  await db.execute(
    "UPDATE productos SET nombre=?, categoria=?, cantidad=? WHERE id=?",
    [nombre, categoria, cantidad, id]
  );

  res.json({
    success: true,
    data: { id, nombre, categoria, cantidad },
  });
});

// DELETE para quitar un producto a partir de un id
app.delete("/productos/:id", async (req, res) => {
  // Obtengo id
  const id = Number(req.params.id);

  await db.execute("DELETE FROM productos WHERE id=?", [id]);
  res.json({ success: true, data: id });
});

app.listen(port, () => {
  console.log(`La aplicación esta funcionando en el puerto ${port}`);
});
