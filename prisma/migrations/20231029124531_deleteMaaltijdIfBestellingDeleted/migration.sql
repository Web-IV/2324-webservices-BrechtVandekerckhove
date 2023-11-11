-- DropForeignKey
ALTER TABLE `maaltijd` DROP FOREIGN KEY `Maaltijd_bestellingsnr_fkey`;

-- AddForeignKey
ALTER TABLE `maaltijd` ADD CONSTRAINT `Maaltijd_bestellingsnr_fkey` FOREIGN KEY (`bestellingsnr`) REFERENCES `bestelling`(`bestellingsnr`) ON DELETE CASCADE ON UPDATE CASCADE;
