import express from "express";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  // Responder con string
  res.send("Hola mundo!");
});

app.get("/saludo", (req, res) => {
  // Responder con JSON
  res.send({ mensaje: "hola" });
});

app.get("/nombres", (req, res) => {
  // Responder con arreglos
  const nombres = ["Juan", "Maria", "Jose"];
  res.send(nombres);
});

app.listen(port, () => {
  console.log(`La aplicación esta funcionando en ${port}`);
});
