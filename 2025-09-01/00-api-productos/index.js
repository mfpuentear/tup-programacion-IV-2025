import express from "express";

const app = express();
const port = 3000;

// Para interpretar body como JSON
app.use(express.json());

let productos = [
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
app.put("/productos/:id", (req, res) => {
  // Verifico id que sea un numero entero positivo
  const id = Number(req.params.id);
  if (isNaN(id) || !Number.isInteger(id) || id <= 0) {
    return res
      .status(400)
      .json({ success: false, message: "Parametro id inválido" });
  }

  // Verificar que este presente el producto
  let productoEncontrado = productos.find((p) => p.id === id);
  if (!productoEncontrado) {
    return res
      .status(404)
      .json({ success: false, message: "Producto no encontrado" });
  }

  // Validar el body
  const { producto, categoria, cantidad, precio } = req.body;

  // Verificar que existan los campos obligatorios
  if (
    producto === undefined ||
    categoria === undefined ||
    cantidad === undefined ||
    precio === undefined
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Falta algún campo" });
  }

  if (producto.trim() === "" || producto.trim().length > 100) {
    return res.status(400).json({
      success: false,
      message: "El campo producto esta vacío o supera los 100 caracteres",
    });
  }

  if (categoria.trim() === "") {
    return res
      .status(400)
      .json({ success: false, message: "El campo categoria esta vacío" });
  }

  if (isNaN(cantidad) || !Number.isInteger(cantidad) || cantidad < 0) {
    return res
      .status(400)
      .json({ success: false, message: "Cantidad inválida" });
  }

  if (isNaN(precio) || precio <= 0) {
    return res.status(400).json({ success: false, message: "Precio inválido" });
  }

  // Modificar el producto

  // Alternativa 1: Modificar atributo por atributo
  /*
  productoEncontrado.producto = producto;
  productoEncontrado.categoria = categoria;
  productoEncontrado.cantidad = cantidad;
  productoEncontrado.precio = precio;
  */

  // Alternativa 2: empleando findIndex anteriormente

  // Alternativa 3: Reemplazar el arreglo
  productos = productos.map((p) =>
    p.id === id ? { id, producto, categoria, cantidad, precio } : p
  );

  // Responder con producto modificado
  res.json({ success: true, data: productoEncontrado });
});

// DELETE para quitar un producto a partir de un id
app.delete("/productos/:id", (req, res) => {
  // Verifico id que sea un numero entero positivo
  const id = Number(req.params.id);
  if (isNaN(id) || !Number.isInteger(id) || id <= 0) {
    return res
      .status(400)
      .json({ success: false, message: "Parametro id inválido" });
  }

  // Verificar que este presente el producto
  let productoEncontrado = productos.find((p) => p.id === id);
  if (!productoEncontrado) {
    return res
      .status(404)
      .json({ success: false, message: "Producto no encontrado" });
  }

  // Quitar del arreglo
  // Alternativa 1: emplear findIndex y quitar con splice

  // Alternativa 2:
  productos = productos.filter((p) => p.id !== id);

  // Retornar producto quitado
  res.json({ success: true, data: productoEncontrado });
});

app.listen(port, () => {
  console.log(`La aplicación esta funcionando en ${port}`);
});
