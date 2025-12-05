-- AlterTable
ALTER TABLE `Campaign` ALTER COLUMN `updated_at` DROP DEFAULT;

-- CreateTable
CREATE TABLE `LeadRecord` (
    `id` VARCHAR(191) NOT NULL,
    `status1` VARCHAR(191) NULL,
    `status2` VARCHAR(191) NULL,
    `status3` VARCHAR(191) NULL,
    `remark1` VARCHAR(191) NULL,
    `remark2` VARCHAR(191) NULL,
    `remark3` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
