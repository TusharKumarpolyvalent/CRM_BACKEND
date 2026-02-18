-- AlterTable
ALTER TABLE `LeadRecord` ALTER COLUMN `updated_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `Leads` ALTER COLUMN `updated_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `Users` ALTER COLUMN `updated_at` DROP DEFAULT;
-- testingggggg