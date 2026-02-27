import React, { createContext, useContext } from "react";
import { useAuth } from "../hooks/useAuth";

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  enableGuestMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext debe usarse dentro de un AuthProvider");
  }
  return context;
}
