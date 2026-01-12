-- AlterTable
ALTER TABLE `leadrecord` ALTER COLUMN `updated_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `leads` ALTER COLUMN `updated_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `users` ALTER COLUMN `updated_at` DROP DEFAULT;
