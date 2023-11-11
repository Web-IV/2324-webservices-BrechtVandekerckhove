/*
  Warnings:

  - A unique constraint covering the columns `[maand,vegie]` on the table `SuggestieVanDeMaand` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `SuggestieVanDeMaand_maand_vegie_key` ON `suggestieVanDeMaand`(`maand`, `vegie`);
