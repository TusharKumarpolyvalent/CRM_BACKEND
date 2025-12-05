-- AlterTable
ALTER TABLE `campaign` ALTER COLUMN `updated_at` DROP DEFAULT;

-- CreateTable
CREATE TABLE `Activity` (
    `activity_id` VARCHAR(191) NOT NULL,
    `id` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `agentId` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`activity_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
