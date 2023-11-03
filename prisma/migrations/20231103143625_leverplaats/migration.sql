/*
  Warnings:

  - Added the required column `leverplaats` to the `Maaltijd` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `maaltijd` ADD COLUMN `leverplaats` VARCHAR(191) NOT NULL;
