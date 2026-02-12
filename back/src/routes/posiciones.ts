import { Router } from "express";
import prisma from "../lib/prisma";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

// Obtener posiciones guardadas
router.get("/:carreraId", requireAuth, async (req, res) => {
  try {
    const usuarioId = (req.user as any).id;
    const { carreraId } = req.params;

    if (typeof carreraId !== "string") {
      return res.status(400).json({ error: "carreraId inválido" });
    }

    const posiciones = await prisma.posicionNodo.findMany({
      where: { usuarioId, carreraId },
    });

    res.json(posiciones);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener posiciones" });
  }
});

// Guardar o actualizar posición de un nodo
router.post("/", requireAuth, async (req, res) => {
  try {
    const usuarioId = (req.user as any).id;
    const { carreraId, materiaId, x, y } = req.body;

    const posicion = await prisma.posicionNodo.upsert({
      where: {
        usuarioId_carreraId_materiaId: { usuarioId, carreraId, materiaId },
      },
      update: { x, y },
      create: { usuarioId, carreraId, materiaId, x, y },
    });

    res.json(posicion);
  } catch (error) {
    res.status(500).json({ error: "Error al guardar posición" });
  }
});

// Borrar todas las posiciones (cuando el usuario resetea)
router.delete("/:carreraId", requireAuth, async (req, res) => {
  try {
    const usuarioId = (req.user as any).id;
    const { carreraId } = req.params;

    if (typeof carreraId !== "string") {
      return res.status(400).json({ error: "carreraId inválido" });
    }

    await prisma.posicionNodo.deleteMany({
      where: { usuarioId, carreraId },
    });

    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: "Error al resetear posiciones" });
  }
});

export default router;
