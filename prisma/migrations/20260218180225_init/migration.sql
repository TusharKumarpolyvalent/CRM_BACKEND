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

-- CreateTable
CREATE TABLE `Campaign` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `client_name` VARCHAR(191) NULL,
    `status` VARCHAR(191) NULL DEFAULT '1',
    `description` VARCHAR(191) NULL,
    `start_date` DATE NULL,
    `end_date` DATE NULL,
    `meta_date` DATE NULL,
    `created_at` DATE NULL,
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- CreateTable
CREATE TABLE `Leads` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campaign_id` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `city` LONGTEXT NULL,
    `product` VARCHAR(191) NULL,
    `source` VARCHAR(191) NULL,
    `status` VARCHAR(191) NULL DEFAULT 'New',
    `assigned_to` VARCHAR(191) NULL,
    `assigned_at` DATETIME(3) NULL,
    `attempts` INTEGER NOT NULL DEFAULT 0,
    `last_call` DATETIME(3) NULL,
    `followup_at` DATETIME(3) NULL,
    `doc_status` ENUM('pending', 'review', 'closed') NOT NULL DEFAULT 'pending',
    `remarks` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `pincode` VARCHAR(191) NOT NULL DEFAULT '',
    `reason` VARCHAR(191) NOT NULL DEFAULT '',
    `reassign` VARCHAR(191) NULL,
    `checkedclientlead` BOOLEAN NOT NULL DEFAULT false,
    `agentname_leads` VARCHAR(191) NULL,
    `last_assigned_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CallLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lead_id` INTEGER NOT NULL,
    `agent_id` VARCHAR(191) NOT NULL,
    `campaign_id` VARCHAR(191) NULL,
    `called_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Users` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('admin', 'agent') NOT NULL DEFAULT 'agent',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Leads` ADD CONSTRAINT `Leads_campaign_id_fkey` FOREIGN KEY (`campaign_id`) REFERENCES `Campaign`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CallLog` ADD CONSTRAINT `CallLog_lead_id_fkey` FOREIGN KEY (`lead_id`) REFERENCES `Leads`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
