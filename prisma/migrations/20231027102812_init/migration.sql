-- CreateTable
CREATE TABLE `medewerker` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `naam` VARCHAR(191) NOT NULL,
    `voornaam` VARCHAR(191) NOT NULL,
    `dienst` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bestelling` (
    `bestellingsnr` INTEGER NOT NULL AUTO_INCREMENT,
    `besteldatum` DATETIME(3) NOT NULL,
    `medewerkerId` INTEGER NOT NULL,

    PRIMARY KEY (`bestellingsnr`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `suggestieVanDeMaand` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `maand` INTEGER NOT NULL,
    `vegie` BOOLEAN NOT NULL,
    `omschrijving` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `maaltijd` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,
    `leverdatum` DATETIME(3) NOT NULL,
    `hoofdschotel` VARCHAR(191) NULL,
    `soep` BOOLEAN NOT NULL,
    `dessert` VARCHAR(191) NOT NULL,
    `typeSandwiches` VARCHAR(191) NULL,
    `hartigBeleg` VARCHAR(191) NULL,
    `zoetBeleg` VARCHAR(191) NULL,
    `vetstof` BOOLEAN NULL,
    `bestellingsnr` INTEGER NULL,
    `suggestieVanDeMaandId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `bestelling` ADD CONSTRAINT `Bestelling_medewerkerId_fkey` FOREIGN KEY (`medewerkerId`) REFERENCES `medewerker`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `maaltijd` ADD CONSTRAINT `Maaltijd_bestellingsnr_fkey` FOREIGN KEY (`bestellingsnr`) REFERENCES `bestelling`(`bestellingsnr`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `maaltijd` ADD CONSTRAINT `Maaltijd_suggestieVanDeMaandId_fkey` FOREIGN KEY (`suggestieVanDeMaandId`) REFERENCES `suggestieVanDeMaand`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
