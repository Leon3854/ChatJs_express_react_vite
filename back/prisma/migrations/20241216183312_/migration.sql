/*
  Warnings:

  - The `lastMessageStatus` column on the `Info` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Info" DROP COLUMN "lastMessageStatus",
ADD COLUMN     "lastMessageStatus" BOOLEAN;
