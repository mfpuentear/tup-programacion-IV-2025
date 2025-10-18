import express from "express";
import { db } from "./db.js";
import { verificarValidaciones } from "./validaciones.js";
import { body } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";

const router = express.Router();

export function authConfig() {
  // Opciones de configuracion de passport-jwt
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };

  // Creo estrategia jwt
  passport.use(
    new Strategy(jwtOptions, async (payload, next) => {
      // Si llegamos a este punto es porque el token es valido
      // Si hace falta realizar algun paso extra antes de llamar al handler de la API
      next(null, payload);
    })
  );
}

router.post(
  "/login",
  body("username").isAlphanumeric("es-ES").isLength({ max: 20 }),
  body("password").isStrongPassword({
    minLength: 8, // Minimo de 8 caracteres
    minLowercase: 1, // Al menos una letra en minusculas
    minUppercase: 0, // Letras mayusculas opcionales
    minNumbers: 1, // Al menos un número
    minSymbols: 0, // Símbolos opcionales
  }),
  verificarValidaciones,
  async (req, res) => {
    const { username, password } = req.body;

    // Consultar por el usuario a la base de datos
    const [rows] = await db.execute("SELECT * FROM usuarios WHERE username=?", [
      username,
    ]);

    if (rows.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "Usuario inválido" });
    }

    // Verificar la contraseña
    const hashedPassword = rows[0].password_hash;

    const passwordComparada = await bcrypt.compare(password, hashedPassword);

    if (!passwordComparada) {
      return res
        .status(400)
        .json({ success: false, error: "Contraseña inválido" });
    }

    // Generar jwt
    const payload = { userId: rows[0].id, otra: "cosa", rol: "admin" };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "30s",
    });

    // Devolver jwt
    res.json({ success: true, token });
  }
);

export default router;
