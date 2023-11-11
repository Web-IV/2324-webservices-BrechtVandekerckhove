/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Medewerker` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Medewerker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rollen` to the `Medewerker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wachtwoord_hash` to the `Medewerker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `medewerker` ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `rollen` JSON NOT NULL,
    ADD COLUMN `wachtwoord_hash` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Medewerker_email_key` ON `medewerker`(`email`);
