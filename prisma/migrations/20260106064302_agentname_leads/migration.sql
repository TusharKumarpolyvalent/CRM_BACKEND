/*
  Warnings:

  - You are about to drop the column `agentname` on the `leads` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `leads`
ADD COLUMN `agentname_leads` VARCHAR(191) NULL;

