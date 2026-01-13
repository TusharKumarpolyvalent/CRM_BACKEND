-- AlterTable
ALTER TABLE `Leadrecord` ALTER COLUMN `updated_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `Leads` ALTER COLUMN `updated_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `Users` ALTER COLUMN `updated_at` DROP DEFAULT;