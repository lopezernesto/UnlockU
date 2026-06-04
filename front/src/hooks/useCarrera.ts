import { useState, useCallback, useEffect, useMemo } from "react";
import { carreraLCC } from "../data/LCC";
import { carreraLSI } from "../data/LSI";
import { carreraTUASSL } from "../data/TUASSL";
import { carreraTUDW } from "../data/TUDW";
import type { CarreraData } from "../types/Carrera";
import type { EstadoMateria, MateriaData } from "../types/Materia";
import { api } from "../services/api";
import { recalcularEstados } from "../utils/utils";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

interface ProgresoBackend {
  materiaId: string;
  estado: "CURSADA" | "APROBADA";
  nota: number | null;
  anioCursada: number | null;
  anioAprobado: number | null;
}
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
const CarreraSchema = z.object({
  id: z.string().min(1),
  nombre: z.string().min(1),
  abreviacion: z.string().min(1),
  aniosDuracion: z.number().int().positive(),
  materias: z.array(MateriaItemSchema),
});

export default function useCarrera(isAuthenticated: boolean, isGuest: boolean) {
  const queryClient = useQueryClient();
  const debeUsarBackend = isAuthenticated && !isGuest;
  const [carreraActual, setCarreraActual] = useState<CarreraData | null>(() => {
    if (isGuest) {
      const guardado = localStorage.getItem("carrera-data");
      return guardado ? JSON.parse(guardado) : null;
    } else {
      return null;
    }
  });
  const [posicionesIniciales, setPosicionesIniciales] = useState<
    Record<string, { x: number; y: number }>
  >({});
  const materias = useMemo(() => {
    return carreraActual?.materias ?? [];
  }, [carreraActual]);

  const aniosDuracion = carreraActual?.aniosDuracion || 5;
  // Key para forzar reset completo cuando cambia el dataset
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (debeUsarBackend) return;
    if (carreraActual) {
      localStorage.setItem("carrera-data", JSON.stringify(carreraActual));
    }
  }, [carreraActual, debeUsarBackend]);

  const limpiarLocalStorage = useCallback(() => {
    setPosicionesIniciales({});
    localStorage.removeItem("nodos-posiciones");
    localStorage.removeItem("react-flow-viewport");
    setResetKey((prev) => prev + 1);
  }, []);

  const resetearPosiciones = useCallback(() => {
    localStorage.removeItem("nodos-posiciones");
    if (debeUsarBackend && carreraActual?.id) {
      api.deletePosiciones(carreraActual.id).catch(console.error);
    }
    setResetKey((prev) => prev + 1);
  }, [debeUsarBackend, carreraActual?.id]);

  const actualizarMaterias = useCallback(
    (nuevasMaterias: MateriaData[]) => {
      setCarreraActual((prev) => {
        if (!prev) return null;
        const actualizada = { ...prev, materias: nuevasMaterias };

        if (debeUsarBackend) {
          const materiasLimpias = nuevasMaterias.map((m) => ({
            ...m,
            estado: (m.estado === "CURSADA" || m.estado === "APROBADA"
              ? "HABILITADA"
              : m.estado) as EstadoMateria,
            nota: undefined,
            anioCursada: undefined,
            anioAprobado: undefined,
          }));

          api
            .updateCarrera(prev.id, {
              nombre: prev.nombre,
              abreviacion: prev.abreviacion,
              aniosDuracion: prev.aniosDuracion,
              materias: materiasLimpias,
            })
            .then(() => {
              queryClient.invalidateQueries({
                queryKey: ["carreras", "custom"],
              });
            })
            .catch(console.error);

          nuevasMaterias.forEach((nueva) => {
            const anterior = prev.materias.find((m) => m.id === nueva.id);
            if (!anterior || anterior.estado === nueva.estado) return;

            if (nueva.estado === "CURSADA" || nueva.estado === "APROBADA") {
              api
                .saveProgreso({
                  carreraId: prev.id,
                  materiaId: nueva.id,
                  estado: nueva.estado,
                  nota: nueva.nota,
                  anioCursada: nueva.anioCursada,
                  anioAprobado: nueva.anioAprobado,
                })
                .then(() => {
                  queryClient.invalidateQueries({
                    queryKey: ["carreras", "custom"],
                  });
                })
                .catch(console.error);
            } else {
              // BLOQUEADA o HABILITADA = resetear progreso
              api.deleteProgreso(prev.id, nueva.id).catch(console.error);
            }
          });
        }

        return actualizada;
      });
    },
    [debeUsarBackend, queryClient],
  );

  function aplicarProgreso(
    carrera: CarreraData,
    progreso: ProgresoBackend[],
  ): CarreraData {
    const materiasConProgreso = carrera.materias.map((m) => {
      const p = progreso.find((p) => p.materiaId === m.id);
      if (!p) return m;
      return {
        ...m,
        estado: p.estado,
        nota: p.nota ?? undefined,
        anioCursada: p.anioCursada ?? undefined,
        anioAprobado: p.anioAprobado ?? undefined,
      };
    });

    return {
      ...carrera,
      materias: recalcularEstados(materiasConProgreso),
    };
  }

  const cargarCarreraCustom = useCallback(
    async (id: string) => {
      limpiarLocalStorage();
      if (debeUsarBackend) {
        const [carrera, progreso, posiciones] = await Promise.all([
          api.getCarrera(id),
          api.getProgreso(id),
          api.getPosiciones(id),
        ]);
        const carreraConProgreso = aplicarProgreso(carrera, progreso);
        const posicionesMap: Record<string, { x: number; y: number }> = {};
        posiciones.forEach((p: any) => {
          posicionesMap[p.materiaId] = { x: p.x, y: p.y };
        });
        setPosicionesIniciales(posicionesMap);
        setCarreraActual(carreraConProgreso);
      }
    },
    [limpiarLocalStorage, debeUsarBackend],
  );

  const cargarCarreraPredefinida = useCallback(
    async (carreraBase: CarreraData) => {
      limpiarLocalStorage();
      if (debeUsarBackend) {
        try {
          const [carrera, progreso, posiciones] = await Promise.all([
            api.getCarrera(carreraBase.id),
            api.getProgreso(carreraBase.id),
            api.getPosiciones(carreraBase.id),
          ]);
          const carreraConProgreso = aplicarProgreso(carrera, progreso);
          const posicionesMap: Record<string, { x: number; y: number }> = {};
          posiciones.forEach((p: any) => {
            posicionesMap[p.materiaId] = { x: p.x, y: p.y };
          });
          setPosicionesIniciales(posicionesMap);
          setCarreraActual(carreraConProgreso);
        } catch {
          // Primera vez: guardar la estructura en el back y cargar sin progreso
          await api.deleteProgresoCarrera(carreraBase.id).catch(() => {});
          await api.saveCarrera({
            id: carreraBase.id,
            nombre: carreraBase.nombre,
            abreviacion: carreraBase.abreviacion,
            aniosDuracion: carreraBase.aniosDuracion,
            materias: carreraBase.materias,
          });
          queryClient.invalidateQueries({ queryKey: ["carreras", "custom"] });
          setCarreraActual(carreraBase);
        }
      } else {
        setCarreraActual(carreraBase);
      }
    },
    [limpiarLocalStorage, debeUsarBackend, queryClient],
  );

  const cargarCarreraLCC = useCallback(
    () => cargarCarreraPredefinida(carreraLCC),
    [cargarCarreraPredefinida],
  );
  const cargarCarreraLSI = useCallback(
    () => cargarCarreraPredefinida(carreraLSI),
    [cargarCarreraPredefinida],
  );

  const cargarCarreraTUASSL = useCallback(
    () => cargarCarreraPredefinida(carreraTUASSL),
    [cargarCarreraPredefinida],
  );
  const cargarCarreraTUDW = useCallback(
    () => cargarCarreraPredefinida(carreraTUDW),
    [cargarCarreraPredefinida],
  );

  const importarProgreso = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const resultado = CarreraSchema.safeParse(
            JSON.parse(e.target?.result as string),
          );
          if (!resultado.success) {
            alert("Error: El archivo no tiene un formato válido.");
            return;
          }
          const json = resultado.data;
          limpiarLocalStorage();
          if (debeUsarBackend) {
            // Guardar o sobreescribir la carrera en el back
            await api.saveCarrera({
              id: json.id,
              nombre: json.nombre,
              abreviacion: json.abreviacion,
              aniosDuracion: json.aniosDuracion,
              materias: json.materias,
            });
          }
          setTimeout(() => setCarreraActual(json), 0);
        } catch {
          alert("Error: El archivo no tiene un formato válido.");
        }
      };
      reader.readAsText(file);
    },
    [limpiarLocalStorage, debeUsarBackend],
  );

  const exportarProgreso = () => {
    if (!carreraActual) return;
    const dataExportar = {
      id: carreraActual.id,
      nombre: carreraActual.nombre,
      abreviacion: carreraActual.abreviacion,
      aniosDuracion: carreraActual.aniosDuracion,
      materias: carreraActual.materias.map((m) => ({
        id: m.id,
        nombre: m.nombre,
        anio: m.anio,
        cuatrimestre: m.cuatrimestre,
        estado:
          m.estado === "CURSADA" || m.estado === "APROBADA"
            ? m.estado
            : "BLOQUEADA",
        nota: m.nota,
        anioCursada: m.anioCursada,
        anioAprobado: m.anioAprobado,
        correlativasCursada: m.correlativasCursada,
        correlativasFinal: m.correlativasFinal,
      })),
    };

    const validacion = CarreraSchema.safeParse(dataExportar);
    if (!validacion.success) {
      console.error("Error al exportar:", validacion.error);
      alert("Error interno al exportar. Contactá al desarrollador.");
      return;
    }

    const dataStr = JSON.stringify(validacion.data, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `progreso_${carreraActual.id}_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const cambiarCarrera = useCallback(() => {
    localStorage.removeItem("carrera-data");
    limpiarLocalStorage();
    setCarreraActual(null);
  }, [limpiarLocalStorage]);

  const crearNuevaCarrera = (
    datos: { nombre: string; abreviacion: string; anios: number },
    id?: string,
  ) => {
    const nueva: CarreraData = {
      id: id ?? crypto.randomUUID(),
      nombre: datos.nombre,
      abreviacion: datos.abreviacion,
      aniosDuracion: datos.anios,
      materias: [],
    };
    setCarreraActual(nueva);
  };

  return {
    carreraActual,
    setCarreraActual,
    materias,
    aniosDuracion,
    resetKey,
    cambiarCarrera,
    cargarCarreraLCC,
    cargarCarreraLSI,
    cargarCarreraTUASSL,
    cargarCarreraTUDW,
    importarProgreso,
    exportarProgreso,
    actualizarMaterias,
    crearNuevaCarrera,
    cargarCarreraCustom,
    resetearPosiciones,
    posicionesIniciales,
  };
}
