/*
  Warnings:

  - Made the column `name` on table `contact` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `contact` MODIFY `name` VARCHAR(191) NOT NULL;
