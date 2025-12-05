-- CreateTable
CREATE TABLE `Campaign` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `client_name` VARCHAR(191) NULL,
    `status` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `start_date` DATE NULL,
    `end_date` DATE NULL,
    `meta_date` DATE NULL,
    `created_date` DATE NULL,
    `updated_date` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
