/*
  Warnings:

  - You are about to drop the column `agentname` on the `leads` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Leads` DROP COLUMN `agentname`,
    ADD COLUMN `agentname_leads` VARCHAR(191) NULL;
