import express from "express";

const router = express.Router();

router.get("/", (req, res) => {});
router.get("/:id", (req, res) => {});
router.post("/", (req, res) => {});
router.put("/:id", (req, res) => {});
router.delete("/:id", (req, res) => {});

router.get("/:id/usuario", (req, res) => {});
router.post("/:id/usuario", (req, res) => {});
router.delete("/:id/usuario/:usuarioId", (req, res) => {});

export default router;
