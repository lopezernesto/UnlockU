import { Router } from "express";
import prisma from "../lib/prisma";
import { requireAuth } from "../middleware/requireAuth";
import { validateBody, validateParam } from "../lib/validate";
import { z } from "zod";

const router = Router();
const ProgresoMateriaSchema = z.object({
  carreraId: z.string().min(1).max(100),
  materiaId: z.string().min(1).max(100),
  estado: z.enum(["CURSADA", "APROBADA"]),
  nota: z.number().int().min(0).max(10).nullable().optional(),
  anioCursada: z.number().int().min(1900).max(2100).nullable().optional(),
  anioAprobado: z.number().int().min(1900).max(2100).nullable().optional(),
});

const IdParamSchema = z.string().min(1).max(100);

// Obtener progreso de una carrera
router.get("/:carreraId", requireAuth, async (req, res) => {
  try {
    const carreraId = validateParam(IdParamSchema, req.params.carreraId, res);
    if (!carreraId) return;

    const usuarioId = req.user!.id;

    const progreso = await prisma.progresoMateria.findMany({
      where: { usuarioId, carreraId },
    });

    res.json(progreso);
  } catch (error) {
    console.error("[progreso] GET /:id", error);
    res.status(500).json({ error: "Error al obtener progreso" });
  }
});

// Guardar o actualizar el progreso de una materia
router.post("/", requireAuth, async (req, res) => {
  try {
    const data = validateBody(ProgresoMateriaSchema, req, res);
    if (!data) return;
    const usuarioId = req.user!.id;

    const progreso = await prisma.progresoMateria.upsert({
      where: {
        usuarioId_carreraId_materiaId: {
          usuarioId,
          carreraId: data.carreraId,
          materiaId: data.materiaId,
        },
      },
      update: {
        estado: data.estado,
        nota: data.nota ?? null,
        anioCursada: data.anioCursada ?? null,
        anioAprobado: data.anioAprobado ?? null,
      },
      create: {
        usuarioId,
        carreraId: data.carreraId,
        materiaId: data.materiaId,
        estado: data.estado,
        nota: data.nota ?? null,
        anioCursada: data.anioCursada ?? null,
        anioAprobado: data.anioAprobado ?? null,
      },
    });

    res.json(progreso);
  } catch (error) {
    console.error("[progreso] POST /", error);
    res.status(500).json({ error: "Error al guardar progreso" });
  }
});
// Borrar todo el progreso de una carrera
router.delete("/:carreraId", requireAuth, async (req, res) => {
  try {
    const usuarioId = req.user!.id;
    const carreraId = validateParam(IdParamSchema, req.params.carreraId, res);
    if (!carreraId) return;

    await prisma.progresoMateria.deleteMany({
      where: { usuarioId, carreraId },
    });

    res.json({ ok: true });
  } catch (error) {
    console.error("[progreso] DELETE /:id", error);
    res.status(500).json({ error: "Error al borrar progreso de carrera" });
  }
});

// Resetear el progreso de una materia
router.delete("/:carreraId/:materiaId", requireAuth, async (req, res) => {
  try {
    const usuarioId = req.user!.id;
    const carreraId = validateParam(IdParamSchema, req.params.carreraId, res);
    if (!carreraId) return;

    const materiaId = validateParam(IdParamSchema, req.params.materiaId, res);
    if (!materiaId) return;

    await prisma.progresoMateria.deleteMany({
      where: {
        usuarioId,
        carreraId,
        materiaId,
      },
    });

    res.json({ ok: true });
  } catch (error) {
    console.error("[progreso] DELETE /:id/:materiaId", error);
    res.status(500).json({ error: "Error al resetear progreso" });
  }
});

export default router;
