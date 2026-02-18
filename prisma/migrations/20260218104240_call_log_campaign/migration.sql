-- AlterTable
-- ALTER TABLE `CallLog` ADD COLUMN `campaign_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `LeadRecord` ALTER COLUMN `updated_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `Leads` ALTER COLUMN `updated_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `Users` ALTER COLUMN `updated_at` DROP DEFAULT;
