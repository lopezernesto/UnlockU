import { ZodSchema } from "zod";
import { Request, Response } from "express";

export function validateBody<T>(
  schema: ZodSchema<T>,
  req: Request,
  res: Response,
): T | null {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten() });
    return null;
  }
  return result.data;
}

export function validateParam(
  schema: ZodSchema<string>,
  value: string | string[] | undefined,
  res: Response,
): string | null {
  const normalized = Array.isArray(value) ? value[0] : value;

  if (!normalized) {
    res.status(400).json({ error: "Parámetro requerido" });
    return null;
  }

  const result = schema.safeParse(value);
  if (!result.success) {
    res.status(400).json({ error: "Parámetro inválido" });
    return null;
  }
  return result.data;
}
