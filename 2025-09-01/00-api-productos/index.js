import express from "express";

const app = express();
const port = 3000;

// Para interpretar body como JSON
app.use(express.json());

const productos = [
  { id: 1, producto: "Pan", categoria: "Panificacion", cantidad: 5, precio: 2 },
  {
    id: 2,
    producto: "Detergente",
    categoria: "Limpieza",
    cantidad: 20,
    precio: 10,
  },
  { id: 3, producto: "Jabon", categoria: "Limpieza", cantidad: 30, precio: 6 },
  {
    id: 4,
    producto: "Galletas",
    categoria: "Panificacion",
    cantidad: 0,
    precio: 5,
  },
  { id: 5, producto: "Yogurt", categoria: "Lacteos", cantidad: 50, precio: 15 },
  { id: 6, producto: "Leche", categoria: "Lacteos", cantidad: 100, precio: 20 },
];

let nextId = 7;

app.get("/", (req, res) => {
  // Responder con string
  res.send("Hola mundo!");
});

// GET para entregar listado de productos
app.get("/productos", (req, res) => {
  // Copio productos
  let productosFiltados = [...productos];

  // Filtro por producto
  const producto = req.query.producto;
  if (producto) {
    productosFiltados = productosFiltados.filter((p) =>
      p.producto.toLocaleLowerCase().includes(producto.toLocaleLowerCase())
    );
  }

  // Filtro por precio minimo
  const precioMin = req.query.precioMin;
  if (precioMin) {
    const precioMinimo = parseFloat(precioMin);
    if (isNaN(precioMinimo)) {
      return res
        .status(400)
        .json({ success: false, message: "Filtro precioMin inválido" });
    }
    productosFiltados = productosFiltados.filter(
      (p) => p.precio >= precioMinimo
    );
  }

  res.json({ success: true, data: productosFiltados });
});

// GET para entregar detalle de producto
app.get("/productos/:id", (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id) || !Number.isInteger(id) || id <= 0) {
    return res
      .status(400)
      .json({ success: false, message: "Parametro id inválido" });
  }

  const producto = productos.find((p) => p.id === id);
  if (!producto) {
    return res
      .status(404)
      .json({ success: false, message: "Producto no encontrado" });
  }

  res.json({ success: true, data: producto });
});

// POST para crear producto
app.post("/productos", (req, res) => {
  // Extraigo del body los atributos del nuevo producto
  const { producto, categoria, cantidad, precio } = req.body;

  // Validar los atributo

  // Creo un nuevo producto
  const nuevoProducto = {
    id: nextId++,
    producto: producto.trim(),
    categoria: categoria.trim(),
    precio,
    cantidad,
  };

  // Agrego el producto al arreglo
  productos.push(nuevoProducto);

  // Envio respuesta
  res.status(201).json({ success: true, data: nuevoProducto });
});

// PUT para modificar producto a partir de un id
app.put("/productos/:id", (req, res) => {});

// DELETE para quitar un producto a partir de un id
app.delete("/productos/:id", (req, res) => {});

app.listen(port, () => {
  console.log(`La aplicación esta funcionando en ${port}`);
});
