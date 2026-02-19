import { Router } from "express";
import prisma from "../lib/prisma";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

// Obtener todas las carreras custom del usuario
router.get("/", requireAuth, async (req, res) => {
  try {
    const usuarioId = (req.user as any).id;

    const carreras = await prisma.carreraCustom.findMany({
      where: { usuarioId },
      orderBy: { creadoEn: "desc" },
    });

    res.json(carreras);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener carreras" });
  }
});

// Obtener una carrera específica
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const usuarioId = (req.user as any).id;
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({ error: "ID inválido" });
    }

    const carrera = await prisma.carreraCustom.findFirst({
      where: { id, usuarioId },
    });

    if (!carrera) {
      return res.status(404).json({ error: "Carrera no encontrada" });
    }

    res.json(carrera);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener carrera" });
  }
});

// Crear una carrera custom
router.post("/", requireAuth, async (req, res) => {
  try {
    const usuarioId = (req.user as any).id;
    const { id, nombre, abreviacion, aniosDuracion, materias } = req.body;

    const carrera = await prisma.carreraCustom.upsert({
      where: { id: id ?? "" },
      update: { nombre, abreviacion, aniosDuracion, materias },
      create: { id, usuarioId, nombre, abreviacion, aniosDuracion, materias },
    });

    res.json(carrera);
  } catch (error) {
    console.error("Error completo:", error);
    res.status(500).json({ error: "Error al crear carrera" });
  }
});

// Actualizar una carrera custom
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const usuarioId = (req.user as any).id;
    const { id } = req.params;
    const { nombre, abreviacion, aniosDuracion, materias } = req.body;

    if (typeof id !== "string") {
      return res.status(400).json({ error: "ID inválido" });
    }

    const carrera = await prisma.carreraCustom.updateMany({
      where: { id, usuarioId },
      data: { nombre, abreviacion, aniosDuracion, materias },
    });

    if (carrera.count === 0) {
      return res.status(404).json({ error: "Carrera no encontrada" });
    }

    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar carrera" });
  }
});

// Borrar una carrera custom
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const usuarioId = (req.user as any).id;
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({ error: "ID inválido" });
    }

    await prisma.carreraCustom.deleteMany({
      where: { id, usuarioId },
    });

    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: "Error al borrar carrera" });
  }
});

export default router;
