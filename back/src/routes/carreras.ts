import { Router } from "express";
import prisma from "../lib/prisma";
import { requireAuth } from "../middleware/requireAuth";
import { validateBody, validateParam } from "../lib/validate";
import { z } from "zod";
import type { InputJsonValue } from "@prisma/client/runtime/library";

const router = Router();

const MateriaItemSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  anio: z.number().int(),
  cuatrimestre: z.union([z.literal(1), z.literal(2)]),
  estado: z.enum(["BLOQUEADA", "HABILITADA", "CURSADA", "APROBADA"]),
  nota: z.number().int().min(0).max(10).optional(),
  anioCursada: z.number().int().min(1900).max(2100).optional(),
  anioAprobado: z.number().int().min(1900).max(2100).optional(),
  correlativasCursada: z.array(z.string()),
  correlativasFinal: z.array(z.string()),
});

const CarreraCustomSchema = z.object({
  id: z.string().min(1).max(100).optional(),
  nombre: z.string().min(2).max(100),
  abreviacion: z.string().min(2).max(20),
  aniosDuracion: z.number().int().min(1).max(10),
  materias: z.array(MateriaItemSchema).max(500).default([]),
});

const IdParamSchema = z.string().min(1).max(100);

// Obtener todas las carreras custom del usuario
router.get("/", requireAuth, async (req, res) => {
  try {
    const usuarioId = req.user!.id;

    const carreras = await prisma.carreraCustom.findMany({
      where: { usuarioId },
      orderBy: { creadoEn: "desc" },
    });

    res.json(carreras);
  } catch (error) {
    console.error("[carreras] GET /", error);
    res.status(500).json({ error: "Error al obtener carreras" });
  }
});

// Obtener una carrera específica
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const id = validateParam(IdParamSchema, req.params.id, res);
    if (!id) return;

    const usuarioId = req.user!.id;

    const carrera = await prisma.carreraCustom.findFirst({
      where: { id, usuarioId },
    });

    if (!carrera) {
      return res.status(404).json({ error: "Carrera no encontrada" });
    }

    res.json(carrera);
  } catch (error) {
    console.error("[carreras] GET /:id", error);
    res.status(500).json({ error: "Error al obtener carrera" });
  }
});

// Crear una carrera custom
router.post("/", requireAuth, async (req, res) => {
  const data = validateBody(CarreraCustomSchema, req, res);
  if (!data) return;
  const usuarioId = req.user!.id;
  try {
    const existente = await prisma.carreraCustom.findFirst({
      where: {
        usuarioId,
        OR: [
          { nombre: { equals: data.nombre, mode: "insensitive" } },
          { abreviacion: { equals: data.abreviacion, mode: "insensitive" } },
        ],
      },
    });

    if (existente) {
      return res.status(409).json({
        error:
          existente.nombre === data.nombre
            ? "Ya tenés una carrera con ese nombre"
            : "Ya tenés una carrera con esa abreviación",
      });
    }
    const carrera = await prisma.carreraCustom.create({
      data: {
        ...(data.id ? { id: data.id } : {}),
        usuarioId,
        nombre: data.nombre,
        abreviacion: data.abreviacion,
        aniosDuracion: data.aniosDuracion,
        materias: data.materias as InputJsonValue,
      },
    });

    res.json(carrera);
  } catch (error: any) {
    if (error.code === "P2002") {
      const existente = await prisma.carreraCustom.findFirst({
        where: { id: data.id, usuarioId },
      });
      if (existente) return res.json(existente);
      return res.status(409).json({ error: "Conflicto de ID" });
    }
    console.error("[carreras] POST /", error);
    res.status(500).json({ error: "Error al crear carrera" });
  }
});

// Actualizar una carrera custom
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const data = validateBody(CarreraCustomSchema, req, res);
    if (!data) return;
    const usuarioId = req.user!.id;

    const id = validateParam(IdParamSchema, req.params.id, res);
    if (!id) return;

    const existente = await prisma.carreraCustom.findFirst({
      where: {
        usuarioId,
        id: { not: id as string },
        OR: [
          { nombre: { equals: data.nombre, mode: "insensitive" } },
          { abreviacion: { equals: data.abreviacion, mode: "insensitive" } },
        ],
      },
    });

    if (existente) {
      return res.status(409).json({
        error:
          existente.nombre === data.nombre
            ? "Ya tenés una carrera con ese nombre"
            : "Ya tenés una carrera con esa abreviación",
      });
    }

    const carrera = await prisma.carreraCustom.updateMany({
      where: { id, usuarioId },
      data: {
        nombre: data.nombre,
        abreviacion: data.abreviacion,
        aniosDuracion: data.aniosDuracion,
        materias: data.materias as InputJsonValue,
      },
    });

    if (carrera.count === 0) {
      return res.status(404).json({ error: "Carrera no encontrada" });
    }

    res.json({ ok: true });
  } catch (error) {
    console.error("[carreras] PUT /:id", error);
    res.status(500).json({ error: "Error al actualizar carrera" });
  }
});

// Borrar una carrera custom
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const usuarioId = req.user!.id;
    const id = validateParam(IdParamSchema, req.params.id, res);
    if (!id) return;

    const carrera = await prisma.carreraCustom.deleteMany({
      where: { id, usuarioId },
    });
    if (carrera.count === 0) {
      return res.status(404).json({ error: "Carrera no encontrada" });
    }
    res.json({ ok: true });
  } catch (error) {
    console.error("[carreras] DELETE /:id", error);
    res.status(500).json({ error: "Error al borrar carrera" });
  }
});

export default router;
