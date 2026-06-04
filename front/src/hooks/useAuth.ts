import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "../services/api";
import { useState } from "react";
import type { UsuarioAuth } from "../types/Auth";

export function useAuth() {
  const [isGuest, setIsGuest] = useState(() => {
    return localStorage.getItem("guest-mode") === "true";
  });

  // Query para obtener el usuario actual
  const { data: user, isLoading } = useQuery<UsuarioAuth | null>({
    queryKey: ["auth", "me"],
    queryFn: api.getMe,
    staleTime: 5 * 60 * 1000,
    enabled: !isGuest,
  });

  const limpiarSesion = () => {
    localStorage.removeItem("guest-mode");
    localStorage.removeItem("carrera-data");
    localStorage.removeItem("nodos-posiciones");
    localStorage.removeItem("react-flow-viewport");
    window.location.href = "/";
  };
  const logoutMutation = useMutation({
    mutationFn: api.logout,
    onSuccess: limpiarSesion,
    onError: limpiarSesion,
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
