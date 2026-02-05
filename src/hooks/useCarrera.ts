import { useState, useCallback, useEffect } from "react";
import { carreraLCC } from "../data/LCC";
import { carreraTUADYSL } from "../data/TUADYSL";
import type { CarreraData } from "../types/Carrera";
import type { MateriaData } from "../types/Materia";

export default function useCarrera() {
  const [carreraActual, setCarreraActual] = useState<CarreraData | null>(() => {
    const guardado = localStorage.getItem("carrera-data");
    return guardado ? JSON.parse(guardado) : null;
  });
  const materias = carreraActual?.materias ?? [];
  const aniosDuracion = carreraActual?.aniosDuracion || 5;
  // Key para forzar reset completo cuando cambia el dataset
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (carreraActual) {
      localStorage.setItem("carrera-data", JSON.stringify(carreraActual));
    }
  }, [carreraActual]);

  const limpiarLocalStorage = useCallback(() => {
    localStorage.removeItem("nodos-posiciones");
    localStorage.removeItem("react-flow-viewport");
    setResetKey((prev) => prev + 1);
  }, []);

  const actualizarMaterias = useCallback((nuevasMaterias: MateriaData[]) => {
    setCarreraActual((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        materias: nuevasMaterias,
      };
    });
  }, []);

  const cargarCarreraLCC = useCallback(() => {
    limpiarLocalStorage();
    setTimeout(() => {
      setCarreraActual(carreraLCC);
    }, 0);
  }, [limpiarLocalStorage]);

  const cargarTecnicaturaADYSL = useCallback(() => {
    limpiarLocalStorage();
    setTimeout(() => {
      setCarreraActual(carreraTUADYSL);
    }, 0);
  }, [limpiarLocalStorage]);

  const importarProgreso = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          limpiarLocalStorage();
          setTimeout(() => {
            setCarreraActual(json);
          }, 0);
        } catch (err) {
          alert("Error: El archivo no tiene un formato válido.");
        }
      };
      reader.readAsText(file);
    },
    [limpiarLocalStorage],
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
  };
}
