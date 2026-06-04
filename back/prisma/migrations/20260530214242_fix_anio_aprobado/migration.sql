/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `CarreraCustom` table. All the data in the column will be lost.
  - You are about to drop the column `fecha` on the `ProgresoMateria` table. All the data in the column will be lost.
  - You are about to alter the column `nota` on the `ProgresoMateria` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Added the required column `actualizadoEn` to the `CarreraCustom` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actualizadoEn` to the `ProgresoMateria` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PosicionNodo" DROP CONSTRAINT "PosicionNodo_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "ProgresoMateria" DROP CONSTRAINT "ProgresoMateria_usuarioId_fkey";

-- AlterTable
ALTER TABLE "CarreraCustom" DROP COLUMN "updatedAt",
ADD COLUMN     "actualizadoEn" TIMESTAMP(3) NOT NULL NOT NULL DEFAULT NOW();

-- AlterTable
ALTER TABLE "ProgresoMateria" DROP COLUMN "fecha",
ADD COLUMN     "actualizadoEn" TIMESTAMP(3) NOT NULL NOT NULL DEFAULT NOW(),
ADD COLUMN     "anioAprobado" INTEGER,
ADD COLUMN     "anioCursada" INTEGER,
ALTER COLUMN "nota" SET DATA TYPE INTEGER;

-- AddForeignKey
ALTER TABLE "ProgresoMateria" ADD CONSTRAINT "ProgresoMateria_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PosicionNodo" ADD CONSTRAINT "PosicionNodo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
