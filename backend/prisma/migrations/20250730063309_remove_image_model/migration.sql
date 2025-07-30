/*
  Warnings:

  - You are about to drop the `image` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `image` DROP FOREIGN KEY `Image_portfolioId_fkey`;

-- AlterTable
ALTER TABLE `portfolio` ADD COLUMN `imageUrl` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `image`;
