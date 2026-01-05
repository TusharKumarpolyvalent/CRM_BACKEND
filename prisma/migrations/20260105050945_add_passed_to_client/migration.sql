-- AlterTable
ALTER TABLE `campaign` ALTER COLUMN `updated_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `leads` ADD COLUMN `passed_to_client` BOOLEAN NOT NULL DEFAULT false;
