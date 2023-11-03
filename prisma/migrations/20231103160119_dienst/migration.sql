/*
  Warnings:

  - You are about to drop the column `leverplaats` on the `maaltijd` table. All the data in the column will be lost.
  - You are about to drop the column `dienst` on the `medewerker` table. All the data in the column will be lost.
  - Added the required column `leverplaatsId` to the `Maaltijd` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dienstId` to the `Medewerker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `maaltijd` DROP COLUMN `leverplaats`,
    ADD COLUMN `leverplaatsId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `medewerker` DROP COLUMN `dienst`,
    ADD COLUMN `dienstId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Dienst` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `naam` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Medewerker` ADD CONSTRAINT `Medewerker_dienstId_fkey` FOREIGN KEY (`dienstId`) REFERENCES `Dienst`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Maaltijd` ADD CONSTRAINT `Maaltijd_leverplaatsId_fkey` FOREIGN KEY (`leverplaatsId`) REFERENCES `Dienst`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
