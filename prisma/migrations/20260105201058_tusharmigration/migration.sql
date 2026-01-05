-- AlterTable
ALTER TABLE `Campaign` ALTER COLUMN `updated_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `Leads` ADD COLUMN `reassign` VARCHAR(191) NULL;
