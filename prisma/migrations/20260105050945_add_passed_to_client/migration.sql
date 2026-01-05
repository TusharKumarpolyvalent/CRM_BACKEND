-- AlterTable
ALTER TABLE `Campaign` ALTER COLUMN `updated_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `Leads` ADD COLUMN `passed_to_client` BOOLEAN NOT NULL DEFAULT false;
