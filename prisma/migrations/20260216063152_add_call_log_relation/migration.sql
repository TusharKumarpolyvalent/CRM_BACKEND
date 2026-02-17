/*
  Warnings:

  - You are about to alter the column `attempts` on the `leads` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `leadrecord` ALTER COLUMN `updated_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `leads` MODIFY `attempts` INTEGER NOT NULL DEFAULT 0,
    ALTER COLUMN `updated_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `users` ALTER COLUMN `updated_at` DROP DEFAULT;

-- CreateTable
CREATE TABLE `CallLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lead_id` INTEGER NOT NULL,
    `agent_id` VARCHAR(191) NOT NULL,
    `called_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CallLog` ADD CONSTRAINT `CallLog_lead_id_fkey` FOREIGN KEY (`lead_id`) REFERENCES `Leads`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
