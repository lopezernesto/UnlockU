const API_URL = "http://localhost:3000";

export const api = {
  // Auth
  login: () => {
    window.location.href = `${API_URL}/auth/google`;
  },

  logout: async () => {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  },

  getMe: async () => {
    const res = await fetch(`${API_URL}/auth/me`, {
      credentials: "include",
    });
    if (!res.ok) return null;
    return res.json();
  },

  // Progreso
  getProgreso: async (carreraId: string) => {
    const res = await fetch(`${API_URL}/api/progreso/${carreraId}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Error al obtener progreso");
    return res.json();
  },

  saveProgreso: async (data: {
    carreraId: string;
    materiaId: string;
    estado: "CURSADA" | "APROBADA";
    nota?: number;
    fecha?: string;
  }) => {
    const res = await fetch(`${API_URL}/api/progreso`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al guardar progreso");
    return res.json();
  },

  deleteProgreso: async (carreraId: string, materiaId: string) => {
    const res = await fetch(
      `${API_URL}/api/progreso/${carreraId}/${materiaId}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );
    if (!res.ok) throw new Error("Error al resetear progreso");
    return res.json();
  },

  // Posiciones
  getPosiciones: async (carreraId: string) => {
    const res = await fetch(`${API_URL}/api/posiciones/${carreraId}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Error al obtener posiciones");
    return res.json();
  },

  savePosicion: async (data: {
    carreraId: string;
    materiaId: string;
    x: number;
    y: number;
  }) => {
    const res = await fetch(`${API_URL}/api/posiciones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al guardar posición");
    return res.json();
  },

  deletePosiciones: async (carreraId: string) => {
    const res = await fetch(`${API_URL}/api/posiciones/${carreraId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Error al resetear posiciones");
    return res.json();
  },

  // Carreras custom
  getCarreras: async () => {
    const res = await fetch(`${API_URL}/api/carreras`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Error al obtener carreras");
    return res.json();
  },

  getCarrera: async (id: string) => {
    const res = await fetch(`${API_URL}/api/carreras/${id}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Error al obtener carrera");
    return res.json();
  },

  saveCarrera: async (data: { nombre: string; materias: any[] }) => {
    const res = await fetch(`${API_URL}/api/carreras`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al crear carrera");
    return res.json();
  },

  updateCarrera: async (
    id: string,
    data: { nombre: string; materias: any[] },
  ) => {
    const res = await fetch(`${API_URL}/api/carreras/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al actualizar carrera");
    return res.json();
  },

  deleteCarrera: async (id: string) => {
    const res = await fetch(`${API_URL}/api/carreras/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Error al borrar carrera");
    return res.json();
  },
};
