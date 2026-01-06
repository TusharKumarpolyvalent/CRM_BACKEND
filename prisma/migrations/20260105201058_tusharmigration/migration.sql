-- AlterTable
ALTER TABLE `campaign` ALTER COLUMN `updated_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `leads` ADD COLUMN `reassign` VARCHAR(191) NULL;
