-- DropForeignKey
ALTER TABLE `Maaltijd` DROP FOREIGN KEY `Maaltijd_bestellingsnr_fkey`;

-- AddForeignKey
ALTER TABLE `Maaltijd` ADD CONSTRAINT `Maaltijd_bestellingsnr_fkey` FOREIGN KEY (`bestellingsnr`) REFERENCES `Bestelling`(`bestellingsnr`) ON DELETE CASCADE ON UPDATE CASCADE;
