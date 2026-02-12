import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";

export function useAuth() {
  const queryClient = useQueryClient();

  // Query para obtener el usuario actual
  const { data: user, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: api.getMe,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Mutation para logout
  const logoutMutation = useMutation({
    mutationFn: api.logout,
    onSuccess: () => {
      queryClient.setQueryData(["auth", "me"], null);
      queryClient.clear();
    },
  });

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login: api.login,
    logout: () => logoutMutation.mutate(),
  };
}
