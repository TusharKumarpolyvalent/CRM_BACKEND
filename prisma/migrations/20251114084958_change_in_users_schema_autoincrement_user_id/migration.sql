/*
  Warnings:

  - You are about to alter the column `userId` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `userId` INTEGER NOT NULL AUTO_INCREMENT,
    ALTER COLUMN `updatedDate` DROP DEFAULT,
    ADD PRIMARY KEY (`userId`);

-- DropIndex
DROP INDEX `users_userId_key` ON `users`;
