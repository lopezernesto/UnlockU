import { Router } from "express";
import prisma from "../lib/prisma";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

// Obtener progreso de una carrera
router.get("/:carreraId", requireAuth, async (req, res) => {
  try {
    const usuarioId = (req.user as any).id;
    const { carreraId } = req.params;

    if (typeof carreraId !== "string") {
      return res.status(400).json({ error: "carreraId inválido" });
    }

    const progreso = await prisma.progresoMateria.findMany({
      where: { usuarioId, carreraId },
    });

    res.json(progreso);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener progreso" });
  }
});

// Guardar o actualizar el progreso de una materia
router.post("/", requireAuth, async (req, res) => {
  try {
    const usuarioId = (req.user as any).id;
    const { carreraId, materiaId, estado, nota, fecha } = req.body;

    const progreso = await prisma.progresoMateria.upsert({
      where: {
        usuarioId_carreraId_materiaId: { usuarioId, carreraId, materiaId },
      },
      update: { estado, nota, fecha: fecha ? new Date(fecha) : null },
      create: {
        usuarioId,
        carreraId,
        materiaId,
        estado,
        nota,
        fecha: fecha ? new Date(fecha) : null,
      },
    });

    res.json(progreso);
  } catch (error) {
    res.status(500).json({ error: "Error al guardar progreso" });
  }
});

// Resetear el progreso de una materia
router.delete("/:carreraId/:materiaId", requireAuth, async (req, res) => {
  try {
    const usuarioId = (req.user as any).id;
    const { carreraId, materiaId } = req.params;

    if (typeof carreraId !== "string") {
      return res.status(400).json({ error: "carreraId inválido" });
    }

    if (typeof materiaId !== "string") {
      return res.status(400).json({ error: "materiaId inválido" });
    }

    await prisma.progresoMateria.deleteMany({
      where: { usuarioId, carreraId, materiaId },
    });

    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: "Error al resetear progreso" });
  }
});

export default router;
