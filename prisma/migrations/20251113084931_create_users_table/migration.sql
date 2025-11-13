-- CreateTable
CREATE TABLE `users` (
    `userPhone` VARCHAR(10) NOT NULL,
    `userPassword` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(20) NOT NULL,
    `firstName` VARCHAR(20) NOT NULL,
    `userEmail` VARCHAR(50) NOT NULL,
    `status` VARCHAR(1) NOT NULL DEFAULT '0',
    `role` VARCHAR(20) NOT NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_userPhone_key`(`userPhone`),
    UNIQUE INDEX `users_userId_key`(`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
