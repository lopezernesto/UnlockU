import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import type { CarreraData, CarreraResumen } from "../types/Carrera";

export function useCarrerasCustom(isAuthenticated: boolean, isGuest: boolean) {
  const queryClient = useQueryClient();

  // Listar carreras custom del usuario
  const { data: carreras = [], isLoading } = useQuery({
    queryKey: ["carreras", "custom"],
    queryFn: async () => {
      const result = await api.getCarreras();
      // Transformar del formato backend al formato frontend
      return result.map((c: any) => ({
        id: c.id,
        nombre: c.nombre,
        abreviacion: c.abreviacion,
        aniosDuracion: c.aniosDuracion,
      })) as CarreraResumen[];
    },
    enabled: isAuthenticated && !isGuest,
  });

  // Crear carrera
  const crearMutation = useMutation({
    mutationFn: (carrera: CarreraData) =>
      api.saveCarrera({
        nombre: carrera.nombre,
        abreviacion: carrera.abreviacion,
        aniosDuracion: carrera.aniosDuracion,
        materias: carrera.materias,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carreras", "custom"] });
    },
  });

  // Actualizar carrera
  const actualizarMutation = useMutation({
    mutationFn: ({ id, carrera }: { id: string; carrera: CarreraData }) =>
      api.updateCarrera(id, {
        nombre: carrera.nombre,
        abreviacion: carrera.abreviacion,
        aniosDuracion: carrera.aniosDuracion,
        materias: carrera.materias,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carreras", "custom"] });
    },
  });

  // Borrar carrera
  const borrarMutation = useMutation({
    mutationFn: (id: string) => api.deleteCarrera(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carreras", "custom"] });
    },
  });

  return {
    carreras,
    isLoading,
    crearCarrera: (carrera: CarreraData) => crearMutation.mutateAsync(carrera),
    actualizarCarrera: (id: string, carrera: CarreraData) =>
      actualizarMutation.mutateAsync({ id, carrera }),
    borrarCarrera: (id: string) => borrarMutation.mutateAsync(id),
  };
}
