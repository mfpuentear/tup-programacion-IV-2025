import express from "express";

const app = express();
const port = 3000;

// Para interpretar body como JSON
app.use(express.json());

const nombres = ["Juan", "Maria", "Jose", "Rosa", "Toribio", "Azucena"];

app.get("/", (req, res) => {
  // Responder con string
  res.send("Hola mundo!");
});

// GET para entregar listado de nombres
app.get("/nombres", (req, res) => {
  // Parametro de consulta (para filtrar)
  const nombre = req.query.nombre;
  if (nombre) {
    return res.json({
      success: true,
      data: nombres.filter((n) =>
        n.toLocaleLowerCase().includes(nombre.toLocaleLowerCase())
      ),
    });
  }
  res.json({ success: true, data: nombres });
});

// GET para entregar detalle de nombre
app.get("/nombres/:index", (req, res) => {
  const index = parseInt(req.params.index);
  if (index < 0 || index >= nombres.length) {
    return res
      .status(404)
      .json({ success: false, message: "Nombre no encontrado" });
  }
  res.json({ success: true, data: nombres[index] });
});

// POST para crear nombre
app.post("/nombres", (req, res) => {
  const nombre = req.body.nuevoValor.trim();
  nombres.push(nombre);
  res.status(201).json({ success: true, data: nombre });
});

// PUT para modificar nombre a partir de un indice
app.put("/nombres/:index", (req, res) => {
  const index = parseInt(req.params.index);
  if (index < 0 || index >= nombres.length) {
    return res
      .status(404)
      .json({ success: false, message: "Nombre no encontrado" });
  }
  const nuevoNombre = req.body.nuevoNombre.trim();
  nombres[index] = nuevoNombre;
  res.json({ success: true, data: nuevoNombre });
});

// DELETE para quitar un nombre a partir de un indice
app.delete("/nombres/:index", (req, res) => {
  const index = parseInt(req.params.index);
  if (index < 0 || index >= nombres.length) {
    return res
      .status(404)
      .json({ success: false, message: "Nombre no encontrado" });
  }
  const nombreQuitado = nombres[index];
  nombres.splice(index, 1);
  res.json({ success: true, data: nombreQuitado });
});

app.listen(port, () => {
  console.log(`La aplicación esta funcionando en ${port}`);
});
