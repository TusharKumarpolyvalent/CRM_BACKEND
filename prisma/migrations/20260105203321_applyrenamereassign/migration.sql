/*
  Warnings:

  - You are about to drop the column `passed_to_client` on the `leads` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Campaign` ALTER COLUMN `updated_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `Leads` DROP COLUMN `passed_to_client`,
    ADD COLUMN `reassign` VARCHAR(191) NULL;
