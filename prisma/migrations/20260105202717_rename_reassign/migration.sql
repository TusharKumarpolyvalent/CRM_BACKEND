-- AlterTable
ALTER TABLE Leads
CHANGE COLUMN `reassign` `passed_to_client` BOOLEAN NOT NULL DEFAULT FALSE;

