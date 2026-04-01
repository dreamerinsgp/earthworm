-- AlterTable: English-answer -> pinyin + optional English gloss
ALTER TABLE `statements` ADD COLUMN `pinyin` VARCHAR(512) NOT NULL DEFAULT '';
ALTER TABLE `statements` ADD COLUMN `englishGloss` VARCHAR(512) NULL;

UPDATE `statements` SET `englishGloss` = `english` WHERE `english` IS NOT NULL;

ALTER TABLE `statements` DROP COLUMN `english`;

-- Remove temporary default so new rows must supply pinyin (Prisma has no server default)
ALTER TABLE `statements` ALTER COLUMN `pinyin` DROP DEFAULT;
