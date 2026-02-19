/*
  Warnings:

  - Added the required column `abreviacion` to the `CarreraCustom` table without a default value. This is not possible if the table is not empty.
  - Added the required column `aniosDuracion` to the `CarreraCustom` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CarreraCustom" DROP CONSTRAINT "CarreraCustom_usuarioId_fkey";

-- AlterTable
ALTER TABLE "CarreraCustom" ADD COLUMN     "abreviacion" TEXT NOT NULL,
ADD COLUMN     "aniosDuracion" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "CarreraCustom" ADD CONSTRAINT "CarreraCustom_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
