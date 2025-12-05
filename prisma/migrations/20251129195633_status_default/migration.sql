-- AlterTable
ALTER TABLE `Campaign` MODIFY `status` VARCHAR(191) NULL DEFAULT '1',
    ALTER COLUMN `updated_date` DROP DEFAULT;
