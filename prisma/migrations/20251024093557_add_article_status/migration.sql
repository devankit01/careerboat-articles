-- AlterTable
ALTER TABLE `Article` ADD COLUMN `status` ENUM('Draft', 'Published') NOT NULL DEFAULT 'Draft';
