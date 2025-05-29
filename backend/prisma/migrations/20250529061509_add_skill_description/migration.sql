/*
  Warnings:

  - You are about to drop the column `userId` on the `contact` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `contact` DROP FOREIGN KEY `Contact_userId_fkey`;

-- DropIndex
DROP INDEX `Contact_userId_fkey` ON `contact`;

-- AlterTable
ALTER TABLE `contact` DROP COLUMN `userId`;

-- AlterTable
ALTER TABLE `skill` ADD COLUMN `description` VARCHAR(191) NULL;
