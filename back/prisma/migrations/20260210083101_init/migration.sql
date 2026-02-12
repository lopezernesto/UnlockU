-- CreateEnum
CREATE TYPE "EstadoMateria" AS ENUM ('CURSADA', 'APROBADA');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "googleId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "foto" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgresoMateria" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "carreraId" TEXT NOT NULL,
    "materiaId" TEXT NOT NULL,
    "estado" "EstadoMateria" NOT NULL,
    "nota" DOUBLE PRECISION,
    "fecha" TIMESTAMP(3),

    CONSTRAINT "ProgresoMateria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PosicionNodo" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "carreraId" TEXT NOT NULL,
    "materiaId" TEXT NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PosicionNodo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarreraCustom" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "materias" JSONB NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CarreraCustom_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_googleId_key" ON "Usuario"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ProgresoMateria_usuarioId_carreraId_materiaId_key" ON "ProgresoMateria"("usuarioId", "carreraId", "materiaId");

-- CreateIndex
CREATE UNIQUE INDEX "PosicionNodo_usuarioId_carreraId_materiaId_key" ON "PosicionNodo"("usuarioId", "carreraId", "materiaId");

-- AddForeignKey
ALTER TABLE "ProgresoMateria" ADD CONSTRAINT "ProgresoMateria_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PosicionNodo" ADD CONSTRAINT "PosicionNodo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarreraCustom" ADD CONSTRAINT "CarreraCustom_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
