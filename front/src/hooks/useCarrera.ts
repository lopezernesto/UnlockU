import { useState, useCallback, useEffect, useMemo } from "react";
import { carreraLCC } from "../data/LCC";
import { carreraTUADYSL } from "../data/TUADYSL";
import type { CarreraData } from "../types/Carrera";
import type { EstadoMateria, MateriaData } from "../types/Materia";
import { api } from "../services/api";
import { recalcularEstados } from "../utils/utils";
import { useQueryClient } from "@tanstack/react-query";

export default function useCarrera(isAuthenticated: boolean, isGuest: boolean) {
  const queryClient = useQueryClient();
  const debeUsarBackend = isAuthenticated && !isGuest;
  const [carreraActual, setCarreraActual] = useState<CarreraData | null>(() => {
    const guardado = localStorage.getItem("carrera-data");
    return guardado ? JSON.parse(guardado) : null;
  });
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
            anioFinal: undefined,
          }));

          api
            .updateCarrera(prev.id, {
              nombre: prev.nombre,
              abreviacion: prev.abreviacion,
              aniosDuracion: prev.aniosDuracion,
              materias: materiasLimpias,
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
                  fecha:
                    nueva.estado === "APROBADA"
                      ? nueva.anioFinal
                      : nueva.anioCursada,
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
    [debeUsarBackend],
  );

  function aplicarProgreso(carrera: CarreraData, progreso: any[]): CarreraData {
    const materiasConProgreso = carrera.materias.map((m) => {
      const p = progreso.find((p) => p.materiaId === m.id);
      if (!p) return m;
      return {
        ...m,
        estado: p.estado,
        nota: p.nota ?? undefined,
        anioCursada: p.estado === "CURSADA" ? p.fecha : undefined,
        anioFinal: p.estado === "APROBADA" ? p.fecha : undefined,
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
        setTimeout(() => {
          const posicionesMap: Record<string, { x: number; y: number }> = {};
          posiciones.forEach((p: any) => {
            posicionesMap[p.materiaId] = { x: p.x, y: p.y };
          });
          localStorage.setItem(
            "nodos-posiciones",
            JSON.stringify(posicionesMap),
          );
          setCarreraActual(carreraConProgreso);
        }, 0);
      }
    },
    [limpiarLocalStorage, debeUsarBackend],
  );

  const cargarCarreraLCC = useCallback(async () => {
    limpiarLocalStorage();
    if (debeUsarBackend) {
      try {
        const [carrera, progreso, posiciones] = await Promise.all([
          api.getCarrera(carreraLCC.id),
          api.getProgreso(carreraLCC.id),
          api.getPosiciones(carreraLCC.id),
        ]);
        const carreraConProgreso = aplicarProgreso(carrera, progreso);
        setTimeout(() => {
          const posicionesMap: Record<string, { x: number; y: number }> = {};
          posiciones.forEach((p: any) => {
            posicionesMap[p.materiaId] = { x: p.x, y: p.y };
          });
          localStorage.setItem(
            "nodos-posiciones",
            JSON.stringify(posicionesMap),
          );
          setCarreraActual(carreraConProgreso);
        }, 0);
      } catch {
        // Primera vez: guardar la estructura en el back y cargar sin progreso
        await api.saveCarrera({
          id: carreraLCC.id,
          nombre: carreraLCC.nombre,
          abreviacion: carreraLCC.abreviacion,
          aniosDuracion: carreraLCC.aniosDuracion,
          materias: carreraLCC.materias,
        });
        queryClient.invalidateQueries({ queryKey: ["carreras", "custom"] });
        setTimeout(() => setCarreraActual(carreraLCC), 0);
      }
    } else {
      setTimeout(() => setCarreraActual(carreraLCC), 0);
    }
  }, [limpiarLocalStorage, debeUsarBackend]);

  const cargarTecnicaturaADYSL = useCallback(async () => {
    limpiarLocalStorage();
    if (debeUsarBackend) {
      try {
        const [carrera, progreso, posiciones] = await Promise.all([
          api.getCarrera(carreraTUADYSL.id),
          api.getProgreso(carreraTUADYSL.id),
          api.getPosiciones(carreraTUADYSL.id),
        ]);
        const carreraConProgreso = aplicarProgreso(carrera, progreso);
        setTimeout(() => {
          const posicionesMap: Record<string, { x: number; y: number }> = {};
          posiciones.forEach((p: any) => {
            posicionesMap[p.materiaId] = { x: p.x, y: p.y };
          });
          localStorage.setItem(
            "nodos-posiciones",
            JSON.stringify(posicionesMap),
          );
          setCarreraActual(carreraConProgreso);
        }, 0);
      } catch {
        // Primera vez: guardar la estructura en el back y cargar sin progreso
        await api.deleteProgresoCarrera(carreraTUADYSL.id).catch(() => {});
        await api.saveCarrera({
          id: carreraTUADYSL.id,
          nombre: carreraTUADYSL.nombre,
          abreviacion: carreraTUADYSL.abreviacion,
          aniosDuracion: carreraTUADYSL.aniosDuracion,
          materias: carreraTUADYSL.materias,
        });
        queryClient.invalidateQueries({ queryKey: ["carreras", "custom"] });
        setTimeout(() => setCarreraActual(carreraTUADYSL), 0);
      }
    } else {
      setTimeout(() => {
        setCarreraActual(carreraTUADYSL);
      }, 0);
    }
  }, [limpiarLocalStorage, debeUsarBackend]);

  const importarProgreso = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
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

    const dataStr = JSON.stringify(carreraActual, null, 2);
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
    setTimeout(() => {
      setCarreraActual(null);
    }, 0);
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
    cargarTecnicaturaADYSL,
    importarProgreso,
    exportarProgreso,
    actualizarMaterias,
    crearNuevaCarrera,
    cargarCarreraCustom,
    resetearPosiciones,
  };
}
