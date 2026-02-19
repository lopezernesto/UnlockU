import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import { useState } from "react";

export function useAuth() {
  const queryClient = useQueryClient();

  const [isGuest, setIsGuest] = useState(() => {
    return localStorage.getItem("guest-mode") === "true";
  });

  // Query para obtener el usuario actual
  const { data: user, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: api.getMe,
    staleTime: 5 * 60 * 1000,
    enabled: !isGuest,
  });

  const logoutMutation = useMutation({
    mutationFn: api.logout,
    onSuccess: () => {
      queryClient.setQueryData(["auth", "me"], null);
      queryClient.clear();
      localStorage.removeItem("guest-mode");
      localStorage.removeItem("carrera-data");
      localStorage.removeItem("nodos-posiciones");
      setIsGuest(false);
    },
  });
  const enableGuestMode = () => {
    localStorage.setItem("guest-mode", "true");
    setIsGuest(true);
  };
  return {
    user,
    isAuthenticated: !!user || isGuest,
    isGuest,
    isLoading: isGuest ? false : isLoading,
    enableGuestMode,
    login: api.login,
    logout: () => logoutMutation.mutate(),
  };
}
