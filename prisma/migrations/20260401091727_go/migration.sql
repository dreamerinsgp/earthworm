-- DropIndex
DROP INDEX `UserProgress_courseId_key` ON `UserProgress`;

-- AlterTable
ALTER TABLE `statements` MODIFY `soundmark` VARCHAR(512) NOT NULL;
