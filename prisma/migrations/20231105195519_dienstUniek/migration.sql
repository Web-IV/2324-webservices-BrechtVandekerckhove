/*
  Warnings:

  - A unique constraint covering the columns `[naam]` on the table `Dienst` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Dienst_naam_key` ON `dienst`(`naam`);
