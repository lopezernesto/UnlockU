import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";

export function useProgreso(
  carreraId: string | null,
  isAuthenticated: boolean,
  isGuest: boolean,
) {
  const queryClient = useQueryClient();
  const debeUsarBackend = isAuthenticated && !isGuest && carreraId !== null;

  // Obtener progreso del backend al cargar la carrera
  const { data: progresoBackend } = useQuery({
    queryKey: ["progreso", carreraId],
    queryFn: () => api.getProgreso(carreraId!),
    enabled: debeUsarBackend,
  });

  // Guardar progreso de una materia
  const guardarMutation = useMutation({
    mutationFn: api.saveProgreso,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progreso", carreraId] });
    },
  });

  // Resetear progreso de una materia
  const resetearMutation = useMutation({
    mutationFn: ({ materiaId }: { materiaId: string }) =>
      api.deleteProgreso(carreraId!, materiaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progreso", carreraId] });
    },
  });

  const guardarProgreso = (
    materiaId: string,
    estado: "CURSADA" | "APROBADA",
    fecha?: string,
    nota?: number,
  ) => {
    if (!debeUsarBackend) return;
    guardarMutation.mutate({
      carreraId: carreraId!,
      materiaId,
      estado,
      fecha,
      nota,
    });
  };

  const resetearProgreso = (materiaId: string) => {
    if (!debeUsarBackend) return;
    resetearMutation.mutate({ materiaId });
  };

  return {
    progresoBackend,
    guardarProgreso,
    resetearProgreso,
  };
}
