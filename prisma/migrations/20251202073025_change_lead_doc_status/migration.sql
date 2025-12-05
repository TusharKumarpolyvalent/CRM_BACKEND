/*
  Warnings:

  - The values [received] on the enum `Leads_doc_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `campaign` ALTER COLUMN `updated_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `leads` MODIFY `doc_status` ENUM('pending', 'review', 'closed') NOT NULL DEFAULT 'pending';
