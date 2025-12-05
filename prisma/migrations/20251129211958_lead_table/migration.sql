-- AlterTable
ALTER TABLE `campaign` ALTER COLUMN `updated_date` DROP DEFAULT;

-- CreateTable
CREATE TABLE `Leads` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campaign_id` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `product` VARCHAR(191) NULL,
    `source` VARCHAR(191) NULL,
    `status` VARCHAR(191) NULL DEFAULT 'New',
    `assigned_to` VARCHAR(191) NULL,
    `attempts` VARCHAR(191) NOT NULL DEFAULT '0',
    `last_call` DATETIME(3) NULL,
    `followup_at` DATETIME(3) NULL,
    `doc_status` ENUM('pending', 'received', 'closed') NOT NULL DEFAULT 'pending',
    `remarks` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
