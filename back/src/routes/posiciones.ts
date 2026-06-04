import { Router } from "express";
import prisma from "../lib/prisma";
import { requireAuth } from "../middleware/requireAuth";
import { validateBody, validateParam } from "../lib/validate";
import { z } from "zod";

const router = Router();
const PosicionSchema = z.object({
  carreraId: z.string().min(1).max(100),
  materiaId: z.string().min(1).max(100),
  x: z.number(),
  y: z.number(),
});

const IdParamSchema = z.string().min(1).max(100);
// Obtener posiciones guardadas
router.get("/:carreraId", requireAuth, async (req, res) => {
  try {
    const usuarioId = req.user!.id;
    const carreraId = validateParam(IdParamSchema, req.params.carreraId, res);
    if (!carreraId) return;

    const posiciones = await prisma.posicionNodo.findMany({
      where: { usuarioId, carreraId },
    });

    res.json(posiciones);
  } catch (error) {
    console.error("[posiciones] GET /:id", error);
    res.status(500).json({ error: "Error al obtener posiciones" });
  }
});

// Guardar o actualizar posición de un nodo
router.post("/", requireAuth, async (req, res) => {
  try {
    const data = validateBody(PosicionSchema, req, res);
    if (!data) return;

    const usuarioId = req.user!.id;

    const posicion = await prisma.posicionNodo.upsert({
      where: {
        usuarioId_carreraId_materiaId: {
          usuarioId,
          carreraId: data.carreraId,
          materiaId: data.materiaId,
        },
      },
      update: { x: data.x, y: data.y },
      create: {
        usuarioId,
        carreraId: data.carreraId,
        materiaId: data.materiaId,
        x: data.x,
        y: data.y,
      },
    });

    res.json(posicion);
  } catch (error) {
    console.error("[posiciones] POST /", error);
    res.status(500).json({ error: "Error al guardar posición" });
  }
});

// Borrar todas las posiciones (cuando el usuario resetea)
router.delete("/:carreraId", requireAuth, async (req, res) => {
  try {
    const usuarioId = req.user!.id;
    const carreraId = validateParam(IdParamSchema, req.params.carreraId, res);
    if (!carreraId) return;

    await prisma.posicionNodo.deleteMany({
      where: { usuarioId, carreraId },
    });

    res.json({ ok: true });
  } catch (error) {
    console.error("[posiciones] DELETE /:id", error);
    res.status(500).json({ error: "Error al resetear posiciones" });
  }
});

export default router;
