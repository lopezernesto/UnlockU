# --- Etapa 1: Construcción (Build) ---
FROM node:22-alpine AS build

WORKDIR /app

COPY . .

RUN corepack enable && corepack prepare pnpm@11.5.2 --activate

COPY package*.json pnpm-lock.yaml ./

# 1. Declaramos que esperamos el argumento de construcción
ARG VITE_API_URL
# 2. Lo asignamos como variable de entorno para el proceso de Node/Vite
ENV VITE_API_URL=$VITE_API_URL

# Instalar dependencias con el archivo .npmrc ya configurado
RUN pnpm install --frozen-lockfile

RUN pnpm build

# --- Etapa 2: Servidor de Producción ---
FROM nginx:alpine AS production

# Copiamos los archivos estáticos generados por Vite desde la etapa anterior
# Por defecto, Vite compila en la carpeta 'dist'
COPY --from=build /app/dist /usr/share/nginx/html

# Exponemos el puerto 80 que es el que usa Nginx por defecto
EXPOSE 80

# Arrancamos Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]