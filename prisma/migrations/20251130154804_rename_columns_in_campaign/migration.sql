/*
  Warnings:

  - You are about to drop the column `created_date` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `updated_date` on the `Campaign` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `Campaign` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- Rename both columns with correct types & constraints
ALTER TABLE `Campaign`
  CHANGE COLUMN `created_date` `created_at` DATE NULL,
  CHANGE COLUMN `updated_date` `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0);
