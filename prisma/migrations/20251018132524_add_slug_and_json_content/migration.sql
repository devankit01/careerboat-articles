/*
  Warnings:

  - You are about to alter the column `content` on the `Article` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Json`.
  - A unique constraint covering the columns `[slug]` on the table `Article` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Article` ADD COLUMN `slug` VARCHAR(191) NOT NULL,
    MODIFY `content` JSON NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Article_slug_key` ON `Article`(`slug`);
