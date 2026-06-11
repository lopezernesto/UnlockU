FROM node:22-alpine

WORKDIR /app

COPY . .

RUN corepack enable && corepack prepare pnpm@11.5.2 --activate

COPY package*.json pnpm-lock.yaml ./

# Instalar dependencias con el archivo .npmrc ya configurado
RUN pnpm install --frozen-lockfile

EXPOSE 3000

CMD ["pnpm", "build"]
CMD ["pnpm", "start"]