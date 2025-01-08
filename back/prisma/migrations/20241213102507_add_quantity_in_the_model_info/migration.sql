/*
  Warnings:

  - You are about to drop the column `times` on the `Chat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "times";

-- AlterTable
ALTER TABLE "Info" ADD COLUMN     "quantity" INTEGER;
