-- AlterTable
ALTER TABLE `Campaign` ALTER COLUMN `updated_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `Leads` ADD COLUMN `reason` VARCHAR(191) NOT NULL DEFAULT '';
