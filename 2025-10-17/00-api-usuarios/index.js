import express from "express";
import { conectarDB } from "./db.js";
import usuariosRouter from "./usuarios.js";
import rolesRouter from "./roles.js";
import usuariosRolesRouter from "./usuarios-roles.js";
import authRouter, { authConfig } from "./auth.js";

conectarDB();

const app = express();
const port = 3000;

// Para interpretar body como JSON
app.use(express.json());

authConfig();

app.get("/", (req, res) => {
  // Responder con string
  res.send("Hola mundo!");
});

app.use("/usuarios", usuariosRouter);
app.use("/roles", rolesRouter);
app.use("/usuarios-roles", usuariosRolesRouter);
app.use("/auth", authRouter);

app.listen(port, () => {
  console.log(`La aplicación esta funcionando en el puerto ${port}`);
});
