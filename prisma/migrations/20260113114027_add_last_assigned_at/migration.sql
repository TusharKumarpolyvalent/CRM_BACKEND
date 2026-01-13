-- AlterTable
ALTER TABLE `LeadRecord` ALTER COLUMN `updated_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `Leads` ADD COLUMN `last_assigned_at` DATETIME(3) NULL,
    ALTER COLUMN `updated_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `Users` ALTER COLUMN `updated_at` DROP DEFAULT;