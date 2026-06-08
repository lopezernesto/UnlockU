FROM node:18-alpine

WORKDIR /app

RUN npx pnpm@latest-11 dlx @pnpm/exe@latest-11 setup

COPY package*.json ./
COPY prisma ./prisma/

RUN pnpm install
RUN pnpm prisma generate

COPY . .

EXPOSE 3000

CMD ["pnpm", "build"]
CMD ["pnpm", "start"]