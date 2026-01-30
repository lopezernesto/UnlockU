import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; // <--- IMPORTA ESTO

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <--- AGREGA ESTO
  ],
});
